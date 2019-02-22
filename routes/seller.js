const express = require("express")
const seller = express.Router()
const cors = require("cors")
const products = require('../model/product')
const users = require('../model/user');
const query = require('../model/userQuery');
const sales = require('../model/sale');


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
                        _id : sale._id,
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
                },0);
               

            } else {
                res.send({ gs: 'No Sales Founds' });
                console.log('no sales founds');
            }
        })
        .catch(e => {
            console.log(e);
        })

})


module.exports = seller