var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var login = new Schema({
    email: {
        type: 'String',
        required: true
    },
    password: {
        type: 'String',
        required: true
    },
    role: {
        type: 'String',
        default: 'customer'
    },
    verify: {
        type: Boolean,
        default: false
    },
    fcmTokens: {
        type: 'Array',
        default: [
            {
                type: 'String'
            }
        ]
    }
});

module.exports = logins = mongoose.model('logins', login);