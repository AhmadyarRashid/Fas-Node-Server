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
        type: 'Boolean',
        default: false
    }
});

module.exports = {login};