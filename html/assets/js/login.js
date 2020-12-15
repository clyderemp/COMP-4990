
//Firiebase Initialization
var db = firebase.firestore();


firebase.auth().onAuthStateChanged(function(user) {
  if (user) {
    // User is signed in.
    document.getElementById("loggedin").style.display = "block";
    document.getElementById("loggedout").style.display = "none";


    //Ensure that only the log out button is activated
    document.getElementById("logout-btn").style.display = "initial";
    document.getElementById("reset-btn").style.display = "initial";

    var user = firebase.auth().currentUser;
    //To make sure that a user is actually logged in
    if(user != null){

      var splitEmail = user.email.split("@"); //Splits the email into 2 strings
      var splitSchoolDomain = splitEmail[1].split("."); //Splits the email into 2 strings by the period
      var username = splitEmail[0]; //takes the username from the initial split email array
      var school = splitSchoolDomain[0];  //takes the schoolname from the splitter array

       document.getElementById("email").innerHTML = "University Domain:\n" + school; //Outputs the school of the student

       var docRef = db.collection(school).doc(username); //Sets the doc reference
       
       docRef.get().then(function(doc) { //Gets the document reference and checks for the document
        
           if (doc.exists) { //if the document exists then output the fullname
            document.getElementById("school").innerHTML = doc.data().fname +" "+ doc.data().lname;
           }
           else { //else report an database error --> USER IS AUTHORIZED BUT HAS NO USER FILE ON DATABASE
            document.getElementById("school").innerHTML = "NO FILE EXISTS UNDER YOUR NAME, PLEASE REPORT";
           }
       }).catch(function(error) { //Catch any retrieval error
           console.log("Error getting document:", error);
       });
       
    }//END IF STATEMENT


  } else { //IF NO USER IS LOGGED IN THEN ASK USER TO LOG IN
    document.getElementById("loggedin").style.display = "none";
    document.getElementById("loggedout").style.display = "block";

    document.getElementById("logout-btn").style.display = "none";
    document.getElementById("reset-btn").style.display = "none";
  }
});

//FOR THE LOGIN SUBMISSION BUTTON
function login(){

  var userEmail = document.getElementById("email_field").value;
  var userPass = document.getElementById("password_field").value;

  firebase.auth().signInWithEmailAndPassword(userEmail, userPass).catch(function(error) {
  // Handle Errors here.
  var errorMessage = error.message;
  document.getElementById("reset-btn").style.display = "initial";

  window.alert("ERROR: " + errorMessage);
  }); 
}

//FOR THE LOGOUT BUTTON
function logout(){
  firebase.auth().signOut().then(function() {
    // Sign-out successful.
    document.getElementById("loggedin").style.display = "none";
  }).catch(function(error) {
    window.alert("ERROR: " + error.message);
  });
}

//FOR THE PASSWORD RECOVERY BUTTON
function reset(){
  var auth = firebase.auth();
  var userEmail = document.getElementById("email_field").value;

  alert("A recovery email has now been sent to "+userEmail+"\nPlease check your email and reset your password.\n\nYou may now close this window.")

  auth.sendPasswordResetEmail(userEmail).then(function() {
  // Email sent.
  }).catch(function(error) {
  // An error happened.
  window.alert("ERROR: " + error.message);
  });
}