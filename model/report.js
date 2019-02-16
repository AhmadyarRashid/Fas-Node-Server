var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var report = new Schema({
    _id :{
      type:'String',
      required: true
    },
    deviceId: {
        type: 'String',
        required: true
    },
    subject: {
        type: 'String',
        required: true
    },
    description:{
        type: 'String',
        required: true
    }
});

module.exports = reports = mongoose.model('reports' , report);