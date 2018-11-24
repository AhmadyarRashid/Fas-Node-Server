const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const loginValidate = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const client = new MongoClient('mongodb://localhost:27017');
            client.connect(function (err) {
                if (err) {
                    reject('db connection error');
                    assert.equal(null, err);
                }
                const db = client.db('FAS');
                const collection = db.collection('login');
                collection.findOne({email: data['email']}).then((doc) => {
                    if (doc) {
                        resolve(doc);
                    } else {
                        reject('No data found');
                    }
                }).catch((err) => {
                    if (err) {
                        reject('error occour in query');
                    }
                });
                client.close();
            });
        }, 0);
    });
};

const loginConfirm = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const client = new MongoClient('mongodb://localhost:27017');
            client.connect(function (err) {
                if (err) {
                    reject('db connection error');
                    assert.equal(null, err);
                }
                const db = client.db('FAS');
                const collection = db.collection('login');
                collection.findOne({email: data['email']}).then((doc) => {
                    if (doc) {
                        resolve(doc);
                    } else {
                        reject('No data found');
                    }
                }).catch((err) => {
                    if (err) {
                        reject('error occour in query');
                    }
                });
                client.close();
            });
        }, 0);
    })
};

const requestAllData = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const client = new MongoClient('mongodb://localhost:27017');
            client.connect(function (err) {
                if (err) {
                    reject('db connection error');
                    assert.equal(null, err);
                }
                const db = client.db('FAS');
                const collection = db.collection('users');
                collection.findOne({_id: data['projectId']}).then((doc) => {
                    if (doc) {
                        resolve(doc);
                    } else {
                        reject({
                            message: 'noDataFound'
                        });
                    }
                }).catch((err) => {
                    if (err) {
                        reject({
                            message: 'EOIQ'
                        });
                    }
                });
                client.close();
            });
        }, 0);
    });
};

const updateLabel = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const client = new MongoClient('mongodb://localhost:27017');
            client.connect(function (err) {
                if (err) {
                    reject('db connection error');
                    assert.equal(null, err);
                }
                const db = client.db('FAS');
                const collection = db.collection('users');
                const projId = data['projectId'],
                    deviceId = data['deviceId'],
                    newLabel = data['newLabel'];

                collection.findOneAndUpdate(
                    {
                        _id: '5bf5b1c0419972aae5e1eba1',
                        'userType.devices': {
                            _id: '5bf71724e60c643450746661'
                        }
                    },
                    {
                        '$set': {
                            'userType.devices': {'label': 'hello world'}
                        }
                    }
                ).then((res) => {
                    if (res) {
                        console.log('label update sucessfully');
                    }
                }).catch((e) => {
                    if (e) {
                        console.log('error occur in update query', e);
                    }
                });
            });
            client.close();
        }, 100);
    });
};

module.exports = {
    loginValidate,
    loginConfirm,
    requestAllData,
    updateLabel
};
