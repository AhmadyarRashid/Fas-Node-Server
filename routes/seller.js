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
                            gs : 'OK',
                            hub: totalHubs,
                            slave: totalSlaves,
                            user: totalCustomer,
                            sale: totalSales
                        })

                        console.log('total User ====' , totalCustomer,
                        '\n=========== total hubs====', totalHubs,
                        '\n======= total slaves=====' , totalSlaves,
                        '\n======== sales =========' , totalSales);
                    })
                })
            })

        })
});


module.exports = seller