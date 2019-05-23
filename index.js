const express = require('express'),
    http = require('http'),
    app = express(),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
const db = require('./db/db');
const mongoose = require('mongoose');
const stripe = require("stripe")("sk_test_ywGSmVRTxvcRc61SCNEpkqJ1007yKWAI6u");
const FCM = require('fcm-node');

//models
const User = require('../model/user')
const logins = require('../model/login');
const products = require('../model/product');
const userQuries = require('../model/userQuery');
const device = require('../model/device');
const sales = require('../model/sale');
const category = require('../model/category');
const report = require('../model/report');
const serviceReport = require('../model/serviceReports');

const nodemailer = require('nodemailer');
const stripe = require("stripe")("sk_test_ywGSmVRTxvcRc61SCNEpkqJ1007yKWAI6u");

const gmailUserName = 'smartfirealarms@gmail.com';
const gmailPass = 'Pakistan786@';

var serverKey = 'AIzaSyDuidqbHbrqmrjw7iJ-W6KI2_A04TqhSVE';
var fcm = new FCM(serverKey);


app.use(bodyParser.json());
app.use(require("body-parser").text());
app.use(cors());
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)




const mongoURI = "mongodb+srv://smartfirealarms:Pakistan786@fas-y3tyy.mongodb.net/test?retryWrites=true";
var Users = require('./routes/user')
var Seller = require('./routes/seller')


mongoose
    .connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))


app.use('/users', Users)

