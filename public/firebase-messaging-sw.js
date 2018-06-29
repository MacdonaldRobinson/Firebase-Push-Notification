console.log("Ran from service worker");
// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here, other Firebase libraries
// are not available in the service worker.
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-app.js");
importScripts("https://www.gstatic.com/firebasejs/4.8.1/firebase-messaging.js");

// Initialize the Firebase app in the service worker by passing in the
// messagingSenderId.

var config = {
  apiKey: "AIzaSyBioudbPLvAw3WoigyP4Mb7qvkgDXIzYgY",
  authDomain: "test-de598.firebaseapp.com",
  databaseURL: "https://test-de598.firebaseio.com",
  projectId: "test-de598",
  storageBucket: "test-de598.appspot.com",
  messagingSenderId: "707478039114"
};

firebase.initializeApp(config);

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messaging = firebase.messaging();
