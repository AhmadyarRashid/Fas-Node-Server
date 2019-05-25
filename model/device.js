var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var device = new Schema({
    userId: {
        type: 'String',
        required: true
    },
    devices: [
        {
            _id: {
                type: 'String'
            },
            label: {
                type: 'String',
                default: 'Device'
            },
            category: {
                type: 'String',
                default: 'ALL'
            },
            image: {
                type: 'String',
                default: 'NO'
            },
            deviceId: {
                type: 'String',
                default: 'none'
            },
            deviceType: {
                type: 'String'
            },
            location: {
                type: 'String',
                default: 'None'
            },
            health: {
                type: 'String',
                default: '0'
            },
            configuration: {
                type: 'boolean',
                default: false
            },
            alert: {
                type: 'boolean',
                default: false
            }

        }
    ]
});

module.exports = devices = mongoose.model('devices', device);