app.post('/users/register', (req, res) => {

    logins.findOne({
        email: req.body.email
    }).then(doc => {
        if (doc) {
            res.send({ 'reg': 'Email already exists' })
        } else {
            logins.create({
                email: req.body.email,
                password: req.body.password
            }).then(logindoc => {
                console.log('========== doc ========\n', logindoc);



                const dev = {
                    userId: logindoc._id
                }
                device.create(dev)
                    .then(res => {
                        if (res) {
                            console.log('user insert sucessfully');
                        }
                    }).catch(e => {
                        console.log(e);
                    });

                category.create({ _id: logindoc._id })
                    .then(res => {
                        console.log(res);
                        category.updateOne(
                            { _id: logindoc._id },
                            {
                                $push: {
                                    categories: 'ALL'
                                }
                            }
                        ).then(r => {
                            console.log('===== push sucess ==', r);

                        }).catch(e => {
                            console.log(e);
                        })
                    })
                    .catch(e => {
                        console.log(e)
                    })




                const NewUser = {
                    _id: logindoc._id,
                    name: req.body.name,
                    phoneNo: req.body.phoneNo,
                    email: req.body.email,
                    city: req.body.city,
                    address: req.body.address,
                    password: req.body.password
                }
                User.create(NewUser).then(userdoc => {


                    res.send({
                        'reg': 'OK',
                        res: userdoc
                    })
                }).catch(e => {
                    res.send({ req: 'Some Network Problem' });
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
                    to: req.body.email,
                    subject: 'Smart Fire Alarm System',
                    text: `Click on the link to Verify your email \n http://localhost:8080/verify/${logindoc._id}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log('======= Email error ============', error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });


            }).catch(err => {
                console.log('========== error ============\n', err);
            });



        }
    })
})


// 192.168.1.8:3000/users/login
app.post('/users/login', (req, res) => {

    logins.findOne({
        email: req.body.email,
        password: req.body.password
    }).then(doc => {
        if (doc) {
            console.log('user found sucessfully\n', doc);
            User.findOne({ _id: doc._id })
                .then(user => {
                    console.log('found user details\n', user);
                    if (user) {
                        res.send({ 'login': 'OK', res: user });
                    } else {
                        res.send({ 'login': 'No User Data Exists' });
                    }
                })
                .catch(e => {
                    console.log(e);
                    res.send({ 'login': 'Some Network Problem' })
                })
        } else {
            console.log('user not exists\n', doc);
            res.send({ 'login': 'Email or Password are wrong' });
        }
    }).catch(err => {
        console.log(err);
        res.send({ 'login': 'Some Network Problem' })
    })

})

app.post('/users/changePassword', (req, res) => {
    console.log(req.body);

    logins.findOne({
        email: req.body.email,
        password: req.body.oldPass
    }).then(doc => {
        if (doc) {
            logins.updateOne({ email: req.body.email, password: req.body.oldPass }, { $set: { password: req.body.newPass } })
                .then(result => {
                    if (result) {
                        res.send({ cp: 'OK', res: result });
                    } else {
                        res.send({ cp: 'Some Problem Occur' })
                    }
                }).catch(e => {
                    console.log(e);
                })
        } else {
            res.send({ 'cp': 'Old Password wrong' });
        }
    })
})

app.post('/users/updateProfile', (req, res) => {
    console.log(req.body);

    User.updateOne({ email: req.body.email }, { $set: { phoneNo: req.body.phoneNo, address: req.body.address, name: req.body.name } })
        .then(doc => {
            console.log(doc);
            if (doc.ok == 1) {
                res.send({ 'up': 'OK' });
            } else {
                res.send({ 'up': 'Some Problem Occur Please Try Again' });
            }
        })
})

app.post('/users/getQty', (req, res) => {
    console.log('=========== get qty function ================');
    console.log(req.body);
    products.aggregate([
        {
            $match:
            {
                'status': false,
            }
        },
        {
            $group: {
                _id: '$type',
                count: { $sum: 1 }
            }
        }
    ]).then(doc => {
        if (doc) {
            res.send({ gq: 'OK', doc: doc })
        } else {
            res.send({ gq: 'NO Items Found' });
        }
    }).catch(e => {
        res.send({ gq: 'error', err: e });
    })
});

app.post('/users/contact', (req, res) => {
    console.log('=============contact =========', req.body);
    userQuries.create({
        name: req.body.name,
        email: req.body.email,
        phoneNo: req.body.phoneNo,
        message: req.body.message
    }).then(doc => {
        if (doc) {
            console.log('your query submit sucessfully', doc);
            res.send({ 'con': 'OK' });

            let senderEmail = req.body.email


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
                to: senderEmail,
                subject: 'Smart Fire Alarm System',
                text: 'Your message have been recieved. we will contact you as soon as possible'
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });


        } else {
            console.log('some error')
        }
    }).catch(e => {
        console.log(e);
    })
})


app.post('/users/buyProduct', (req, res) => {
    console.log('================== buy product =======');
    console.log(req.body);

    let userId = '';
    let devId = '';
    let saleId = '';
    logins.findOne({ email: req.body.email })
        .then(udoc => {
            if (udoc) {
                console.log(udoc._id);
                userId = udoc._id

                const sal = {
                    userId: userId,
                    date: (new Date()),
                    hub: req.body.hub,
                    slave: req.body.slave,
                    amount: req.body.shipping
                }

                sales.create(sal)
                    .then(res => {
                        if (res) {

                            saleId = res._id
                            console.log('====================Sale Id ==============\n', saleId, '\n =====================');

                            senderEmail = req.body.email
                            date = new Date()
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
                                to: senderEmail,
                                subject: 'Smart Fire Alarm System',
                                text: `Your order number # ${res._id} has been placed ${date} via Cash on Delivery. You will be updated with another email after your items have been shipped`
                            };

                            transporter.sendMail(mailOptions, function (error, info) {
                                if (error) {
                                    console.log(error);
                                } else {
                                    console.log('Email sent: ' + info.response);
                                }
                            });



                            User.updateOne({
                                _id: userId
                            }, {
                                    $push: {
                                        orderHistory: saleId
                                    },
                                    $inc: {
                                        order: 1
                                    }
                                }).then(res => {
                                    if (res) {
                                        console.log('user updated sucessfully');
                                    }
                                })
                                .catch(e => {
                                    res.send({ 'bp': 'Failed' });
                                    console.log(e);
                                })
                            console.log(res);
                        }
                    })
                    .catch(e => {
                        res.send({ 'bp': 'Failed' });
                        console.log(e);
                    })


                if (req.body.hub > 0) {
                    products.find({ type: 'HUB', status: false })
                        .limit(req.body.hub)
                        .then(res => {
                            console.log('===========NOT SALE HUB ============\n', res);
                            if (res) {
                                res.forEach(p => {
                                    devId = p._id

                                    var dev = {
                                        _id: devId,
                                        label: 'HUB',
                                        deviceType: 'HUB'
                                    }


                                    device.updateOne(
                                        { userId: userId },
                                        { $addToSet: { devices: dev } }
                                    ).then(res => {
                                        console.log(res);
                                    }).catch(e => {
                                        res.send({ 'bp': 'Failed' });
                                        console.log(e);
                                    })


                                    products.updateOne(
                                        { _id: devId },
                                        { $set: { status: true } }
                                    ).then(res => {
                                        if (res) {
                                            console.log(res);
                                        }
                                    }).catch(e => {
                                        res.send({ 'bp': 'Failed' });
                                        console.log(e);
                                    })

                                })

                            }

                        })
                        .catch(e => {
                            res.send({ 'bp': 'Failed' });
                            console.log(e);
                        })
                }


                if (req.body.slave > 0) {
                    products.find({ type: 'SLAVE', status: false })
                        .limit(req.body.slave)
                        .then(res => {
                            console.log('=========== NOT SALE SLAVE ============\n', res);

                            if (res) {
                                res.forEach(i => {
                                    devId = i._id

                                    var dev = {
                                        _id: devId,
                                        label: 'SLAVE',
                                        deviceType: 'SLAVE'
                                    }


                                    device.updateOne(
                                        { userId: userId },
                                        { $addToSet: { devices: dev } }
                                    ).then(res => {
                                        console.log(res);
                                    }).catch(e => {
                                        res.send({ 'bp': 'Failed' });
                                        console.log(e);
                                    })


                                    products.updateOne({
                                        _id: devId
                                    }, {
                                            $set: {
                                                status: true
                                            }
                                        })
                                        .then(res => {
                                            if (res) {
                                                console.log(res);
                                            }
                                        })
                                        .catch(e => {
                                            res.send({ 'bp': 'Failed' });
                                            console.log(e);
                                        })


                                })


                            }
                        }).catch(e => {
                            res.send({ 'bp': 'Failed' });
                            console.log(e);
                        });
                }





                setTimeout(() => {
                    res.send({ 'bp': 'OK', saleId });

                }, 0);


            }
        })

});

