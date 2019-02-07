const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const loginValidate = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const client = new MongoClient('mongodb://localhost:27017' , { useNewUrlParser: true });
            client.connect(function (err) {
                if (err) {
                    console.log('>>>backend file connection error');
                    reject('db connection error');
                    assert.equal(null, err);
                }
                const db = client.db('FAS');
                const collection = db.collection('logins');
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
            const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
            client.connect(function (err) {
                if (err) {
                    console.log('>>>backend file connection error');
                    reject('db connection error');
                    assert.equal(null, err);
                }
                const db = client.db('FAS');
                const collection = db.collection('logins');
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
            const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
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
            const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
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
            const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
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
            const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
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
            const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
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

const changePassword = (data) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
            client.connect(function (err) {
                if (err) {
                    reject('db connection error');
                    assert.equal(null, err);
                }
                const db = client.db('FAS');
                const collection = db.collection('logins');
                const projId = data['projectId'],
                    email = data['email'],
                    newPass = data['newPass'];

                collection.findOne({'_id': projId} , (err , doc) => {
                    if (err){
                        reject('no data found');
                    }
                    var res = collection.updateOne(
                        {'_id' : projId} ,
                        { $set: { 'password': newPass } }
                    );
                    resolve(res);

                });

            });
            client.close();
        }, 100);
    });
};

const resetDevice = (data) => {
    return new Promise((resolve, reject)=>{
        setTimeout(()=> {
            const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
            client.connect(function (err) {
                if (err) {
                    reject('db connection error');
                    assert.equal(null, err);
                }
                const db = client.db('FAS');
                const collection = db.collection('users');
                projectId = data['projectId'];
                devlabel = data['label'];

                collection.findOne({'_id': projectId} , (err , doc) => {
                    if (err){
                        reject('no data found');
                    }
                    let allDevices = doc['userType']['devices'];
                    allDevices.forEach((d) => {
                        if (d['label'] == devlabel){
                           // resolve(d);
                           const res = collection.updateOne(
                                {"_id": projectId, "userType.devices.label": devlabel},
                                {
                                    $set: { "userType.devices.$.configuration":'false'}
                                }
                            );
                           resolve(res);
                        }
                    })

                });

            });
            client.close();

        }, 0);
    })
}



module.exports = {
    loginValidate,
    loginConfirm,
    requestAllData,
    updateLabel,
    updateCategory,
    addNewCategory,
    deleteCategory,
    changePassword,
    resetDevice
};
