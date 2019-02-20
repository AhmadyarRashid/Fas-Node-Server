var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var category = new Schema({
    _id: {
        type: 'String',
        required: true
    },
    categories: {
        type: 'Array',
        default: [
            {
            type: 'String'
            }
        ]
    }
});

module.exports = category = mongoose.model('category' , category);