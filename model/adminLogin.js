var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var adminLogin = new Schema({
    email: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        required: true
    }
});

module.exports = adminLogin = mongoose.model('adminLogin' , adminLogin);