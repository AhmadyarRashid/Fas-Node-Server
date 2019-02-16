const express = require("express")
const users = express.Router()
const cors = require("cors")
const User = require('../model/user')
const logins = require('../model/login');

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

module.exports = users