var mongoose = require('mongoose');
const Schema = mongoose.Schema;

var device = new Schema({
    user:{
        type:String,
        required:true
    },
    devices: {
        type: Array,
        default: []
    }
});

module.exports = smartDevices = mongoose.model('smartDevices', device);

// ,
//     devices: [
//         {
//             _id: {
//                 type: 'String'
//             },
//             label: {
//                 type: 'String',
//                 default:'Device'
//             },
//             category: {
//                 type: 'String',
//                 default:'ALL'
//             },
//             image: {
//                 type: 'String',
//                 default:'NO'
//             },
//             deviceId: {
//                 type: 'String',
//                 default:'none'
//             },
//             deviceType: {
//                 type: 'String'
//             },
//             location: {
//                 type: 'String',
//                 default:'None'
//             },
//             health: {
//                 type: 'String',
//                 default:'none'
//             },
//             configuration: {
//                 type: 'boolean',
//                 default:false
//             },
//             alert: {
//                 type: 'boolean',
//                 default:false
//             }
//         }
//     ]