var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var product = new Schema({
    _id :{
      type:'String',
      required: true
    },
    type:{
        type:'String',
        required: true
    },
    status: {
        type: 'String',
        required: true
    }
});

module.exports = products = mongoose.model('products' , product);