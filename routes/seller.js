const express = require("express")
const seller = express.Router()
const cors = require("cors")
const products = require('../model/product')
const users = require('../model/user');
const query = require('../model/userQuery');
const sales = require('../model/sale');
const nodemailer = require('nodemailer');
const adminLogin = require('../model/login');
const report = require('../model/report');

const gmailUserName = 'smartfirealarms@gmail.com';
const gmailPass = 'Pakistan786@';

seller.use(cors())

process.env.SECRET_KEY = 'secret';

seller.post('/addDevice', (req, res) => {
    console.log(req.body);

    devices = []
    for (var i = 0; i < Number(req.body.qty); i++) {
        devices.push({
            type: req.body.type,
            status: false
        })
    }

    setTimeout(() => {
        products.insertMany(devices)
            .then(doc => {
                if (doc) {
                    res.send({ ad: 'OK' });
                }
            })
            .catch(e => {
                console.log(e);
            })
    }, 0);
})

seller.post('/getUser', (req, res) => {
    console.log(req.body);
    users.find({}).then(doc => {
        if (doc) {
            res.send({ 'gu': 'OK', doc: doc });
        } else {
            res.send({ 'gu': 'No User Exists' });
        }
    }).catch(e => {
        console.log(e);
    })
});

seller.post('/getAllQuery', (req, res) => {
    console.log(req.body);
    query.find({}).then(doc => {
        if (doc) {
            res.send({ 'gaq': 'OK', doc: doc });
        } else {
            res.send({ 'gaq': 'No Query Exists' });
        }
    }).catch(e => {
        console.log(e);
    })
})

seller.post('/getSummary', (req, res) => {
    console.log(req.body);

    let totalHubs = 0
    let totalSlaves = 0
    let totalSales = 0
    let totalCustomer = 0;
    users.countDocuments({})
        .then(userC => {
            if (userC) {
                totalCustomer = userC
            } else {
                console.log('no user Found');
            }

            products.countDocuments({ type: 'HUB', status: false })
                .then(hubC => {
                    if (hubC) {
                        totalHubs = hubC;

                    }
                    else {
                        console.log('======= no hub availables')
                    }


                    products.countDocuments({ type: 'SLAVE', status: false })
                        .then(slaveC => {
                            if (slaveC) {
                                totalSlaves = slaveC
                            }
                            else {
                                console.log(' =========  no slave available ====')
                            }

                            sales.countDocuments({})
                                .then(salesC => {
                                    if (salesC) {
                                        totalSales = salesC
                                    } else {
                                        console.log('======= no sale availables==');
                                    }
                                    res.send({
                                        gs: 'OK',
                                        hub: totalHubs,
                                        slave: totalSlaves,
                                        user: totalCustomer,
                                        sale: totalSales
                                    })

                                    console.log('total User ====', totalCustomer,
                                        '\n=========== total hubs====', totalHubs,
                                        '\n======= total slaves=====', totalSlaves,
                                        '\n======== sales =========', totalSales);
                                })
                        })
                })

        })
});

seller.post('/getSales', (req, res) => {
    console.log(req.body);

    sales.aggregate([
        {
            $lookup: {
                from: 'users',
                localField: 'userId',
                foreignField: '_id',
                as: 'salesDetails'
            }
        }
    ])
        .then(doc => {
            if (doc) {
                //console.log('======== joins ===== \n', JSON.stringify(doc, null, 2));
                sendlist = []
                doc.forEach((sale, index) => {
                    let s = {
                        _id: sale._id,
                        date: sale.date,
                        hub: sale.hub,
                        slave: sale.slave,
                        amount: sale.amount,
                        status: sale.status,
                        userName: sale.salesDetails[0].name,
                        email: sale.salesDetails[0].email
                    }
                    sendlist.push(s);

                    if (doc.length == index - 1) {

                    }
                })

                console.log('=============================NEW RES==========================');
                console.log(JSON.stringify(sendlist, null, 2));
                setTimeout(() => {
                    res.send({ gs: 'OK', doc: sendlist })
                }, 0);


            } else {
                res.send({ gs: 'No Sales Founds' });
                console.log('no sales founds');
            }
        })
        .catch(e => {
            console.log(e);
        })

})