app.post('/users/myorders', (req, res) => {
    console.log(req.body);

    sales.find({
        userId: req.body.userId,
        status: false
    }).then(doc => {
        if (doc) {
            console.log(doc);
            res.send({
                guo: 'OK',
                doc: doc
            })
        } else {
            res.send({
                guo: 'No Pending Order'
            })
        }
    }).catch(e => {
        console.log(e);
    })
})

app.post('/users/receivedOrder', (req, res) => {
    sales.updateOne({
        _id: req.body.id
    }, {
            $set: {
                status: true
            }
        }).then(doc => {
            if (doc) {
                console.log(res);
                res.send({ ro: 'OK' })
            } else {
                res.send({
                    ro: 'some error found'
                })
            }
        }).catch(e => {
            console.log(e);
        })
})

app.post('/users/orderFeedBack', (req, res) => {

    sales.updateOne({
        _id: req.body.id
    }, {
            rating: req.body.rating,
            feedback: req.body.feedback
        }).then(doc => {
            if (doc) {
                res.send({
                    of: 'OK'
                })
            } else {
                res.send({
                    of: 'No data found'
                })
            }
        }).catch(e => {
            console.log(e);
        })
})

// users.post("/users/charge", async (req, res) => {

//     try {
//         let { status } = await stripe.charges.create({
//             amount: 2000,
//             currency: "usd",
//             description: "An example charge",
//             source: req.body
//         });

