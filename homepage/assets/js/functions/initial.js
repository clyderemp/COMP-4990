var jobsapplied = [];
$(function(){

  userAuth.onAuthStateChanged(function(user) {
    var user = userAuth.currentUser;
    
    initializeJobList(user.uid);
    loadPic(user.uid);
    if (user && user!=null){
        var uid = user.uid;
        var firebasePath = docRef.collection(uid).doc('userData'); //Sets the doc reference
                   
          firebasePath.get().then(function(doc) { //Gets the document reference and checks for the document
                
          if (doc.exists){ //if the document exists then output the fullname
            loadPic(uid);
          }
          else { //else report an database error --> USER IS AUTHORIZED BUT HAS NO USER FILE ON DATABASE
           //document.getElementById("test").innerHTML = "NO FILE EXISTS UNDER YOUR NAME, PLEASE REPORT";
          }

        }).catch(function(error) { //Catch any retrieval error
          console.log("Error in $function in checkstatus.js");
          console.log("Error getting document:", error);
        });
      }
    else {
    }
  });
});

function initializeJobList(uid){
  
  var userAccount = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection('student').doc('post-secondary').collection(uid).doc('applicationHistory').collection('applications');
  userAccount.get().then(snapshot => {
    snapshot.forEach(doc => {
      jobsapplied.push(doc.id);
    })
  });
}