//============================= user validator ==========
var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var userSchema = new Schema({
    _id: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNo: {
        type: String
    },
    address: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'email address is required']
    },
    password: {
        type: String
    },
    order:{
        type:'number',
        default:0
    },
    orderHistory:{
        type:'array',
        default:[]
    }
});

module.exports = User = mongoose.model('users', userSchema);