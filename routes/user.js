const express = require("express")
const users = express.Router()
const cors = require("cors")
const User = require('../model/user')
const logins = require('../model/login');
const products = require('../model/product');
const userQuries = require('../model/userQuery');
const device = require('../model/device');
const sales = require('../model/sale');

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
    console.log(req.body);
    products.aggregate([
        {
            $match:
            {
                'status': 'Not Sale',
            }
        },
        {
            $group: {
                _id: '$type',
                count: { $sum: 1 }
            }
        }
    ])
        .then(doc => {
            if (doc) {
                res.send({ gq: 'OK', doc: doc })
            } else {
                res.send({ gq: 'NO Items Found' });
            }
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
                                    res.send({'bp': 'Failed'});
                                    console.log(e);
                                })
                            console.log(res);
                        }
                    })
                    .catch(e => {
                        res.send({'bp': 'Failed'});
                        console.log(e);
                    })



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
                                    res.send({'bp': 'Failed'});
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
                                    res.send({'bp': 'Failed'});
                                    console.log(e);
                                })

                            })

                        }

                    })
                    .catch(e => {
                        res.send({'bp': 'Failed'});
                        console.log(e);
                    })


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
                                    res.send({'bp': 'Failed'});
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
                                        res.send({'bp': 'Failed'});
                                        console.log(e);
                                    })


                            })


                        }
                    }).catch(e => {
                        res.send({'bp': 'Failed'});
                        console.log(e);
                    });


                    res.send({'bp': 'OK'});

            }
        })

});

module.exports = users