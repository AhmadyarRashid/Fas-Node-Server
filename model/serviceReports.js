var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var serviceReport = new Schema({
    userId: {
        type: 'String',
        required: true
    },
    email: {
        type: 'String',
        required: true
    },
    description: {
        type: 'String',
        required: true
    },
    response:{
        type:String,
        default:''
    },
    status: {
        type: Boolean,
        default: false
    }
});

module.exports = serviceReport = mongoose.model('serviceReports', serviceReport);