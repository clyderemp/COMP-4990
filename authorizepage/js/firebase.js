var app_firebase = {};
var database;

(function(){
  
 
  // Your web app's Firebase configuration
  var firebaseConfig = {
    apiKey: "AIzaSyCEWW9a_Iwtp3bXHP32GMeg5GvcCNE-8MU",
    authDomain: "myacadvisor.firebaseapp.com",
    databaseURL: "https://myacadvisor.firebaseio.com",
    projectId: "myacadvisor",
    storageBucket: "myacadvisor.appspot.com",
    messagingSenderId: "565651243474",
    appId: "1:565651243474:web:3eda572b16f4475436880b",
    measurementId: "G-CREGYFW8FM"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  // Get a reference to the storage service, which is used to create references in your storage bucket
  //var storage = firebase.storage();
})();

const firestoreDB = firebase.firestore();
const realtimeDB = firebase.database();
const storageDB = firebase.storage();
const userAuth = firebase.auth();
const currentUser = userAuth.currentUser;