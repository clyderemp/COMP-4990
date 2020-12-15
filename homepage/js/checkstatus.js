$(function(){

  firebase.auth().onAuthStateChanged(function(user) {
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
  
    if (user) {
      // User is signed in.
      if(user!=null){
        var splitEmail = user.email.split("@"); //Splits the email into 2 strings
        var splitSchoolDomain = splitEmail[1].split("."); //Splits the email into 2 strings by the period
        var username = splitEmail[0]; //takes the username from the initial split email array
        var school = splitSchoolDomain[0];  //takes the schoolname from the splitter array
      
        var docRef = db.collection("student").doc("post-secondary").collection(school).doc(username); //Sets the doc reference
               
        docRef.get().then(function(doc) { //Gets the document reference and checks for the document
                
          if (doc.exists){ //if the document exists then output the fullname

            var studentname = document.getElementsByClassName('studentname');
            var schoolname = document.getElementsByClassName("school");
            var studentID = document.getElementById("idnum");
            var loggedInAs = document.getElementsByClassName("level");

            [].slice.call(studentname).forEach(function ( studentname ) {
              studentname.textContent = doc.data().fname +" "+ doc.data().lname;
            });

            [].slice.call(schoolname).forEach(function (schoolname) {
              schoolname.textContent += doc.data().school;
            });

            studentID.textContent += doc.data().id_num;

            [].slice.call(loggedInAs).forEach(function (loggedInAs) {
              loggedInAs.textContent += doc.data().level;
             });
              
            document.getElementById("email").innerHTML += user.email;
          }
          else { //else report an database error --> USER IS AUTHORIZED BUT HAS NO USER FILE ON DATABASE
           document.getElementById("test").innerHTML = "NO FILE EXISTS UNDER YOUR NAME, PLEASE REPORT";
          }

        }).catch(function(error) { //Catch any retrieval error
          console.log("Error in $function in checkstatus.js");
          console.log("Error getting document:", error);
        });
      }
    }
    else {
     document.getElementById("test").innerHTML = "OUT";
    }
  });
})

  
function logout(){
  firebase.auth().signOut().then(function() {
    window.location.href = "../authorizepage/login.html";
      // Sign-out successful.
  }).catch(function(error) {
    window.alert("ERROR: " + error.message);
  })
}