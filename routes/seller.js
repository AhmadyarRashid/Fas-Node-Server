const express = require("express")
const seller = express.Router()
const cors = require("cors")
const products = require('../model/product')
const users = require('../model/user');
const query = require('../model/userQuery');

seller.use(cors())

process.env.SECRET_KEY = 'secret';

seller.post('/addDevice', (req, res) => {
    console.log(req.body);
    for (var i = 0; i < Number(req.body.qty); i++) {
        products.create({
            type: req.body.type
        }).then(doc => {
            if (i == (Number(req.qty) - 1)) {
                res.send({ad:'OK'});
            }
        }).catch(e => {
            console.log(e);
        })
    }
})

seller.post('/getUser' , (req,res) => {
    console.log(req.body);
    users.find({}).then(doc => {
        if(doc){
            res.send({'gu': 'OK' , doc: doc});
        }else{
            res.send({'gu': 'No User Exists'});
        }
    }).catch(e => {
        console.log(e);
    })
});

seller.post('/getAllQuery' , (req,res)=> {
    console.log(req.body);
    query.find({}).then(doc => {
        if(doc){
            res.send({'gaq': 'OK' , doc: doc});
        }else{
            res.send({'gaq': 'No Query Exists'});
        }
    }).catch(e => {
        console.log(e);
    })
})
module.exports = seller