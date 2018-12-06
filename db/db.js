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

              collection.findOne({'_id': projId} , (err , doc) => {
                    if (err){
                        reject('no data found');
                    }
                   // resolve(doc['userType']['devices']);
                  let allDevices = doc['userType']['devices'];
                  allDevices.forEach((d) => {
                      if (d['deviceId'] == deviceId){
                         // resolve(d);
                         const res = collection.updateOne(
                              {"_id": projId, "userType.devices.deviceId": deviceId},
                              {
                                  $set: { "userType.devices.$.label":newLabel }
                              }
                          );
                         resolve(res);
                      }
                  })
                });

            });
            client.close();
        }, 100);
    });
};

const updateCategory = (data) => {
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
                    newLabel = data['changeCat'];

                collection.findOne({'_id': projId} , (err , doc) => {
                    if (err){
                        reject('no data found');
                    }
                    // resolve(doc['userType']['devices']);
                    let allDevices = doc['userType']['devices'];
                    allDevices.forEach((d) => {
                        if (d['deviceId'] == deviceId){
                            // resolve(d);
                            const res = collection.updateOne(
                                {"_id": projId, "userType.devices.deviceId": deviceId},
                                {
                                    $set: { "userType.devices.$.category":newLabel }
                                }
                            );
                            resolve(res);
                        }
                    })
                });

            });
            client.close();
        }, 100);
    });
};

const addNewCategory = (data) => {
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
                    newCat = data['newCat'];

                collection.findOne({'_id': projId} , (err , doc) => {
                    if (err){
                        reject('no data found');
                    }
                    var res = collection.update(
                        {'_id' : projId} ,
                        { $push: { 'userType.categories': newCat } }
                        );
                    resolve(res);

                });

            });
            client.close();
        }, 100);
    });
};

const deleteCategory = (data) => {
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
                    newCat = data['delCat'];

                collection.findOne({'_id': projId} , (err , doc) => {
                    if (err){
                        reject('no data found');
                    }
                    var res = collection.update(
                        {'_id' : projId} ,
                        { $pull: { 'userType.categories': newCat } }
                    );
                    resolve(res);

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
    updateLabel,
    updateCategory,
    addNewCategory,
    deleteCategory
};
