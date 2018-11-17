const MongoClient = require('mongodb').MongoClient;
const assert = require('assert');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'FAS';

// Create a new MongoClient
const client = new MongoClient(url);

// Use connect method to connect to the Server
client.connect(function (err) {
    assert.equal(null, err);
    console.log("Connected successfully to server");

    const db = client.db(dbName);
//========================================
    // createValidated(db, function() {
    //     client.close();
    // });

    //=================================================
    //InsertExample(db);
    UpdateExample(db);

});

const InsertExample = (db) => {
    //========================================
    // Insert a single document
    db.collection('UserInfo').insertOne({name: 'user04', email: 'user04@gmail.com'}, function (err, r) {
        assert.equal(null, err);
        assert.equal(1, r.insertedCount);

        // Insert multiple documents
        db.collection('UserInfo').insertMany([{name: 'user05', email: 'user05@gmail.com'}, {
            name: 'user06',
            email: 'user06@gmail.com'
        }], function (err, r) {
            assert.equal(null, err);
            assert.equal(2, r.insertedCount);

            client.close();
        });
    });

};

const UpdateExample = (db) => {
    const col = db.collection('update');
    // Insert a single document
    col.insertMany([{a:1}, {a:2}, {a:2}], function(err, r) {
        assert.equal(null, err);
        // assert.equal(3, r.insertedCount);

        // Update a single document
        col.updateOne({a:1}, {$set: {b: 1}}, function(err, r) {
            assert.equal(null, err);
            // assert.equal(1, r.matchedCount);
            //             // assert.equal(1, r.modifiedCount);

            // Update multiple documents
            col.updateMany({a:2}, {$set: {b: 1}}, function(err, r) {
                assert.equal(null, err);
                // assert.equal(2, r.matchedCount);
                // assert.equal(2, r.modifiedCount);

                // Upsert a single document
                col.updateOne({a:3}, {$set: {b: 1}}, {
                    upsert: true
                }, function(err, r) {
                    assert.equal(null, err);
                    // assert.equal(0, r.matchedCount);
                    // assert.equal(1, r.upsertedCount);
                    client.close();
                });
            });
        });
    });
};

function createValidated(db, callback) {
    db.createCollection("contacts",
        {
            'validator': {
                '$or':
                    [
                        {'phone': {'$type': "string"}},
                        {'email': {'$regex': /@mongodb\.com$/}},
                        {'status': {'$in': ["Unknown", "Incomplete"]}}
                    ]
            }
        },
        function (err, results) {
            console.log("Collection created.");
            callback();
        }
    );
};