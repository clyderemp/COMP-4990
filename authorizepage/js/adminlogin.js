/**
 * 
 * LOGIN SCRIPT FOR THE ADMIN LOGIN PAGE
 * Author: Clyde Rempillo
 * Last edit: April 26, 2020
 * Summary of last edit:
 *    I basically just worked on the log in ui, and made sure that reset button worked when invalid inputs are submmitted
 * 
 * 
**/


$(function(){

  firebase.auth().onAuthStateChanged(function(user) {
    var user = firebase.auth().currentUser;

    if (user) {
      try{
        if(document.getElementById("loginAs").value == "admin")
        window.location.href = "../adminpage/index.html"
      }catch{}
      
    }
    else {
    //  
    }
  });
})


//FOR LOG IN BUTTON
function adminlogin(){

  var userEmail = document.getElementById("email_admin").value;
  var userPass = document.getElementById("password_admin").value;

  var splitEmail = (userEmail.toLowerCase()).split("@");
  var splitDomain = splitEmail[1].split(".");
  console.log(splitDomain[0]+","+splitEmail[0]);
    
  var docRef = firebase.firestore().collection("admin").doc(splitDomain[0]).collection(splitEmail[0]).doc("user");//Sets the doc reference
               
  //CHECKS IF THE USER IS AUTHORIZED BEFORE LOGGING INTO ADMIN
  docRef.get().then(function(doc) { //Gets the document reference and checks for the document
        
    if (doc.exists){ //if the document exists then output the fullname
      
      firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
        // Handle Errors here.
        var errorMessage = error.message;
        });
      }
      else
        window.alert('Your user is not authorized to access this page');
    }).catch(function(error) { //Catch any retrieval error
      console.log(error);
    });
}

function adminlogout(){
 
  firebase.auth().signOut().then(function() {
    window.location.href = "../authorizepage/login.html"
        // Sign-out successful.
  }).catch(function(error) {
      window.alert("ERROR: " + error.message);
    })
}