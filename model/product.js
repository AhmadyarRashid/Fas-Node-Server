var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var product = new Schema({
    type:{
        type:'String',
        required: true
    },
    status: {
        type: 'boolean',
        default: false
    }
});

module.exports = products = mongoose.model('products' , product);