//         res.json({ status });
//     } catch (err) {
//         res.status(500).end();
//     }
// });

app.post('/users/forgetPassword', (req, res) => {

    logins.findOne({ email: req.body.email })
        .then(doc => {
            if (doc) {
                console.log(doc)
                res.send({
                    error: 'User Exists.'
                })

                userEmail = req.body.email


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
                    to: userEmail,
                    subject: 'Smart Fire Alarm System : Forget Password',
                    text: `Click on the link to Reset your password \n http://localhost:8080/resetPassword/${doc._id}`
                };

                transporter.sendMail(mailOptions, function (error, info) {
                    if (error) {
                        console.log(error);
                    } else {
                        console.log('Email sent: ' + info.response);
                    }
                });
            }
            else {
                res.send({
                    error: 'User not found.'
                })
            }
        })
        .catch(e => {
            console.log(e)
        })
})

app.post('/users/resetPassword', (req, res) => {

    logins.updateOne({ _id: req.body.id }, { password: req.body.password })
        .then(doc => {
            if (doc.nModified == 1) {
                res.send({
                    response: 'Password Change Sucessfully'
                })
            } else {
                res.send({
                    response: 'Password Not Update. Please Try After some time'
                })
            }
        })
        .catch(e => {
            res.send({
                response: 'No User Exists'
            })
        })
});

app.post('/users/confirmResetUser', (req, res) => {

    logins.findOne({ _id: req.body.id }).then(doc => {
        if (doc) {
            res.send({
                response: 'user found'
            })
        }
    }).catch(e => {
        res.send({
            response: 'error'
        })
    })
});

// android app routes

app.post('/users/getReportDetails', (req, res) => {

    report.find({
        userId: req.body.userId,
        approve: false
    }).then(doc => {
        if (doc) {
            res.send({ 'res': 'OK', doc });
        }
    }).catch(e => {
        console.log(e);
        res.send({ 'res': 'Some connection error' });
    })
});

app.post('/users/updateReportStatus', (req, res) => {


    if (req.body.reportStatus == "approve") {
        report.findOneAndUpdate({ _id: req.body.id },
            { 'approve': true }
        ).then(doc => {
            if (doc) {
                console.log(doc);
                res.send({ 'res': 'OK' });
            }
        }).catch(e => {
            console.log(e);
            res.send({ 'res': 'Failed' });
        })
    }
    if (req.body.reportStatus == "reset") {
        report.findOneAndUpdate({ _id: req.body.id },
            { 'status': 1, 'approve': false }
        ).then(doc => {
            if (doc) {
                console.log(doc);
                res.send({ 'res': 'OK' });
            }
        }).catch(e => {
            console.log(e);
            res.send({ 'res': 'Failed' });
        })
    }
})

app.post('/users/verifyEmail', (req, res) => {

    logins.findByIdAndUpdate({
        _id: req.body.id
    }, {
            verify: true
        }).then(res => {
            if (res) {
                console.log(res);
            }
        }).catch(e => {
            console.log(e);
        })
});

app.post('/users/emailVerifyOrNot', (req, res) => {

    logins.findOne({
        _id: req.body.id
    }).then(doc => {
        if (doc) {
            res.send({ evon: 'OK', doc });
        } else {
            res.send({ evon: 'error' });
        }
    }).catch(e => {
        res.send({ evon: 'error' });
    })
});

app.post('/submitServiceReport', (req, res) => {

    serviceReport.create(req.body)
        .then(doc => {
            if (doc) {
                res.send({ ssr: 'OK', doc });
            }
        }).catch(e => {
            res.send({ ssr: 'error' });
        })
});

