var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var sale = new Schema({
    _id :{
      type:'String',
      required: true
    },
    userId: {
        type: 'String',
        required: true
    },
    date: {
        type: 'String',
        required: true
    },
    products: {
        type: 'array'
    },
    amount: {
        type: 'number',
        required:true
    }
});

module.exports = sales = mongoose.model('sales' , sale);