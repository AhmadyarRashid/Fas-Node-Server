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
                   if (doc){
                       resolve(doc);
                   }else {
                       reject('No data found');
                   }
                }).catch((err) => {
                    if (err){
                        reject('error occour in query');
                    }
                });
                client.close();
            });
        }, 0);
    });
};



module.exports = {
    loginValidate
};
