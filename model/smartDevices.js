var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var device = new Schema({
    _id: {
        type: 'String',
        required: true
    },
    devices: [
        {
            _id: {
                type: 'String',
                required: true
            },
            label: {
                type: 'String',
                required: true
            },
            category: {
                type: 'String',
                required: true
            },
            image: {
                type: 'String',
                required: true
            },
            deviceId: {
                type: 'String',
                required: true
            },
            deviceType: {
                type: 'String',
                required: true
            },
            location: {
                type: 'String',
                required: true
            },
            health: {
                type: 'String',
                required: true
            },
            configuration: {
                type: 'boolean',
                required: true
            },
            alert: {
                type: 'boolean',
                required: true
            }
        }
    ]
});

module.exports = smartDevices = mongoose.model('smartDevices', device);