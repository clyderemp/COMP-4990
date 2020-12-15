//Handles all student users
function handleStudents(doc, userData){
    var level = doc.data().level;
    var schoolpath = doc.data().school;
    var id = doc.data().id_num;
    var newTranscript = doc.data().newTranscript;
    var path = 'transcript-storage/'+level+'/'+schoolpath+'/'+id+'/transcript/';
    
    var studentname = document.getElementsByClassName('studentname');
    var schoolname = document.getElementById("school");
    var studentID = document.getElementById("idnum");
    var loggedInAs = document.getElementsByClassName("user-level");

    [].slice.call(studentname).forEach(function ( studentname ) {
        studentname.textContent = doc.data().fname +" "+ doc.data().lname;
        document.getElementById("welcomeUser").textContent = "Welcome "+studentname.textContent+"!";
      });

      schoolname.textContent = "Institution: "+doc.data().school;

      studentID.textContent += doc.data().id_num;

      [].slice.call(loggedInAs).forEach(function (loggedInAs) {
        loggedInAs.textContent = (doc.data().level).toUpperCase();
       });
        
      document.getElementById("email").innerHTML = doc.data().email;
    /**Check IF there's a new transcript uploaded
                     * ELSE just read the data you've previously uploaded
                     * This is to avoid any unnecessary parsing of the transcript to fasten the loading process
                     * **/
    if(newTranscript == 'true'){
        loadinitialdata();
        var fileRef = storageRef.child(path);

        // Get the download URL
        fileRef.getDownloadURL().then(function(url) {

        // read text from URL location
                            var request = new XMLHttpRequest();
                            request.open('GET', url, true);
                            request.send(null);

                            request.onreadystatechange = function () {
                                if (request.readyState === 4 && request.status === 200) {

                                    //GET THE CONTENT FOR THE TEXT FILE
                                    var type = request.getResponseHeader('Content-Type');
                                    if (type.indexOf("text") !== 1) {
                                        var data = request.responseText;

                                        var key = document.getElementById("idnum").textContent;
                                        try{
                                        
                                        /**
                                         * DECRYPT THE TEXT FILE FROM FIRBASE
                                         */
                                        var decrypted = (CryptoJS.AES.decrypt(data, key));
                                        var file = decrypted.toString(CryptoJS.enc.Utf8);
                                        var fullinfo = file.split('\n');
                                        
                                        getOEN(fullinfo, userData);
                                        getCumulativeAverage(fullinfo, userData);
                                        getMajorAverage(fullinfo, userData);
                                        getBachelors(fullinfo, userData);
                                        getAnyMinor(fullinfo, userData);
                                        
                                        getSemester(fullinfo, userData);

                                        var fullinfoData = {
                                            fullTranscriptData: fullinfo
                                        }
                                        updateTranscriptData(fullinfoData, userData);
                                        loadCalcMyAve();
                                        }catch(err){
                                            console.log("Error in $function in loader.js");
                                            console.log(err);
                                        }
                                    }
                                }
                            }   
                        }).catch(function(error) {
                            swal("Welcome!", "It is mandatory to upload a transcript upon your first log in!", {
                                icon : "warning",
                                buttons: {        			
                                    confirm: {
                                        text: 'Upload here',
                                        className : 'btn-warning'
                                    }
                                },
                            }).then(function() {
                                $('#file').trigger('click');
                            });
                        });
                    }
                    else{
                        getDataFromFirestore(doc, userData);
                        //console.log('no new transcript');
                    }
                    //End of if else statement for checking transcript
}

function handleEmployer(doc){
    //Declaration of elements
    var studentname = document.getElementsByClassName('username');
    var companyname = document.getElementById("company");
    var phonenum = document.getElementById("phonenum");
    var loggedInAs = document.getElementsByClassName("user-level");
    var accountinfo = document.getElementById("accountinfo");
    accountinfo.innerHTML = '';
    //to output the creation date of user
    userData = docRef.collection("employer").doc(uid).collection("employerData").doc('creationDate');
    userData.get().then(function(doc) { //Gets the document reference and checks for the document
            
        if (doc.exists)
        accountinfo.innerHTML += "<br>Creation Date: "+doc.data().createdOn;

        var today = new Date();
        var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
        var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
        var dateTime = date+' '+time;

        accountinfo.innerHTML += "<br>Data given below is updated as of "+dateTime;
    });


    [].slice.call(studentname).forEach(function ( studentname ) {
        studentname.textContent = doc.data().fname +" "+ doc.data().lname;
        document.getElementById("welcomeUser").textContent = "Welcome "+studentname.textContent+"!";
      });

    companyname.textContent = "Company: "+doc.data().companyname;
    accountinfo.innerHTML += "Company: "+doc.data().companyname;
    
    phonenum.textContent += doc.data().phonenum;

    [].slice.call(loggedInAs).forEach(function (loggedInAs) {
        loggedInAs.textContent = (doc.data().level).toUpperCase();
    });
        
    document.getElementById("email").innerHTML = doc.data().email;

}