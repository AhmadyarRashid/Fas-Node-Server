// const mongoose = require('mongoose');

// mongoose.Promise = global.Promise;
// mongoose.connect('mongodb://localhost:27017/FAS');

// Set up mongoose connection
const mongoose = require('mongoose');
let dev_db_url = 'mongodb+srv://smartfirealarms:Pakistan786@fas-y3tyy.mongodb.net/test?retryWrites=true';
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;
// const db = mongoose.connection;
// db.on('error', console.error.bind(console, 'MongoDB connection error:'));

module.exports = {
    mongoose
};