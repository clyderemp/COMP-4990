$(function(){
  setTimeout(function(){$('body').addClass('loaded');}, 2000);
   
    firebase.auth().onAuthStateChanged(function(user) {
        var user = firebase.auth().currentUser;
        var db = firebase.firestore();
    
        if (user) {
            var splitEmail = (user.email).split("@");
            var splitDomain = splitEmail[1].split(".");
            console.log(splitDomain[0]+","+splitEmail[0]);
              
            var docRef = firebase.firestore().collection("staff").doc("post-secondary").collection(splitDomain[0]).doc(splitEmail[0]);//Sets the doc reference
                         
            //CHECKS IF THE USER IS AUTHORIZED BEFORE LOGGING INTO ADMIN
            docRef.get().then(function(doc) { //Gets the document reference and checks for the document
                  
              if (doc.exists){ //if the document exists then output the fullname
                var fname = doc.data().fname;
                var lname = doc.data().lname;
                var school = doc.data().school;
                var idnum = doc.data().id_num;

                document.getElementById("profname").textContent = fname+" "+lname;
                document.getElementById("profschool").textContent = school;
                document.getElementById("idnum").textContent = "Staff number: "+idnum;

                }
                else
                  window.alert('Your user is not authorized to access this page');
              }).catch(function(error) { //Catch any retrieval error
                console.log(error);
              });
        }
        else {
  
        }
      });

})