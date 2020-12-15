//CHANGE PASSWORD BUTTON IN THE SETTINGS
$('#changepassBtn').click(function(){
    var content = document.getElementById("changePassForm");
    var content2 = document.getElementById("deleteAccForm");
  
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
        content2.style.display = "none";
    }
});

//THIS IS FOR THE DELETE ACC BUTTON IN THE SETTINGS
$('#deleteAccBtn').click(function(){
    var content = document.getElementById("deleteAccForm");
    var content2 = document.getElementById("changePassForm");
  
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
        content2.style.display = "none";
    }
});
  
$('#yesDelete').click(function(){
    var content = document.getElementById("deleteMessage");
    
    content.innerHTML = "After you finalize this action, it will delete your:</p><p>1. MyAcAdvisor Account</p><p>2. Transcript Records</p><p>3. MyIntel and MyProgress Report</p>";
    document.getElementById("confirm").style.visibility = "visible";
});
  
$('#noDelete').click(function(){
    var content = document.getElementById("deleteAccForm");
    var content2 = document.getElementById("changePassForm");
  
    if (content.style.display === "block") {
        content.style.display = "none";
    } else {
        content.style.display = "block";
        content2.style.display = "none";
    }
});

//IF THE PASSWORDS MATCH
function checkPasswordMatch() {
    var password = $("#pass1").val();
    var confirmPassword = $("#pass2").val();
    var btn = document.getElementById("confirmBtn");
    
    document.getElementById("error").textContent = "";
    if (password != confirmPassword){
        btn.disabled=true;
        btn.value = "Passwords don't match";
    }
    else{
        btn.disabled=false;
        btn.value = "Confirm changes!";
    }
}

//THIS IS TO CHECK PERSISTENTLY CHECK THE PASSWORD CHANGE
$(document).ready(function () {
    var btn = document.getElementById("confirmBtn");
    btn.value = "Please enter your new password";
        
    $("#pass1").keyup(checkPasswordMatch);
    $("#pass2").keyup(checkPasswordMatch);
});
  
$('#confirmBtn').click(function(){
    var user = firebase.auth().currentUser;
    var newPassword = $("#pass1").val();
      
    user.updatePassword(newPassword).then(function() {
        // Update successful.
        document.getElementById("error").style.color = "green";
        document.getElementById("error").textContent = "Your password has been successfuly updated!";
    }).catch(function(error) {
        // An error happened.
        document.getElementById("error").style.color = "red";
        document.getElementById("error").textContent = error;
    });
});
  
$('#confirm').click(function(){
    var user = firebase.auth().currentUser;
    var db = firebase.firestore();
    var usertype = document.getElementById("loginAs").value;
    var username = user.email.split("@");
    var school = username[1].split(".");
    var docRef = db.collection(usertype).doc("post-secondary").collection(school[0]).doc(username[0]); //Sets the doc reference
    
    window.alert(usertype);
  
    docRef.get().then(function(doc) { //Gets the document reference and checks for the document
                          
        if (doc.exists){ //if the document exists then output the fullname
            var studentnumber = doc.data().id_num; //TO GET THE USER'S STUDENT ID
            deleteFirebaseStorage(usertype, school[0], studentnumber, docRef);
        }
        else { //else report an database error --> USER IS AUTHORIZED BUT HAS NO USER FILE ON DATABASE
        }
    }).catch(function(error) { //Catch any retrieval error
        window.alert(error+"ERROR: No user exists on the database");
    })
});
  
function deleteFirebaseStorage(usertype, school, studentnumber, docRef){
    // Get a reference to the storage service, which is used to create references in your storage bucket
    var storage = firebase.storage();
  
    // Create a storage reference from our storage service
    var storageRef = storage.ref();
  
    var userfilepath = usertype+'/'+school+'/'+studentnumber+'/transcript';
    // Create a reference to the file to delete
    var stoRef = storageRef.child(userfilepath);
    
    // Delete the file
    stoRef.delete().then(function() {
        
    deleteFirestore(docRef);
    // File deleted successfully
    console.log("storage deleted");
    
    }).catch(function(error) {
    console.log("Error in deleteFirebaseStorage() of settings.js");
    })          
}

//DELETES THE COURSE DATA IN FIRESTORE
function deleteFirestore(docRef){
    var courseRef = docRef.collection("courses");
    var courseList = [];
    var deletedCourses = 0;
    var percentage = 0;
    var loadingBar = document.getElementById("uploadValue");
    var resultText = document.getElementById("uploadResult"); //this is for the progress text

    courseRef.get().then(querySnapshot => {
        querySnapshot.forEach(doc => {
            courseList.push(doc.id);
            var coursePath = courseRef.doc((doc.id).toString());  //course --> COMP-1120

            coursePath.delete().then(function() {
                console.log("Course document successfully deleted!");
                deletedCourses++;

                if(deletedCourses == courseList.length-1){
                    finalDelete(docRef)
                }
                else{
                  percentage = (deletedCourses / courseList.length) * 100;
                  loadingBar.style.display = "block";
                  loadingBar.value = percentage;
                  resultText.innerHTML = percentage.toFixed(0)+"%...user deletion in progress...";
                }
                    
            }).catch(function(error) {
                console.error("Error in deleting documents --> deleteFirestore()");
            })
        })
    });  
}

//THIS FUNCTION PERFORMS THE FINAL DELETION OF THE USER DATA
function finalDelete(docRef){
    console.log("Final delete of user data in process..");
    docRef.delete().then(function() {
        
        var user = firebase.auth().currentUser;
        
        user.delete().then(function() {
            console.log("user is now deleted...");
            window.location.href = "../authorizepage/login.html";
            // User deleted.
        }).catch(function(error) {
            console.log("ERROR IN user-auth deletion of finaDelete() in Settings.js");
        }); 
    }).catch(function(error){
            console.log("ERROR IN firestore-user of finaDelete() in Settings.js");
    })
}