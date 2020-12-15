/**************
 * THIS IS A FILE UPLOADER JAVASCRIPT FILE
 * THIS IS MEANT FOR UPLOADING THE PDF TRANSCRIPTS THAT WILL BE PROVIDED BY THE USER
 * THIS IS THEN UPLOADED TO THE FIREBASE STORAGE
 * IT IS DOWNLOADED FROM THE CLOUD STORAGE AND PROCESSED IN THE PDF EXTRACTOR
 * 
 * THIS IS ALWAYS REPLACE THE EXISTING TRANSCRIPT FILE
 */


$(function(){
    window.alert("got here");
    document.getElementById("uploadValue").style.display = "none";
    showUploadPanel();
    //THIS IS TO GET ALL THE EXISTING USER INFO FROM THE FIRESTORE/DATABASE
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

                        var usertype = doc.data().level; //TO GET THE USER TYPE
                        var studentnumber = doc.data().id_num; //TO GET THE USER'S STUDENT ID

                        submit(usertype, studentnumber, school); //THIS PASSES ALL THE INFO TO THE STORAGE UPLOADER
                    }

                    else { //else report an database error --> USER IS AUTHORIZED BUT HAS NO USER FILE ON DATABASE
                        
                    }

                    }).catch(function(error) { //Catch any retrieval error
                        window.alert("ERROR: No user exists on the database");
                    });
            }
        }
         else {
        
        }
    });
  })

    function submit(usertype,studentnumber, school){

        var upload = document.getElementById("upload-btn"); //UPLOAD BUTTON
        var loader = document.getElementById("uploadValue"); //PROGRESS BAR

                //listen for file selection
                upload.addEventListener('change', function(e){

                    var file = e.target.files[0];
                    //SET THE FILE PATH
                    var userfilepath = "gs://project4990-uw.appspot.com/"+usertype+'/'+school+'/'+studentnumber;

                    //create a storage ref
                    var storageRef = firebase.storage().ref('/transcript');

                    //upload file
                    var task = storageRef.put(file);

                    var resultText = document.getElementById("uploadResult"); //this is for the progress text
                        resultText.style.fontWeight = "bold";
                    var loadingBar = document.getElementById("uploadValue"); //this is the loading bar

                    task.on('state_changed',
                        function progress(snapshot){//uploading process
                            var percentage = (snapshot.bytesTransferred / snapshot.totalBytes) *100;
                            
                            loadingBar.style.display = "block";
                            loader.value = percentage;

                            resultText.innerHTML = percentage.toFixed(0)+"%...uploading...";
                        },

                        function error(){ //if the user uploads a non-pdf file
                            loadingBar.style.display = "none";
                            resultText.innerHTML = "Upload failed due to invalid input. Please upload a valid pdf file.";
                            resultText.style.color = "red";
                        },

                        function complete(){ //succesful upload
                            loadingBar.style.display = "none";
                            resultText.innerHTML = "TRANSCRIPT UPLOADED!";
                            resultText.style.color = "green";
                        }
                    );

                })
    }

    //THIS IS TO SHOW THE UPLOAD PANEL
    function showUploadPanel(){

        var coll = document.getElementsByClassName("collapsible"); //this is the upload button
        var i;
        
        for (i = 0; i < coll.length; i++) {

          coll[i].addEventListener("click", function() {

            this.classList.toggle("active");

            var content = this.nextElementSibling;

            if (content.style.display === "block") {
              content.style.display = "none";
              document.getElementById("uploadResult").innerHTML = "";
            }
            else {
              content.style.display = "block";
            }

          });
        }
    }