app.post('/users/getAllServiceReport', (req, res) => {

    serviceReport.find({
        userId: req.body.userId
    }).then(doc => {
        if (doc) {
            res.send({ gasr: 'OK', doc });
        }
    }).catch(e => {
        res.send({ gasr: 'error' });
    })
})


app.use('/seller', Seller)

app.post("/charge", async (req, res) => {
    console.log('recevie data', req.body);
    try {
        let { status } = await stripe.charges.create({
            amount: req.body.bill,
            currency: "usd",
            description: "An example charge",
            source: req.body.id
        });

        if (status) {
            console.log('status is : ', status);
            res.json({ status });
        }

    } catch (err) {
        res.status(500).end();
    }
});

app.post('/test', (req, res) => {
    console.log('------ this is testing', req.body);
    res.send('Ok');
});

app.get('/', (req, res) => {
    console.log('web user connected');
    res.send("welcome in fas app :)");
});


io.on('connection', (socket) => {
    console.log('android user connected');

    socket.on('loginRequest', (data) => {
        if (data) {
            console.log('----login request ------', data['uniqueId'], data['email'], data['pwd']);
            db.loginValidate(data).then((result) => {
                if (result) {
                    if (data['email'] == result['email'] && data['pwd'] == result['password']) {
                        let res = {
                            id: result['_id'],
                            email: data['email'],
                            uniqueId: data['uniqueId'],
                            password: data['pwd'],
                            message: 'sucessfull'
                        };
                        console.log(res);
                        io.emit('InformLogin' + data['uniqueId'], res);
                        return;
                    } else if (data['email'] == result['email'] && data['pwd'] != result['password']) {
                        let res = {
                            id: result['_id'],
                            email: data['email'],
                            uniqueId: data['uniqueId'],
                            message: 'passwordWrong'
                        };
                        console.log(res);
                        io.emit('InformLogin' + data['uniqueId'], res);
                        return;
                    } else {

                    }
                }
            }).catch((err) => {
                if (err) {
                    if (err == 'No data found') {
                        let res = {
                            email: data['email'],
                            uniqueId: data['uniqueId'],
                            message: 'emailNotExist'
                        };
                        console.log(res);
                        io.emit('InformLogin' + data['uniqueId'], res);
                        return;
                    } else {
                        let res = {
                            email: data['email'],
                            uniqueId: data['uniqueId'],
                            message: 'error occur'
                        };
                        console.log(res);
                        io.emit('InformLogin' + data['uniqueId'], res);
                        return;
                    }
                }
            });
        }

    });

    socket.on('loginConfirm', (data) => {
        if (data) {
            console.log('--login confirmation in main activity---', data['uniqueId'], data['email'], data['password']);
            db.loginValidate(data).then((result) => {
                if (result) {
                    if (data['email'] == result['email'] && data['password'] == result['password']) {
                        let res = {
                            id: data['projectId'],
                            email: data['email'],
                            uniqueId: data['uniqueId'],
                            password: data['password'],
                            message: true
                        };
                        console.log(res);
                        io.emit('InformConfirmLogin' + data['uniqueId'], res);
                        return;
                    } else if (data['email'] == result['email'] && data['password'] != result['password']) {
                        let res = {
                            id: data['projectId'],
                            email: data['email'],
                            uniqueId: data['uniqueId'],
                            message: false
                        };
                        console.log(res);
                        io.emit('InformConfirmLogin' + data['uniqueId'], res);
                        return;
                    } else {

                    }
                }
            }).catch((err) => {
                if (err) {
                    if (err == 'No data found') {
                        let res = {
                            email: data['email'],
                            uniqueId: data['uniqueId'],
                            message: false
                        };
                        console.log(res);
                        io.emit('InformConfirmLogin' + data['uniqueId'], res);
                        return;
                    } else {
                        let res = {
                            email: data['email'],
                            uniqueId: data['uniqueId'],
                            message: false
                        };
                        console.log(res);
                        io.emit('InformConfirmLogin' + data['uniqueId'], res);
                        return;
                    }
                }
            });
        }
    });

    socket.on('FirstTimeGetAllData', (data) => {
        console.log('-- first time get data ----', data);
        db.requestAllData(data).then((res) => {
            if (res) {
                //console.log('========   FIRST TIME GET DATA =========\n', JSON.stringify(res, null, 2));

                io.emit('SendAllDataFT' + data['uniqueId'], res);
            }
        }).catch((err) => {
            if (err) {
                io.emit('SendAllDataFT' + data['uniqueId'], err);
            }
        });
    });

    socket.on('refreshData', (data) => {
        console.log('------------------- refresh data event trigger ---------------');
        db.requestAllData(data).then((res) => {
            if (res) {
                console.log(JSON.stringify(res, null, 4));
                io.emit('InformRefreshData' + data['uniqueId'] + data['projectId'], res);
            }
        }).catch((err) => {
            if (err) {
                io.emit('InformRefreshData' + data['uniqueId'] + data['projectId'], err);
            }
        });
    });


    socket.on('changeLabel', (data) => {
        console.log('---change label----', data);

        db.updateLabel(data).then((doc) => {
            io.emit('InformChangeLabel' + data['projectId'], data);
            console.log(doc);
        }).catch((err) => {
            io.emit('InformChangeLabel' + data['projectId'], data);
            console.log(err);
        });
    });

    socket.on('resetDevice', (data) => {
        console.log('-------------------Reset Device---------------------', data);
        db.resetDevice(data).then((doc) => {
            console.log('reset Device Sucessfully');
            //console.log(doc);
            io.emit('InformResetDevice' + data['projectId'], {
                projectId: data['projectId'],
                label: data['label'],
                reset: 'OK'
            });
        }).catch((err) => {
            console.log('error occur in reset Device', err);
        })
    });

    socket.on('addNewCategory', (data) => {
        console.log('--------------- add new category event -----------');
        console.log(data);
        db.addNewCategory(data).then((doc) => {
            io.emit('InformToNewCategory' + data['projectId'], data);
            console.log(doc);
        }).catch((err) => {
            io.emit('InformToNewCategory' + data['projectId'], data);
            console.log(err);
        });
    });

    socket.on('deleteCategory', (data) => {
        console.log('----- delete category -----');
        console.log(data);
        db.deleteCategory(data).then((doc) => {
            io.emit('InformDeleteCategory' + data['projectId'], data);
            console.log(doc);
        }).catch((err) => {
            io.emit('InformDeleteCategory' + data['projectId'], data);
            console.log(err);
        });
    });

    socket.on('changeCategory', (data) => {
        console.log('------------ change category of device ---------');
        console.log(data);
        db.updateCategory(data).then((doc) => {
            io.emit('InformChangeCategory' + data['projectId'], data);
            console.log(doc);
        }).catch((err) => {
            io.emit('InformChangeCategory' + data['projectId'], data);
            console.log(err);
        });
    });

    socket.on('changePassword', (data) => {
        console.log('------------ password change -----------');
        console.log(data);
        db.changePassword(data).then((res) => {
            if (res) {
                io.emit('infoChangePassword' + data['uniqueId'], {
                    status: 'OK'
                });
            }
        }).catch((e) => {
            if (e) {
                io.emit('infoChangePassword' + data['uniqueId'], {
                    status: 'Error'
                });
            }
        });

    });

    socket.on('AlertFire', (data) => {
        console.log('==========Alert=============', data);
        sendPushNotification(data);
        // io.emit('InfoAlert' + data['projectId'], data);
        console.log('---------------------');
    });

    socket.on('confirmationEmail', (data) => {
        console.log('confirmation email', data['uniqueId'], data['email']);
        db.confirmationEmail(data).then(res => {
            if (res) {
                io.emit('InformConfirmEmail' + data['uniqueId'], res);
            }
        }).catch(e => {
            io.emit('InformConfirmEmail' + data['uniqueId'], 'error');
        });
    })

    socket.on('changeLocation', (data) => {
        console.log('------- location change ------', data['projectId'], data['deviceId'], data['newLocation']);

        db.changeLocation(data).then(res => {
            if (res) {
                io.emit('InformChangeLocation' + data['projectId'], res);
            }
        }).catch(e => {
            io.emit('InformChangeLocation' + data['projectId'], e);
        })
    });

    socket.on('configureDevice', data => {
        console.log('----------- configure device --------------', data);
        db.configuration(data).then(res => {
            if (res) {
                console.log('configuration sucessfully');
            }
        }).catch(e => {
            console.log('some error exists');
        })
    });

    socket.on('submitReports', data => {
        console.log('------------- reports ------------\n', data);
        db.submitReport(data).then(res => {
            if (res) {
                console.log(res);
            }
        }).catch(e => {
            console.log(e);
        })
    });

    socket.on('sendHealth', data => {
        console.log('--------', data);
        db.sendHealth(data).then((doc) => {
            io.emit('informHealth' + data['projectId'], data);
            // console.log(doc);
        }).catch((err) => {
            io.emit('informHealth' + data['projectId'], data);
            //  console.log(err);
        });
    });

    socket.on('slaveSendAlert', data => {
        console.log('Slave alert');

        io.emit('informAlertToHub' + data['projectId'], data);

        sendPushNotification(data);
        // setTimeout(() => {
        //     io.emit('InfoAlert' + data['projectId'], data);
        // } , 1000);

    });

    socket.on('disconnect', () => {
        console.log('user disconnect');
    });


});

