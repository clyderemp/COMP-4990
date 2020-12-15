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

    //If an employer is currently logged in then send to home page
    if (user && loggingAs=='employer') {
      sentToHomePage('employer');
    }
    else {

    }
  });
})
  //FOR LOG IN BUTTON
  function employerlogin(){
  
    var userEmail = document.getElementById("employer_email").value;
    var userPass = document.getElementById("employer_pass").value;
    firebase.auth().signInWithEmailAndPassword(userEmail, userPass).then(function(){
    
      firebase.auth().onAuthStateChanged(function(user) {
        var user = firebase.auth().currentUser;
          if(user)
            sentToHomePage('employer');
      });
    }).catch(function(error){
      var html = '<br><br><input onclick=resetEmployer() type="button" class="button" value="Reset password" style="background-color:red;"><br>';
      $("#resetEmployer").html(html);
      alert(error);
    });
}

//Reset the employer's email
function resetEmployer(){
  var auth = firebase.auth();
  var emailAddress = document.getElementById("employer_email").value;
  
  auth.sendPasswordResetEmail(emailAddress).then(function() {
    // Email sent.
    window.alert("Password Reset Email has been sent to "+emailAddress);
  }).catch(function(error) {
    // An error happened.
    window.alert(error);
  });
}
