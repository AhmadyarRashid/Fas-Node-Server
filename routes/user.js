const express = require("express")
const users = express.Router()
const cors = require("cors")
const User = require('../model/user')
const logins = require('../model/login');
const products = require('../model/product');
const userQuries = require('../model/userQuery');
const device = require('../model/device');
const sales = require('../model/sale');
const category = require('../model/category');
const nodemailer = require('nodemailer');
const stripe = require("stripe")("sk_test_ywGSmVRTxvcRc61SCNEpkqJ1007yKWAI6u");

users.use(cors())

process.env.SECRET_KEY = 'secret';

users.post('/register', (req, res) => {
    console.log(req.body);
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


            }).catch(err => {
                console.log('========== error ============\n', err);
            });



        }
    })
})

users.post('/login', (req, res) => {
    console.log(req.body);
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

users.post('/changePassword', (req, res) => {
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

users.post('/updateProfile', (req, res) => {
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

users.post('/getQty', (req, res) => {
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

users.post('/contact', (req, res) => {
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

            senderEmail = req.body.email


            var transporter = nodemailer.createTransport({
                service: 'gmail',
                host: 'smtp.gmail.com',
                port: 465,
                secure: true,
                auth: {
                    user: 'ahmedyar61@gmail.com',
                    pass: 'meo3400119339'
                }
            });

            var mailOptions = {
                from: 'ahmedyar61@gmail.com',
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


users.post('/buyProduct', (req, res) => {
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
                                    user: 'ahmedyar61@gmail.com',
                                    pass: 'meo3400119339'
                                }
                            });

                            var mailOptions = {
                                from: 'ahmedyar61@gmail.com',
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

users.post('/myorders', (req, res) => {
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

users.post('/receivedOrder', (req, res) => {
    console.log(req.body);

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

users.post('/orderFeedBack', (req, res) => {
    console.log(req.body);
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

users.post("/charge", async (req, res) => {
    console.log('recevie data', req);
    try {
        let { status } = await stripe.charges.create({
            amount: 2000,
            currency: "usd",
            description: "An example charge",
            source: req.body
        });

        res.json({ status });
    } catch (err) {
        res.status(500).end();
    }
});

users.post('/forgetPassword', (req, res) => {
    console.log(req.body);
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
                        user: 'ahmedyar61@gmail.com',
                        pass: 'meo3400119339'
                    }
                });

                var mailOptions = {
                    from: 'ahmedyar61@gmail.com',
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

users.post('/resetPassword', (req, res) => {
    console.log(req.body);
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

users.post('/confirmResetUser', (req, res) => {
    console.log(req.body);
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

module.exports = users