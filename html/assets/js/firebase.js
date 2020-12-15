var app_firebase = {};
var database;

(function(){
    
        // Your web app's Firebase configuration
        var firebaseConfig = {
            apiKey: "AIzaSyBhU3IOX0Xgb8ccnDI3zVGHfGCvtWxNFTc",
            authDomain: "project4990-uw.firebaseapp.com",
            databaseURL: "https://project4990-uw.firebaseio.com",
            projectId: "project4990-uw",
            storageBucket: "project4990-uw.appspot.com",
            messagingSenderId: "25189738059",
            appId: "1:25189738059:web:6abf4f4800a8263c4e8fce",
            measurementId: "G-WT9EFRMTT6"
          };
          // Initialize Firebase
          firebase.initializeApp(firebaseConfig);
          firebase.analytics();
          database = firebase.database();

          var ref = database.ref('institutions');
          ref.on('value', errData, gotData)
 
    app_firebase = firebase;

})()