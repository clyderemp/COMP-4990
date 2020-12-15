$(function(){
    userAuth.onAuthStateChanged(function(user) {
        
      if (user && user!=null){
            var uid = user.uid;
            var userData = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection("employer").doc(uid).collection("employerData");
					   
            userData.doc("userData").get().then(function(doc) { //Gets the document reference and checks for the document
                    
                if (doc.exists){
                    document.getElementById("tableSection-content").innerHTML = '<tr id=temp disabled>'
                    +'<td>~~~~~END OF LIST~~~~~</td><td>~~~~~END OF LIST~~~~~</td><td>~~~~~END OF LIST~~~~~</td>'
                    +'<td>~~~~~END OF LIST~~~~~</td><td>~~~~~END OF LIST~~~~~</td><td>~~~~~END OF LIST~~~~~</td></tr>';
                    $("#temp").hide();
                    var html = '<th scope="col" class="text-center">Job Title</th>'
                    +'<th scope="col" class="text-center">Location</th>'
                    +'<th scope="col" class="text-center">Type</th>'
                    +'<th scope="col" class="text-center">Field of Study</th>'
                    +'<th scope="col" class="text-center">Job Posted</th>'
                    +'<th scope="col" class="text-center"># of Applicants</th>';
                //APPEND THE TABLE FOR EACH COURSE
                $("#tableSection-header").append(html);
                $("#tableSection-footer").append(html);
                    var companyUID = doc.data().uid;
                    getAllJobs(companyUID);
                }
                else
                console.log("non exists");

            }).catch(function(error) { //Catch any retrieval error
                    console.log("Error in $function in searchCourses.js");
                    console.log("Error getting document:", error);
            });
        }
    });
});

function getTotalApplicants(jobID){
    
    var jobApplicants = [];
    var totalApplicants = 0;
    //Set the reference for the current JOB select
    var applicantsDB = firestoreDB.collection('myacadvisor-db').doc('myjobs-db').collection("jobs").doc(jobID);
        
    applicantsDB.collection('applicants').get().then(snapshot => {
        snapshot.forEach(doc => {
            //Get all of the applicants' ID
            jobApplicants.push(doc.id);
            //Increment per num of applicants
            totalApplicants++;
            //Update the num of applicants on the database
            var applicantData = {
                numOfApplicants: totalApplicants,
                applicantsID: jobApplicants
            }
            //Execute the update
            applicantsDB.update(applicantData);
        })
    }).catch(err =>{
        console.log('error');
    });
}

//THIS IS FOR WHEN THE USER INPUTS THE WORD "ALL" TO GET ALL THE OFFERED COURSES
function getAllJobs(uid){
    var jobDatabase = firestoreDB.collection('myacadvisor-db').doc('myjobs-db').collection("jobs");
	var myjobs = [];
    var htmlArray = []; 	
    var html = ''; var total = 0;
    jobDatabase.get().then(snapshot => {
        snapshot.forEach(doc => {
            if(doc.data().companyUID == uid){
                myjobs.push(doc.id);
                getTotalApplicants(doc.id);

                var jobtitle = doc.data().jobtitle;
                var joblocation = doc.data().joblocation;
                var jobtype = doc.data().jobtype;
                var fieldofstudy  = doc.data().fieldofstudy;
                var dateposted = (doc.data().dateposted).split(' ');
                var numOfApplicants = doc.data().numOfApplicants;
                
                html = '<tr class="text-center" id="'+doc.id+'">'
                +'<td>'+jobtitle+'</td>'
                +'<td>'+joblocation+'</td>'
                +'<td>'+jobtype+'</td>'
                +'<td>'+fieldofstudy+'</td>'
                +'<td>'+dateposted[0]+'</td>'
                +'<td id="'+doc.id+'-jobID">'+numOfApplicants +'</td>'
                +'<td><a name="'+doc.id+'" href="javascript: void(0);" onclick=viewApplicants(this.name)>EDIT</a></td>'
                +'<td><a id=removeBtn href="javascript: void(0);" onclick=removeJob(this.name) name="'+doc.id+'"> REMOVE </a></td></tr>';
                //APPEND THE TABLE FOR EACH COURSE
                htmlArray.push(html);
                
                total++;
            }

        });
        appendJobList(htmlArray);
        showTotalJobPostings(total);
    })
    .catch(err => {
        console.log('Error in emplyerjoblist.js', err);
    });
 }

//Function that handles the list of jobs posted by the current user
function appendJobList(body){

    $("#tableSection-content").append(body);
    $('#multi-filter-select').DataTable({
        "bInfo": false, //To not show the entries as it shows the total length plus 1
        "pageLength": 10,
        initComplete: function () {
            this.api().columns().every( function () {
                var column = this;
                var select = $('<select class="form-control"><option value="">Please select here to search</option></select>')
                .appendTo( $(column.footer()).empty() )
                .on( 'change', function () {
                    var val = $.fn.dataTable.util.escapeRegex(
                        $(this).val()
                        );

                    column
                    .search( val ? '^'+val+'$' : '', true, false )
                    .draw();
                } );

                column.data().unique().sort().each( function ( d, j ) {
                    select.append( '<option value="'+d+'">'+d+'</option>' );
                } );
            } );
        },

    });
}
//Show the total postings at the very top of the page
function showTotalJobPostings(total){
    $("#totaljobs-title").text("My Total Job Posts");
    Circles.create({
        id:"totaljobs",
        radius:50,
        value: total,
        maxValue:total,
        width:7,
        text: total,
        colors: ['#f1f1f1', '#ffcd24'],
        duration:400,
        wrpClass:'circles-wrp',
        textClass:'circles-text',
        styleWrapper:true,
        styleText:true
    });
}

