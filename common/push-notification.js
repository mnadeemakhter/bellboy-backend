const path = require("path").resolve;
const config = require(path("config/constants"));
var admin = require("firebase-admin");
var serviceAccount = require("./../config/bellboy-280008-firebase-adminsdk-sx2pb-8839e44747.json");
const geolib = require("geolib");
const notificationMessages = require("../common/notification-messages");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: config.fcmCreds.databaseUrl,
});

const messaging = admin.messaging();
var db = admin.database();

class PushNotification {
  /*
   * Prepare push notification payload
   */
  async notifySingleDevice(notificationObj, token, otherData) {
    let data = Object.assign(
      { type: config.notificationTypes.orderPlace },
      otherData
    );
    console.log("data", data);

    // const payload = {
    //     token: token,
    //     notification: notificationMessages[type],
    //     data: data
    // }
    let notification = {
      title: notificationObj.title,
      body: notificationObj.body,
    };
    if (notificationObj.imageUrl) {
      notification.imageUrl = notificationObj.imageUrl;
    }

      const payload = {
        token: token,
        notification,
        data: otherData,
      };
      console.log("payload=>", payload);

      // console.log(payload);

      // Send push notification to given device token
      // return this.send(payload);

      messaging
        .send(payload)
        .then((response) => {
          // Response is a message ID string.
          console.log("Successfully sent message:", response);
        })
        .catch((error) => {
          console.log("Error sending message:", error);
        });
    }


  async notifyMultipleDevices(notificationObj, tokens, otherData) {
    let data = Object.assign(
      { type: config.notificationTypes.orderPlace },
      otherData
    );
    let notification = {
      title: notificationObj.title,
      body: notificationObj.body,
    };
    if (notificationObj.imageUrl) {
        notification.imageUrl = notificationObj.imageUrl;
      }
    const payload = {
      tokens: tokens,
      notification,
      data: otherData,
    };
    console.log("payload=>", payload);


    // return this.send(payload);

    messaging
      .sendMulticast(payload)
      .then((response) => {
        // Response is a message ID string.
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.log("Error sending message:", error);
      });
  }

  /*
   * Send push notification to user
   */
  async send(payload) {}

  async getRecords(orderId) {
    var ref = db.ref("/orders/" + orderId);
    let records = await ref.once("value");
    let coordinates = [];
    records.forEach((element) => {
      element.forEach((e) => {
        var d = {};
        d = {
          latitude: e.child(e.key).child("latitude").toJSON(),
          longitude: e.child(e.key).child("longitude").toJSON(),
        };
        coordinates.push(d);
      });
    });
    let path = geolib.getPathLength(coordinates);
    let distance = geolib.convertDistance(path, "km");
    let response = {
      coordinates,
      distance,
    };
    return response;
  }

  // async getRecordsForHiring(orderId) {
  //   var ref = db.ref("/hirings/" + orderId);
  //   let records = await ref.once("value");
  //   let coordinates = [];
  //   records.forEach((element) => {
  //     element.forEach((e) => {
  //       var d = {};
  //       d = {
  //         latitude: e.child(e.key).child("latitude").toJSON(),
  //         longitude: e.child(e.key).child("longitude").toJSON(),
  //       };
  //       coordinates.push(d);
  //     });
  //   });
  //   let path = geolib.getPathLength(coordinates);
  //   let distance = geolib.convertDistance(path, "km");
  //   let response = {
  //     coordinates,
  //     distance,
  //   };
  //   return response;
  // }


  async getRecordsForHiring(orderId) {
    var ref = db.ref('/hirings/' + orderId+"/geolocations");
    let records = await ref.orderByChild("time").once('value');
    let coordinates = [];
    records.forEach(element => {
        var d = {};
        d = {
          latitude: e.child(e.key).child("latitude").toJSON() || 0,
          longitude: e.child(e.key).child("longitude").toJSON() ||0,
        };
        coordinates.push(d);
        // element.forEach(e => {
        //     var d = {};
        //     d = {
        //         "latitude": e.child(e.key).child('latitude').toJSON(),
        //         "longitude": e.child(e.key).child('longitude').toJSON()
        //     }
        //     coordinates.push(d);
        // })

    });
    console.log("coordinates=>",coordinates);
    let path = geolib.getPathLength(coordinates);
    let distance = geolib.convertDistance(path,'km');
    console.log("distance =>", distance)
    let response = {
        coordinates,distance
    }
    return response;
}
}

// Bind the context of the class with it before exporting.
PushNotification.bind(PushNotification);

module.exports = new PushNotification();
