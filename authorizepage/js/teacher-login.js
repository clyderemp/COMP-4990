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
        try{
          if(document.getElementById("loginAs").value == "prof")
          window.location.href = "../prof-page/index.html"
        }catch{}
        
      }
      else {

      }
    });
  })
  
  
  //FOR LOG IN BUTTON
  function teacherlogin(){
  
    var userEmail = document.getElementById("email_prof").value;
    var userPass = document.getElementById("password_prof").value;
      
    var splitEmail = (userEmail.toLowerCase()).split("@");
    var splitDomain = splitEmail[1].split(".");
    console.log(splitDomain[0]+","+splitEmail[0]);
      
    var docRef = firebase.firestore().collection("staff").doc("post-secondary").collection(splitDomain[0]).doc(splitEmail[0]);//Sets the doc reference
                 
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

  function proflogout(){
 
    firebase.auth().signOut().then(function() {
      window.location.href = "../authorizepage/login.html"
          // Sign-out successful.
    }).catch(function(error) {
        window.alert("ERROR: " + error.message);
      })
  }