function removeJob(jobID){
    //Set the reference to the database
    var jobDB = firestoreDB.collection('myacadvisor-db').doc('myjobs-db').collection("jobs").doc(jobID);
    //First, to do a full deletion, we must delete each applicant data
    jobDB.collection('applicants').get().then(snapshot => {
        snapshot.forEach(doc => {
            jobDB.collection('applicants').doc(doc.id).delete();    //Delete each applicant data
        });
    });
    //Delete the job
    jobDB.delete();
    //Get the current date and time
    var dateposted = returnCurrentDateandTime();
    //Set the database reference for notification
    var firestorePath = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection("employer").doc(uid).collection("notifications");  //Set the path for job posting on the database
    //Data for the notication
    var notification = {
        message: "Job posting for "+jobtitle+" has been deleted!", type: "jobposting", dateposted: dateposted
    }
    //Generate tokenID for the notification
    var tokenID = generateTokenID();

    //Add the notification
    firestorePath.doc(tokenID).set(notification).then(function() {
    });
    //Reload page
    location.reload();
}



function viewApplicants(jobID){
    //Set the reference to the job's database
    var jobDatabase = firestoreDB.collection('myacadvisor-db').doc('myjobs-db').collection("jobs").doc(jobID);
    //Get all data from the job ID database
    jobDatabase.get().then(function(doc){
        var jobtitle = doc.data().jobtitle;
        var joblocation = doc.data().joblocation;
        var jobtype = doc.data().jobtype;
        var companyname = doc.data().companyname;
        var fieldofstudy  = doc.data().fieldofstudy;
        var dateposted = (doc.data().dateposted).split(' ');
        //Set the htmlbody to be execute to edit the job
        var htmlBody = '<form style="text-align: center;padding-left: 5%;" class="form-group">'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Company:</span>'
                                +'</div><h5 style="padding-top: 8px;">&nbsp&nbsp'+companyname+'</h5></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Date Posted:</span>'
                                +'</div><h5 style="padding-top: 8px;">&nbsp&nbsp'+dateposted[0]+'</h5></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Job Type:</span>'
                                +'</div><select id=jobtypeInput value='+jobtype+'>'
                                +'<option value="Part-Time">Part-Time</option>'
                                +'<option value="Full-Time">Full-Time</option>'
                                +'<option value="Temporary">Temporary</option>'
                                +'</select></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Job Title:</span>'
                                +'</div><input type=text id=jobtitleInput value='+jobtitle+'></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Job Location:</span>'
                                +'</div><input type=text id=joblocationInput value="'+joblocation+'"></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Field Of Study:</span>'
                                +'</div><select style="width: 70%;" id=fieldofstudyInput>';
        //Generate the field of study options from the array initialized in postnewjob.js
        for(var i = 0; i<=fieldOfStudy.length; i++){
            if(i<fieldOfStudy.length){ //Keep adding all options until the end of array
                if(fieldOfStudy[i]==fieldofstudy)
                    htmlBody += "<option selected='selected'>"+fieldOfStudy[i]+"</option>";
                else
                    htmlBody += "<option>"+fieldOfStudy[i]+"</option>";
            }
            else //Close the SELECT tag
                htmlBody += '</select><div></form><hr><p style="color: red;font-size: 10px;">Job ID: '+doc.id+'</p>';
        }
        //Output the panel that shows the current job data
        Swal.fire({
            title: 'Edit myJobPosting', 
            html: htmlBody,
            showCancelButton: true,
            cancelButtonText: 'Close',
            showConfirmButton: true,
            confirmButtonText: 'Save',
            showCloseButton: true,
            allowOutsideClick: false
        }).then(function(result) {
            if (result.value) 
               updateJob(jobID); 
        });
    })
}

function updateJob(jobID){
    
    //Set the reference to the job's database
    var jobDatabase = firestoreDB.collection('myacadvisor-db').doc('myjobs-db').collection("jobs").doc(jobID);
    //Get the updated inputs from the user
    var jobtitle = $('#jobtitleInput').val();
    var joblocation = $('#joblocationInput').val();
    var jobtype = $('#jobtypeInput').val();
    var fieldofstudy  = $('#fieldofstudyInput').val();

    //Set the updated data to be stored
    var updateData = {
        jobtitle: jobtitle,
        joblocation: joblocation,
        jobtype: jobtype,
        fieldofstudy: fieldofstudy
    }
    //Update the data on the databse
    jobDatabase.update(updateData);

    //Refreshg the viewing panel of the job selected
    location.reload();
}

//Trigger new job post
function triggerPostNewJob(){
    $('#postjob').trigger('click');
}