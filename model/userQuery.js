var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var query = new Schema({
    name: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true
    },
    phoneNo: {
        type: 'String',
        default: 'none'
    },
    message: {
        type: 'String',
        required: true
    },
    status:{
        type:'boolean',
        default:false
    }
});

module.exports = userQuries = mongoose.model('userQuries', query);