const sendPushNotification = data => {

    var message = {
        to: 'esto8hMECFE:APA91bH89HeA33vKaH7lghlI1q8E4WU3rV_LcGVP0oeCSeFXje0Rnu7ZWgHtJ1V7JsKk8esE0enZItkH8jSMPRw_3WrPixF1LechnO2onFiCQ9jC2CDTYQVxG8oSqOZXRVCufk9rBUYE',
        collapse_key: 'type_a',

        notification: {
            title: 'Fire Alert',
            body: `Device Name is ${data.label} \nLocation is ${data.location}`
        },

        data: {
            my_key: 'my value',
            my_another_key: 'my another value'
        }
    };

    fcm.send(message, function (err, response) {
        if (err) {
            console.log("Something has gone wrong!");
        } else {
            console.log("Successfully sent with response: ", response);
        }
    });

    //esto8hMECFE:APA91bH89HeA33vKaH7lghlI1q8E4WU3rV_LcGVP0oeCSeFXje0Rnu7ZWgHtJ1V7JsKk8esE0enZItkH8jSMPRw_3WrPixF1LechnO2onFiCQ9jC2CDTYQVxG8oSqOZXRVCufk9rBUYE

    // var message = { 
    //     to: 'esto8hMECFE:APA91bH89HeA33vKaH7lghlI1q8E4WU3rV_LcGVP0oeCSeFXje0Rnu7ZWgHtJ1V7JsKk8esE0enZItkH8jSMPRw_3WrPixF1LechnO2onFiCQ9jC2CDTYQVxG8oSqOZXRVCufk9rBUYE',
    //     collapse_key: 'type_a',

    //     notification: {
    //         title: 'Fire Alert',
    //         body: `Device Name is ${data.label} \nLocation is ${data.location}`
    //     },

    //     data: {  
    //         my_key: 'my value',
    //         my_another_key: 'my another value'
    //     }
    // };

    // fcm.send(message, function (err, response) {
    //     if (err) {
    //         console.log("Something has gone wrong!");
    //     } else {
    //         console.log("Successfully sent with response: ", response);
    //     }
    // });
}

server.listen(process.env.PORT || 3000, () => {
    console.log('server is running on port 3000');
});
