const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');
const user = require('../model/user')
const device = require('../model/device');
const category = require('../model/category');

const loginValidate = (data) => {
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
                collection.findOne({ email: data['email'] }).then((doc) => {
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
            console.log('----------------login confirm data-------------');
            const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
            client.connect(function (err) {
                if (err) {
                    console.log('>>>backend file connection error');
                    reject('db connection error');
                    assert.equal(null, err);
                }
                const db = client.db('FAS');
                const collection = db.collection('logins');
                collection.findOne({ email: data['email'] }).then((doc) => {
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
    console.log(data);
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            // console.log('-----------------inside request all data--------------');


            // user.findOne({
            //     _id: data.projectId
            // }).then(udoc => {
            //     //console.log('======== userData =======' , udoc);
            //     if(udoc){
            //         userData = udoc
            //         console.log('======== userData =======' , userData);
            //         device.findOne({
            //             userId: data.projectId
            //         }).then(ddoc => {
            //             if(ddoc){
            //                 userData['devices'] = ddoc

            //                 console.log('======== devices =======' , userData);
            //                 category.findOne({
            //                     _id: data.projectId
            //                 }).then(cdoc => {
            //                     if(cdoc){
            //                         userData['categories'] = cdoc
            //                         console.log('======== category =======' , userData);
            //                        resolve(userData)
            //                     }
            //                 })
            //             }
            //         })
            //     }
            // })



      
            var client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
            client.connect(function (err) {
                if (err) {
                    reject('db connection error');
                    assert.equal(null, err);
                }

                const db = client.db('FAS');
                // console.log('before query ===');
                db.collection('users').aggregate([
                    {
                        $lookup: {
                            from: 'devices',
                            localField: '_id',
                            foreignField: 'userId',
                            as: 'devices'
                        }
                    },
                    {
                        $lookup: {
                            from: 'categories',
                            localField: '_id',
                            foreignField: '_id',
                            as: 'categories'
                        }
                    }


                ]).toArray((err, res) => {
                    if (err) {
                        //console.log('found err = ', err);
                        reject(err);
                    } else {
                        //  console.log('found data = ', res);
                        resolve(res);

                    }
                });


            });
          

          //  client.close();

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
                const collection = db.collection('devices');
                const projId = data['projectId'],
                    deviceId = data['deviceId'],
                    newLabel = data['newLabel'];

                const res = collection.updateOne(
                    { "userId": projId, "devices._id": deviceId },
                    {
                        $set: { "devices.$.label": newLabel }
                    }
                );
                resolve(res);

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
                const collection = db.collection('devices');
                const projId = data['projectId'],
                    deviceId = data['deviceId'],
                    newCategory = data['changeCat'];


                const res = collection.updateOne(
                    { "userId": projId, "devices._id": deviceId },
                    {
                        $set: { "devices.$.category": newCategory }
                    }
                );
                resolve(res);

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
                const collection = db.collection('categories');
                const projId = data['projectId'],
                    newCat = data['newCat'];

                var res = collection.update(
                    { "_id": projId },
                    { $addToSet: { categories: newCat } }
                );
                resolve(res);


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
                const collection = db.collection('categories');
                const projId = data['projectId'],
                    delCat = data['delCat'];

                var res = collection.update(
                    { "_id": projId },
                    { $pull: { categories: delCat } }
                );
                resolve(res);

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

                collection.findOne({ '_id': projId }, (err, doc) => {
                    if (err) {
                        reject('no data found');
                    }
                    var res = collection.updateOne(
                        { '_id': projId },
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
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const client = new MongoClient('mongodb://localhost:27017', { useNewUrlParser: true });
            client.connect(function (err) {
                if (err) {
                    reject('db connection error');
                    assert.equal(null, err);
                }
                const db = client.db('FAS');
                const collection = db.collection('devices');
                projectId = data['projectId'];
                devlabel = data['label'];

                const res = collection.updateOne(
                    { "userId": projectId, "devices.label": devlabel },
                    {
                        $set: { "devices.$.configuration": 'false' }
                    }
                );
                resolve(res);


            });
            client.close();

        }, 0);
    })
}

const confirmationEmail = (data) => {
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
                email = data['email'];

                collection.findOne({ email: email }).then(res => {
                    if (res) {
                        resolve('true');
                    } else {
                        resolve('false');
                    }
                }).catch(err => {
                    if (err) {
                        reject(err);
                    }
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
    resetDevice,
    confirmationEmail
};
