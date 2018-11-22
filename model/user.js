//============================= user validator ==========
var mongoose = require('mongoose');

var user = mongoose.model('user', {
    _id: {
        type: String,
        required: true,
        unique: true,
        index: true
    },
    name: {
        type: String,
        required: true,
        trim: [true, 'Username is required']
    },
    phoneNo: {
        type: String,
        required: [true, 'User phone number required']
    },
    address: {
        type: String,
        required: [true, 'please enter address']
    },
    email: {
        type: String,
        required: [true, 'email address is required']
    },
    password: {
        type: String,
        maxlength: 12,
        minlength: 5
    },
    userType: {
        devices: [
            {
                deviceId: {
                    type: String,
                    required: true,
                    unique: true
                },
                label: {
                    type: String,
                    trim: true,
                    default: 'device'
                },
                category: {
                    type: String,
                    required: true,
                    default: 'All'
                },
                deviceType: {
                    type: String,
                    required: true,
                },
                location: {
                    type: String,
                    required: [true, 'location is required'],
                    minlength: 12
                },
                health: {
                    type: String,
                    required: true
                },
                configuration: {
                    type: Boolean,
                    required: [true, 'configuration is required for check wifi connectivity']
                },
                image: {
                    type: String,
                    required: true,
                    default: 'src/images/deafult.png'
                },
                alert: {
                    type: Boolean,
                    required: true
                },
                reports: [
                    {
                        reportid: {
                            type: String,
                            required: true,
                            unique: true
                        },
                        userId: {
                            type: String,
                            unique: true,
                            required: true
                        },
                        deviceId: {
                            type: String,
                            required: true
                        },
                        type: {
                            type: String,
                            required: true
                        },
                        detail: {
                            type: String,
                            required: true
                        },
                        status: {
                            type: String,
                            required: true
                        }
                    }
                ]
            }
        ],
        categories: [
            {
                type: String,
                unique: true
            }
        ]
    }
});


module.exports = {user};