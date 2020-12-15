/**
 * 
 * LOGIN SCRIPT FOR THE TEACHER LOGIN PAGE
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
      var db = firebase.firestore();
  
      if (user) {
        //
      }
      else {

      }
    });
  })
  
  
  //FOR LOG IN BUTTON
  function parentlogin(){
  
    var userEmail = document.getElementById("email_parent").value;
    var userPass = document.getElementById("password_parent").value;
      
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
            // Handle Errors here.
          var errorMessage = error.message;
  
          window.alert("ERROR: " + errorMessage);
    });
  }