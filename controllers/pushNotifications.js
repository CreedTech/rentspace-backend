var admin = require("firebase-admin");

const { initializeApp, applicationDefault } = require('firebase-admin/app');
const { getMessaging } =  require("firebase-admin/messaging");
// var fcm = require('fcm-notification');

var serviceAccount = require('../configs/push-notification-key.json');
// const certPath = admin.credential.cert(serviceAccount);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  });

// process.env.GOOGLE_APPLICATION_CREDENTIALS;
// initializeApp({
//     credential: applicationDefault(),
//     projectId: 'rentspace-1aebe',
// });
  
exports.sendNotification = async (req, res) => {
    const receivedToken = req.body.fcmToken;

    const message = {
        notification: {

            title: "Test",
            body: 'This is a test notification'
      },
     
      data: {
        notificationType: "payment" ,// Add a parameter to specify the type of notification
        amount:"1000",
        name: 'Ayodele Ayoola'
      },
        token: receivedToken
    };

    getMessaging()
    .send(message)
    .then((response) => {
      res.status(200).json({
        message: "Successfully sent message",
        token: receivedToken,
      });
      console.log("Successfully sent message:", response);
    })
    .catch((error) => {
      res.status(400);
      res.send(error);
      console.log("Error sending message:", error);
    });
 }