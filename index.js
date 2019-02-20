const express = require('express'),
    http = require('http'),
    app = express(),
    cors = require("cors"),
    bodyParser = require("body-parser"),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
const db = require('./db/db');
const mongoose = require('mongoose');

app.use(bodyParser.json())
app.use(cors())
app.use(
    bodyParser.urlencoded({
        extended: false
    })
)

const mongoURI = "mongodb://localhost:27017/FAS";
var Users = require('./routes/user')
var Seller = require('./routes/seller')

mongoose
    .connect(mongoURI, { useNewUrlParser: true })
    .then(() => console.log('MongoDB connected'))
    .catch(err => console.log(err))


app.use('/users', Users)
app.use('/seller', Seller)


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
                console.log('========   FIRST TIME GET DATA =========\n', JSON.stringify(res, null, 2));

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
        console.log(data);
        io.emit('InfoAlert' + data['projectId'], data);
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

    socket.on('disconnect', () => {
        console.log('user disconnect');
    });


});

server.listen(3000, () => {
    console.log('Node app server is running on 3000');
});
