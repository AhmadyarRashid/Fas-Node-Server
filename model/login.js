var mongoose = require('mongoose');

var login = mongoose.model('login', {
    _id :{
      type:'String',
      required: true
    },
    email: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        default: true
    }
});

module.exports = {login};