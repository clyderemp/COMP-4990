$(function(){
    document.getElementById("load").style.display = "none";
    firebase.auth().onAuthStateChanged(function(user) {
        var user = firebase.auth().currentUser;
        var db = firebase.firestore();
    
        if (user) {
            var splitEmail = (user.email).split("@");
            var splitDomain = splitEmail[1].split(".");
            var courseList = [];
              
            var docRef = db.collection("staff").doc("post-secondary").collection(splitDomain[0]).doc(splitEmail[0]).collection("upcomingSem");//Sets the doc reference
            
            //CHECKS IF THE USER IS AUTHORIZED BEFORE LOGGING INTO ADMIN
            docRef.get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    courseList.push(doc.id);
                    var coursePath = docRef.doc((doc.id).toString());  //course --> COMP-1120
                    
                    coursePath.get().then(function(doc) { //Gets the document reference and checks for the document
                  
                        if (doc.exists){ //if the document exists then output the fullname
                            
                            var courseCode = (doc.id).split("-");

                            
                            firebase.database().ref('/University of Windsor/COMP/'+courseCode[1]).once('value').then(function(snapshot) {
                                var coursename = snapshot.val().coursename;
                                var html = '<option value='+doc.id+'>'+doc.id+': '+coursename+'</option>';
                                $("#courseDrop").append(html);
                            })
                            
                          }
                          else
                            window.alert('Your user is not authorized to access this page');
                        }).catch(function(error) { //Catch any retrieval error
                          console.log(error);
                        });
                })
            });
        }
        else {
  
        }
      });

})

function showCourse(value){

    var db = firebase.firestore();
    var user = firebase.auth().currentUser;
    var splitEmail = (user.email.toLowerCase()).split("@");
    var splitDomain = splitEmail[1].split(".");
    var docRef = db.collection("staff").doc("post-secondary").collection(splitDomain[0]).doc(splitEmail[0]).collection("upcomingSem").doc(value);

    docRef.get().then(function(doc) { //Gets the document reference and checks for the document
          
        if (doc.exists){ //if the document exists then output the fullname
            document.getElementById("load").style.display = "block";
            
            setTimeout(function(){
                document.getElementById("courseContent").style.display = "block";
                document.getElementById("load").style.display = "none";
                document.getElementById("workloadDrop").value = doc.data().workload;
                document.getElementById("difficultyDrop").value = doc.data().difficulty;
                document.getElementById("learningDrop").value = doc.data().learning_style;
            }, 500);
        }
          else
            window.alert('Your user is not authorized to access this page');
        }).catch(function(error) { //Catch any retrieval error
          console.log(error);
        });
}

function saveChanges(){
    var saveButton = document.getElementById("newChanges");
    document.getElementById("warningMessage").innerHTML = "There are unsaved changes";
    document.getElementById("warningMessage").style.color = "red";

    saveButton.style.display = "block";
}

$('#saveButton').click(function(){
    var db = firebase.firestore();
    var user = firebase.auth().currentUser;
    var splitEmail = (user.email.toLowerCase()).split("@");
    var splitDomain = splitEmail[1].split(".");

    var saveButton = document.getElementById("newChanges");
    var courseCode = document.getElementById("courseDrop").value;
    var workload = document.getElementById("workloadDrop").value;
    var difficulty = document.getElementById("difficultyDrop").value;
    var learning_style = document.getElementById("learningDrop").value;

    saveButton.style.display = "none";
    var firestoreRef = db.collection("staff").doc("post-secondary").collection(splitDomain[0]).doc(splitEmail[0]).collection("upcomingSem").doc(courseCode);

    var docData = {
        workload: workload, difficulty: difficulty,  learning_style:learning_style}
    firestoreRef.update(docData).then(function() {
        document.getElementById("warningMessage").innerHTML = "Succesfully saved!";
        document.getElementById("warningMessage").style.color = "green";
        console.log("Course Info Successfully Updated!");
    })

    var code = courseCode.split("-");
    var school = document.getElementById("profschool").textContent; console.log(school +" "+code);
    var path = '/'+school+'/'+code[0]+'/'+code[1];

    updateRealtimeDatabase(path, workload, difficulty, learning_style);
});

function updateRealtimeDatabase(path, workload, difficulty, learning_style){

    firebase.database().ref(path).once('value').then(function(snapshot) {

        var coursename = snapshot.val().coursename;

        var postData = {
            workload: workload, difficulty: difficulty,  learning_style:learning_style, coursename:coursename
        }

        var updates = {};
        updates[path] = postData;
      
        return firebase.database().ref().update(updates);
    })
}