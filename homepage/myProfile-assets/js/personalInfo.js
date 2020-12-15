$(function(){
    var user  = userAuth.currentUser;
    console.log(user.email);

    var splitEmail = user.email.split("@"); //Splits the email into 2 strings
          var splitSchoolDomain = splitEmail[1].split("."); //Splits the email into 2 strings by the period
          var username = splitEmail[0]; //takes the username from the initial split email array
          var school = splitSchoolDomain[0];  //takes the schoolname from the splitter array
      
          var docRef = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection('student').doc("post-secondary").collection(user.uid).doc(user.uid); //Sets the doc reference
                   
            docRef.get().then(function(doc) { //Gets the document reference and checks for the document
                
                if (doc.exists){
                    $('#userFullName').text(doc.data().fname + " " +doc.data().lname);
                    $('#fnameSettings').value(doc.data().fname);
                }});
});