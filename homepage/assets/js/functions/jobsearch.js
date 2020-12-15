//This script is for populating the job matching panel with employers
function updateJobList(){
    var jobmatches = 0;
$(function(){
    userAuth.onAuthStateChanged(function(user) {
        var user = userAuth.currentUser;
        if (user &&  user != null) {
            checkResumeExist(user.uid);
        }
    });
});
function checkResumeExist(uid){
                        
    var htmlTemplate =  '<div class="d-flex" id="resumeChecker"><div class="flex-1 pt-1 ml-2">'+
    "<h6 class='fw-bold mb-1'>We're sorry! Data Not Available</h6>"+
    '<small class="text-muted">Uploading an updated resume may increase your job matches!<br></small></div>'+
    '<div class="d-flex ml-auto align-items-center">'+
    '<button class="btn btn-secondary btn-block" onclick=triggerResumeUpload()>Upload myResume</button>'+
    '</div></div><div class="separator-dashed"></div>'

    $('#joblistmatches').append(htmlTemplate);

    //SET THE FILE PATH
    var userfilepath = 'resume-storage/'+uid+'/';
    
    //create a storage ref
    var storageRef = firebase.storage().ref(userfilepath);

    storageRef.child(uid+'-resume.pdf').getDownloadURL().then(function(url) {

        getTopIntel(uid);
    }).catch(function(error) {
        console.log(error);
    });
}
//Functions gets the users' top intel from the myintel report
function getTopIntel(uid){
    var intelDatabase = firestoreDB.collection('myacadvisor-db').doc('myintel-db').collection(uid).doc("step2-Report");
    var intelArray = [];
    intelDatabase.get().then(function(doc){
        var intelligences = doc.data().step2Results;
        
        for(var i = 0; i<intelligences.length; i++){

        var strength = intelligences[i].split(":");
        intelArray.push(strength[0]);
        }
        getFieldOfStudy(intelArray, uid);
    });
}
//Function gets the users' field of study from the transcript
function getFieldOfStudy(strengths, uid){
    var userData = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection('student').doc("post-secondary").collection(uid);

    userData.doc('userData').get().then(function(doc){
        var fieldOfStudy = doc.data().major;

        getJobs(strengths, uid, fieldOfStudy);
    });
}

//Funciton gets the jobs listed on the database
function getJobs(strengths, uid, fieldOfStudy){
    var jobDatabase = firestoreDB.collection('myacadvisor-db').doc('myjobs-db').collection("jobs");
    jobDatabase.get().then(snapshot => {
        snapshot.forEach(job => {
            checkJobUserMatch(job, strengths, uid, fieldOfStudy);
        })
    });
}

//Function checks the match between the jobs and the applicants
function checkJobUserMatch(jobinfo, strengths, uid, fieldOfStudy){
    var intelrequiredmatch = 0;
    var jobfieldstudyrequired = jobinfo.data().fieldofstudy;
    
    var jobsintelrequired = [jobinfo.data().strength1,jobinfo.data().strength2,jobinfo.data().strength3];
    
    //If the required field of study matches the user's then proceed
    if(fieldOfStudy.includes(jobfieldstudyrequired) || jobfieldstudyrequired.includes(fieldOfStudy)){

        console.log(jobfieldstudyrequired + ' -->true');
        for(var i = 0; i<strengths.length; i++){
            for(var n = 0; n<jobsintelrequired.length; n++){
                
                //Check if the user's top strengths are in the required given by the employers
                if(strengths[i]==jobsintelrequired[n]){
                    console.log(strengths[i], jobsintelrequired[n]);
                    intelrequiredmatch++;
                }
            }
        }
        //If all 3 job intel requirement matches the user's intel then its a match
        if(intelrequiredmatch == 3){
            jobmatches++;
            if(jobmatches!=0)
                $('#resumeChecker').remove(); //If atleast one match, then remove previous empty panel
            
            if(jobmatches==1)
                $('#jobmatches').text(jobmatches+' Job Match Today!');
            else
                $('#jobmatches').text(jobmatches+' Job Matches Today!');
            outputJobMatches(jobinfo);
        }
    }
    else{
        console.log(jobfieldstudyrequired + '--> false');
    }
}

function outputJobMatches(jobinfo){
    var jobtitle = jobinfo.data().jobtitle;
    var company = jobinfo.data().companyname;
    var location = jobinfo.data().joblocation;
    var jobtype = jobinfo.data().jobtype;

    var htmlTemplate =  '<div class="d-flex"><div class="flex-1 pt-1 ml-2">'+
                        '<h6 class="fw-bold mb-1">'+jobtype+' '+jobtitle+'</h6>'+
                        '<small class="text-muted">'+company +' - '+location+'</small></div>'+
                        '<div class="d-flex ml-auto align-items-center" id="'+jobinfo.id+'apply">'+
                        '<button class="btn btn-secondary btn-block" onclick=applyNow(this) id='+jobinfo.id+' name='+
                        jobtitle+'>Apply Now</button>'+
                        '</div></div><div class="separator-dashed"></div>'

    $('#joblistmatches').append(htmlTemplate);

    for(var i=0; i<jobsapplied.length; i++){
        if(jobsapplied[i] == jobinfo.id){
            $('#'+jobsapplied[i]).prop('disabled', true);
            document.getElementById(jobsapplied[i]).innerHTML = "Applied";
        }
    }
}
//End of script
}