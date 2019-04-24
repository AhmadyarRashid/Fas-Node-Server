var FCM = require('fcm-node');

var serverKey = 'AIzaSyDuidqbHbrqmrjw7iJ-W6KI2_A04TqhSVE'; //put your server key here
var fcm = new FCM(serverKey);

var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
    to: 'esto8hMECFE:APA91bH89HeA33vKaH7lghlI1q8E4WU3rV_LcGVP0oeCSeFXje0Rnu7ZWgHtJ1V7JsKk8esE0enZItkH8jSMPRw_3WrPixF1LechnO2onFiCQ9jC2CDTYQVxG8oSqOZXRVCufk9rBUYE',
    collapse_key: 'type_a',

    notification: {
        title: 'Title of your push notification',
        body: 'Body of your push notification'
    },

    data: {  //you can send only notification or only data(or include both)
        my_key: 'my value',
        my_another_key: 'my another value'
    }
};

fcm.send(message, function (err, response) {
    if (err) {
        console.log("Something has gone wrong!");
    } else {
        console.log("Successfully sent with response: ", response);
    }
});