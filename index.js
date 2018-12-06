const express = require('express'),
    http = require('http'),
    app = express(),
    server = http.createServer(app),
    io = require('socket.io').listen(server);
const db = require('./db/db');

app.get('/', (req, res) => {
    console.log('web user connected');
    res.send("welcome in fas app :)");
});

io.on('connection', (socket) => {
    console.log('android user connected');

    socket.on('loginRequest', (data) => {
        if (data) {
            console.log(data['uniqueId'], data['email'], data['pwd']);
            db.loginValidate(data).then((result) => {
                if (result) {
                    if (data['email'] == result['email'] && data['pwd'] == result['pass']) {
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
                    } else if (data['email'] == result['email'] && data['pwd'] != result['pass']) {
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
            console.log(data['uniqueId'], data['email'], data['password']);
            db.loginValidate(data).then((result) => {
                if (result) {
                    if (data['email'] == result['email'] && data['password'] == result['pass']) {
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
                    } else if (data['email'] == result['email'] && data['pwd'] != result['pass']) {
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
        console.log(data);
        db.requestAllData(data).then((res) => {
            if (res) {
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
                io.emit('InformRefreshData' + data['uniqueId'] + data['projectId'], res);
            }
        }).catch((err) => {
            if (err) {
                io.emit('InformRefreshData' + data['uniqueId'] + data['projectId'], err);
            }
        });
    });

    socket.on('changeLabel', (data) => {
        console.log(data);

        db.updateLabel(data).then((doc) => {
            io.emit('InformChangeLabel' + data['projectId'], data);
            console.log(doc);
        }).catch((err) => {
            io.emit('InformChangeLabel' + data['projectId'], data);
            console.log(err);
        });

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
        io.emit('infoChangePassword' + data['uniqueId'], {
            status: 'OK'
        });
    });

    socket.on('disconnect', () => {
        console.log('user disconnect');
    });
});

server.listen(3000, () => {
    console.log('Node app server is running on 3000');
});
