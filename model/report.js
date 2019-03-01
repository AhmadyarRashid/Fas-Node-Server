var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var report = new Schema({
    userId:{
        type: 'String',
        required:true
    },
    email:{
        type:'String',
        required:true
    },
    deviceId: {
        type: 'String',
        required: true
    },
    deviceName: {
        type:'String',
        required: true
    },
    subject: {
        type: 'String',
        required: true
    },
    description:{
        type: 'String',
        required: true
    },
    status:{
        type:'Number',
        default:0
    },
    approve:{
        type:'Boolean',
        default:false
    }
});

module.exports = reports = mongoose.model('reports' , report);