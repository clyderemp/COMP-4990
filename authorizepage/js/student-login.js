/**
 * 
 * LOGIN SCRIPT FOR THE LOGIN PAGE
 * Author: Clyde Rempillo
 * Last edit: April 26, 2020
 * Summary of last edit:
 *    I basically just worked on the log in ui, and made sure that reset button worked when invalid inputs are submmitted
 * 
 * 
**/
var path = firestoreDB.collection('myacadvisor-db').doc('myaccount-db');

$(function(){
  firebase.auth().onAuthStateChanged(function(user) {
    var user = firebase.auth().currentUser;

    if (user) {
     // User is signed in.
      if(user!=null){
        uid = user.uid;
        var docRef = path.collection(loggingAs).doc("post-secondary");
        var userData = docRef.collection(uid).doc('userData'); //Sets the doc reference
                 
        userData.get().then(function(doc) { //Gets the document reference and checks for the document
              
          if (doc.exists){ //if the document exists then output the fullname
            document.getElementById("fname").innerHTML = doc.data().fname;
            document.getElementById("lname").innerHTML = doc.data().lname;
            location.href = "../homepage/user/index.html";
          }
          else { //else report an database error --> USER IS AUTHORIZED BUT HAS NO USER FILE ON DATABASE
                  document.getElementById("fname").innerHTML = "NO FILE EXISTS UNDER YOUR NAME, PLEASE REPORT";
          }
          }).catch(function(error) { //Catch any retrieval error
                 console.log("Error in studentlogin()");
                 console.log(error);
          });
      }

      //Buttons
      document.getElementById("resetbtn").style.display = "none";
      document.getElementById("logout-button").style.display = "initial";
      document.getElementById("login-button").style.display = "none";
      document.getElementById("continue").style.display = "initial";

      //texts
      document.getElementById("message").style.display = "initial";
      document.getElementById("warning").innerHTML = "";
      document.getElementById("welcome").remove();
      document.getElementById("welcomeText").remove();
      
      //fields
      document.getElementById("email_field").style.display = "none";
      document.getElementById("password_field").style.display = "none";

    }
    else {
      //buttons
      document.getElementById("resetbtn").style.display = "none";
      document.getElementById("logout-button").style.display = "none";
      document.getElementById("login-button").style.display = "initial";
      document.getElementById("continue").style.display = "none";    
      
      //texts   
      document.getElementById("message").style.display = "none";
      document.getElementById("warning").innerHTML = "Please login with your school email";
      document.getElementById("welcomeText").innerHTML = "You are logging in as a Student";

      //fields
      document.getElementById("email_field").style.display = "block";
      document.getElementById("password_field").style.display = "block";
    }
  });
})


//FOR LOG IN BUTTON
function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function(){
    
    firebase.auth().onAuthStateChanged(function(user) {
      var user = firebase.auth().currentUser;
        if(user)
          sentToHomePage('student');
    });
  }).catch(function(error){
      document.getElementById("resetbtn").style.display = "initial";
      alert(error);
  });
}

function resetEmail(){
  var auth = firebase.auth();
  var emailAddress = document.getElementById("email_field").value;
  
  auth.sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
    window.alert("Password Reset Email has been sent to "+emailAddress);
  }).catch(function(error) {
    // An error happened.
    window.alert(error);
  });
}

function continuetoMyAccount(){
  sentToHomePage('student');
}