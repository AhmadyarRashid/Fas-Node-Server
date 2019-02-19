var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var sale = new Schema({
    userId: {
        type: 'String',
        required: true
    },
    date: {
        type: 'String',
        required: true
    },
    hub: {
        type: 'number'
    },
    slave:{
        type: 'number'
    },
    amount: {
        type: 'number',
        required: true
    },
    rating : {
        type: 'number'
    },
    feedback:{
        type:'String'
    },
    status:{
        type: 'boolean',
        default: false
    }
});

module.exports = sales = mongoose.model('sales', sale);