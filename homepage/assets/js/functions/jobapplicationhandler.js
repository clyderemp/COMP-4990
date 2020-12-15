
//Query listener for resume upload
$(function(){
    //Add a listener to the photo uploader
    window.addEventListener('load', function() {
        document.querySelector('#resumeUpload').addEventListener('change', function() {
            if (this.files && this.files[0]) {

                //SET THE FILE PATH
                userfilepath = 'resume-storage/'+uid+'/';
                
                //create a storage ref
                storageRef = firebase.storage().ref(userfilepath + '/' +uid+'-resume.pdf');

                //upload file
                var task = storageRef.put(this.files[0]);

                task.on('state_changed',
                function progress(snapshot){//uploading process
                console.log(snapshot);
                },

                function error(err){ //if the user uploads a non-pdf file
                    console.log(err);
                },

                function complete(snap){ //succesful upload
                    alert("MyLogo uploaded! Updating interface now...");
                    console.log("MyLogo uploaded!");
                    location.reload();
                }
                );
            }
        });
    });
    
});

function triggerResumeUpload(){
    $('#resumeUpload').trigger('click');
}

//Function handles job object to have user apply for that specific job
function applyNow(job){
    console.log(job.id);

    swal("Applying for "+job.name+'Position?', "You may confirm or cancel below...", {
        icon : "success",
        buttons: {
            confirm: {
              text: "Proceed with my application and submit my resume!",
              value: true,
              visible: true,
              className: "btn-success",
              closeModal: true
            },
            cancel: {
                text: "Cancel",
                value: null,
                visible: true,
                className: "",
                closeModal: true,
              }
          },
    }).then(function(value){
        if(value)
            checkForResumeExistence(job);
        else{
            document.getElementById(job.id).innerHTML = "Apply Now!";
            document.getElementById(job.id).disabled = false;
        }
    })
}

//Function checks if resume of user exists
function checkForResumeExistence(job){
    //SET THE FILE PATH
    var userfilepath = 'resume-storage/'+uid+'/';
    console.log(uid);
    //create a storage ref
    var storageRef = firebase.storage().ref(userfilepath);
    
    storageRef.child(uid+'-resume.pdf').getDownloadURL()
    .then(function(url){
        submitApplicantInfo(url, uid, job);
    })
    .catch(function(error){ //IF RESUME DOESNT EXIST THEN ASK THE USER TO UPLOAD ONE
        console.log(error);
        swal("Uh-oh!", "You will need to upload your personal resume to proceed with the application!", {
            icon : "warning",
            buttons: {
                confirm: {
                  text: "Upload myResume.pdf",
                  value: true,
                  visible: true,
                  className: "btn-danger",
                  closeModal: true
                },
                cancel: {
                    text: "Cancel",
                    value: null,
                    visible: true,
                    className: "",
                    closeModal: true,
                  }
              },
        }).then(function(value){
            if(value)
                $('#resumeUpload').trigger('click');
        });
    });
}

//Function sends the user id and resume url to the employers
function submitApplicantInfo(url, uid, job){
    var applicationDB = firestoreDB.collection('myacadvisor-db').doc('myjobs-db').collection('jobs').doc(job.id).collection('applicants');
    var applicantData = {
        resumeURL: url,
        applicantID: uid,
    }
    //Success
    applicationDB.doc(uid).set(applicantData).then(function(){
        swal("Application Sent!", "Resume and application sent! Good luck!", {
            icon : "success",
            buttons: {
                confirm: {
                  text: "Ok",
                  value: true,
                  visible: true,
                  className: "btn-primary",
                  closeModal: true
                }
              },
        });

    //Disabled apply now button and output applied    
    document.getElementById(job.id).innerHTML = "Applied";
    document.getElementById(job.id).disabled = true;
        
    });
    var today = new Date();
    var date = (today.getMonth()+1)+'-'+today.getDate() +'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;
    var userAccount = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection('student').doc('post-secondary')
    .collection(uid).doc('applicationHistory').collection('applications');
    var appData = {
        resumeURL: url,
        jobID: job.id,
        appliedOn: dateTime
    }
    userAccount.doc(job.id).set(appData);
    
}