const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp(functions.config().firebase);

exports.onNotificationCreated = functions.database
  .ref("/notifications/{notificationId}")
  .onCreate((notificationSnap, context) => {
    const notificationNode = notificationSnap.val();

    console.info(notificationNode);

    return admin
      .database()
      .ref("/tokens")
      .once("value")
      .then(snapshot => {
        const tokensNode = snapshot.val();

        if (!tokensNode) {
          return 0;
        }

        console.info(tokensNode);

        const payload = {
          notification: {
            title: `New Message From ${notificationNode.user}`,
            body: notificationNode.message,
            icon: notificationNode.photoURL
          }
        };

        console.info(payload);

        const tokens = [];
        const tokensWithKey = [];

        for (let key in tokensNode) {
          tokens.push(tokensNode[key].token);
          tokensWithKey.push({
            token: tokensNode[key].token,
            key: key
          });
        }

        return admin
          .messaging()
          .sendToDevice(tokens, payload)
          .then(response => {
            console.log("sendToDevice response", response);
            console.log("response.results", response.results);

            response.results.forEach((result, i) => {
              if (!result.error) return;

              console.log("Error for token", tokensWithKey[i]);
              console.log("Error Details", result.error);

              admin
                .database()
                .ref("/tokens")
                .child(tokensWithKey[i].key)
                .remove();
            });

            admin
              .database()
              .ref("/notifications")
              .child(notificationSnap.key)
              .remove();

            return response;
          })
          .catch(error => {
            console.info("Error sending message:", error);
            return error;
          });
      });
  });