seller.post('/sendReply', (req, res) => {
    console.log(req.body);

    id = req.body.id;
    name = req.body.name;
    email = req.body.email;
    message = req.body.message;
    replySms = req.body.replySms;


    query.updateOne(
        { _id: id },
        { status: true }
    ).then(doc => {
        if (doc) {
            res.send({ sr: 'OK' });
        }
    }).catch(e => {
        res.send({ sr: 'failed' });
    })

    var transporter = nodemailer.createTransport({
        service: 'gmail',
        host: 'smtp.gmail.com',
        port: 465,
        secure: true,
        auth: {
            user: gmailUserName,
            pass: gmailPass
        }
    });

    var mailOptions = {
        from: gmailUserName,
        to: email,
        subject: 'Smart Fire Alarm System',
        text: `Dear ${name} \n Your Query : ${message} \n ${replySms}`
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.log(error);
        } else {
            console.log('Email sent: ' + info.response);
            res.send({ sr: 'OK' });
        }
    });


})

seller.post('/login', (req, res) => {
    console.log(req.body);
    adminLogin.findOne({
        email: req.body.email,
        password: req.body.password,
        role: 'admin'
    }).then(doc => {
        if (doc) {
            res.send({ al: 'OK' });
        } else {
            res.send({ al: 'notFound' });
        }
    }).catch(e => {
        res.send({ al: 'failed' });
    })
});

seller.post('/changePass', (req, res) => {
    console.log(req.body);
    adminLogin.updateOne(
        { email: req.body.email, password: req.body.oldPass },
        { password: req.body.newPass }
    ).then(doc => {
        if (doc) {
            console.log('doc found', doc)
            if (doc.nModified > 0) {
                res.send({
                    acp: 'OK'
                })
            } else {
                res.send({
                    acp: 'OldPassWrong'
                })
            }

        } else {
            console.log('no doc found')
            res.send({
                acp: 'OldPassWrong'
            })
        }
    }).catch(e => {
        res.send({
            acp: 'SNP'
        })
    })
});

seller.post('/getReports', (req, res) => {
    console.log(req.body);
    report.find({}).then(doc => {
        if (doc) {
            res.send({ gr: 'OK', doc: doc });
        } else {
            res.send({ gr: 'noData' });
        }
    }).catch(e => {
        console.log(e);
        res.send({ gr: 'failed' });
    })
})

seller.post('/sendReportUpdate', (req, res) => {
    console.log(req.body);
    console.log(req.body.reportId);
    report.updateOne(
        { _id: req.body.reportId },
        { status: req.body.status })
        .then(doc => {
            if (doc.nModified > 0) {
                try {
                    const email = req.body.email,
                        description = req.body.description;
                    var transporter = nodemailer.createTransport({
                        service: 'gmail',
                        host: 'smtp.gmail.com',
                        port: 465,
                        secure: true,
                        auth: {
                            user: gmailUserName,
                            pass: gmailPass
                        }
                    });

                    var mailOptions = {
                        from: gmailUserName,
                        to: email,
                        subject: 'Smart Fire Alarm System',
                        text: `Dear User \n ${description}`
                    };

                    transporter.sendMail(mailOptions, function (error, info) {
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                } catch (e) {
                    console.log(e);
                } finally {
                    res.send({ sru: 'OK' });
                }
            }
        })
})

seller.post('/getSaleData', (req, res) => {
    console.log('get sale data request comes on server ==========');
    sales.aggregate([
        {$group: {
            _id: {$substr: ['$date', 4, 3]}, 
            Orders: {$sum: 1}
        }}
    ]).then(doc => {
        if(doc){
            res.send({res:'ok' , data: doc});
            console.log(doc);
        }
    }).catch(e => {
        console.log('error occur in getSaleData');
    })
});


module.exports = seller