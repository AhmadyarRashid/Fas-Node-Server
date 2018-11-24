const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

const client = new MongoClient('mongodb://localhost:27017');
client.connect(function (err) {
    if (err) {
        reject('db connection error');
        assert.equal(null, err);
    }
    const db = client.db('FAS');
    const collection = db.collection('users');

   const date = collection.find(
        {
            '_id': '5bf5b1c0419972aae5e1eba1',
            'userType.devices.deviceId' : '123456'
        }
    )
    console.log(date);
});
client.close();