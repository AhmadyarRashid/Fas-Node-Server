const {mongoose}  = require('../db/connection');
const {user} = require('../model/user');
const {login} = require('../model/login');

const loginUser = new login({
    _id : '5bf5b1c0419972aae5e1eba1',
    email : 'ahmad@gmail.com',
    password :'123456'
});

const user1 = new user({
    _id :"5bf5b1c0419972aae5e1eba1",
    name: 'ahmad yar',
    phoneNo: '03335581142',
    address : 'g-9/2 islamabad',
    email : 'ahmad@gmail.com',
    password : '123456',
    userType: {
        devices: [
            {
                deviceId : "123456",
                label : 'device1',
                category: 'All',
                deviceType: 'hub',
                location : 'karachi company islamabad',
                health : 'fine',
                configuration: false,
                alert : false,
                reports: []
            },
            {
                deviceId : "789465",
                label : 'device2',
                category: 'All',
                deviceType: 'slave',
                location : 'karachi company islamabad',
                health : 'fine',
                configuration: false,
                alert : false,
                reports: []
            },
            {
                deviceId : "451263",
                label : 'device3',
                category: 'All',
                deviceType: 'slave',
                location : 'karachi company islamabad',
                health : 'fine',
                configuration: false,
                alert : false,
                reports: []
            },
            {
                deviceId : "147852",
                label : 'device4',
                category: 'All',
                deviceType: 'slave',
                location : 'karachi company islamabad',
                health : 'fine',
                configuration: false,
                alert : false,
                reports: []
            },
            {
                deviceId : "963254",
                label : 'device5',
                category: 'All',
                deviceType: 'slave',
                location : 'karachi company islamabad',
                health : 'fine',
                configuration: false,
                alert : false,
                reports: []
            }
        ],
        categories: [
            'All',
            'Room'
        ]
    }

});



// user1.save().then((res) => {
//     console.log('insert sucessfully');
// } , (e) => {
//     console.log(e + 'not insert data some error');
// });

loginUser.save().then((res) => {
    console.log('user login insert data sucessfully');
}, (e) => {
    console.log('error occur in login');
});