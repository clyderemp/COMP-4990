var errormsg = '';
var jobtitle = 'Engineering';
var joblocation = 'toronto, on, canada';
var email = '';
var idnum = '';
var employmenttype = '';
var phonenum = '';
var errormsg = '';
var errormsg2 = '';

var intelligenceList = ['Logic', 'Kinesthetic', 'Musical', 'Linguistic', 'Visual', 'Naturalistic', 'Interpersonal', 'Intrapersonal'];
var fieldOfStudy = ["Aeronautics and Aviation Science","Anthropology","Art","Business Administration","Chemistry","Computer Science","Communications and Media Film",
                "Economics", "Education","Engineering","Environmental Science and Health","Journalism and Mass Communication",
                "Music","Nursing","Oceanography","Pharmacy","Photography","Physical Therapy","Political Science and International Relations",
                "Psychology","Public Relations and Administration","Statistics","Urban Planning"];
    

//For filteration
var fieldStudyInput = '', strength1 = '', strength2 = '', strength3 = '';

//Function for initial input for the job posting
$("#postjob").click(function(){
    var companyname = ($("#company").text()).split(": ");
    var phone = ($("#phonenum").text()).split(": ");
    var company = companyname[1];
    (async () => {

		const { value: formValues } = await Swal.fire({
			title: 'Post a job today!',
			html:
				'<p style="color:red;">'+errormsg+'</p><hr>'+
                '<input value="'+jobtitle+'" placeholder="Job Title" id="swal-input1" class="swal2-input signupplaceholder" type="text">' +
                '<select class="swal2-input signupplaceholder" id="swal-input2">'+
                    '<option>Part-Time</option><option>Full-Time</option><option>Temporary</option></select>'+
				'<input value="'+joblocation+'" placeholder="Location (Format: City, State, Country)" id="swal-input3" class="swal2-input signupplaceholder" width="33%" type="text">' +
				'<input value="'+company+'" placeholder="Company Name" id="swal-input4" class="swal2-input signupplaceholder" type="text">' +
				'<input value="'+$("#email").text()+'" placeholder="Email" id="swal-input5" class="swal2-input signupplaceholder" type="email">' +
				'<input value="'+phone[1]+'" placeholder="Phone Number" id="swal-input6" class="swal2-input signupplaceholder" type="tel">'	+
				'<p>Click next to add applicant filters.</p>',
			focusConfirm: false,
			showConfirmButton: true,
			confirmButtonText: 'Next',
			showCloseButton: true,
			allowOutsideClick: true,
			preConfirm: () => {
				return [
				jobtitle = document.getElementById('swal-input1').value,
				employmenttype = document.getElementById('swal-input2').value,
				joblocation = document.getElementById('swal-input3').value,
				companyname = document.getElementById('swal-input4').value,
                email = document.getElementById('swal-input5').value,
				phonenum = document.getElementById('swal-input6').value
				]
			}
		});

		if (formValues) {
			var location = joblocation.split(",");
			if(jobtitle!='' && joblocation!='' && email!='' && companyname!='' && phonenum!='' && location.length==3 && joblocation.includes(",") && location[0]!='' && location[1]!='' && location[2]!=''){
                
                //To convert the location into capitalize first characters
                location[0] = location[0].charAt(0).toUpperCase() + location[0].slice(1);
                location[1] = location[1].toUpperCase();
                location[2] = (location[2].trim()).charAt(0).toUpperCase() + location[2].slice(1);
                joblocation = location.toString();

                var jobinfo = []; //To store all jon info into one array send to filter function
                jobinfo.push(jobtitle);
                jobinfo.push(employmenttype);
                jobinfo.push(joblocation);
                jobinfo.push(companyname);
                jobinfo.push(email);
                jobinfo.push(phonenum);

                confirmAfterFirstStep(jobinfo);
			}
			else{   //Detect any invalid entry
				errormsg = 'Invalid ';
				var list = [];
					if(jobtitle=='')
						list.push('Job Title');
					if(joblocation=='' || !joblocation.includes(",") || location.length!=3 || location[0]=='' || location[1]=='' || location[2]=='')
						list.push('Location');
					if(email=='')
                        list.push('Email');
                    if(companyname=='')
                        list.push('Company Name');
                    if(phonenum=='')
						list.push('Phone Number');

				for(var i=0; i<list.length; i++){
					if(i==list.length-2)
						var tempStr = list[i] + ' and ';
					else if(list.length!=1 && i<list.length-1)
						var tempStr = list[i] + ', ';
					else
						var tempStr = list[i];
					errormsg += tempStr;
                }
                $("#postjob").trigger('click');
				errormsg = '';
			}
		}
	
	})();
});

//funciton to confirm inputs from first step
function confirmAfterFirstStep(jobinfo){
    var sentence = "Based on what we've got so far, you are looking for a "+jobinfo[1]+" "+jobinfo[0]+" job to be filled in "+jobinfo[2]+" for "+
                    jobinfo[3]+".<br><br>";
    Swal.fire({
			title: "Tell us what you're looking for!",
			html:
				'<p style="color:red;">'+errormsg+'</p><hr>'+
                "<p style='text-align:justify;'>"+sentence+"</p>"	+
				'<p>Did we collect the correct data information? </p>',
			focusConfirm: false,
			showConfirmButton: true,
            confirmButtonText: 'Yes!',
            showCancelButton: true,
			cancelButtonText: 'Go Back',
			showCloseButton: true,
			allowOutsideClick: true,
		}).then((result) => {
            if(result.value){
                proceedToFilter(jobinfo);
            }
            else{
                
                $("#postjob").trigger('click');
            }
        });
}

//Function for filterating of field of study and intellectual strengths
function proceedToFilter(jobinfo){
    var optionArr1 = '', optionArr2 = '', optionArr3 = '', fieldArr = '';
    for(var i = 0; i<intelligenceList.length; i++){
        if(intelligenceList[i]==strength1)
            optionArr1 += "<option selected='selected'>"+intelligenceList[i]+"</option>";
        else if(intelligenceList[i]==strength2)
            optionArr2 += "<option selected='selected'>"+intelligenceList[i]+"</option>";
        else if(intelligenceList[i]==strength3)
            optionArr3 += "<option selected='selected'>"+intelligenceList[i]+"</option>";
        else{
            optionArr1 += "<option>"+intelligenceList[i]+"</option>";
            
            optionArr2 += "<option>"+intelligenceList[i]+"</option>";
            
            optionArr3 += "<option>"+intelligenceList[i]+"</option>";
        }
    }
    for(var i = 0; i<fieldOfStudy.length; i++){
        if(fieldOfStudy[i]==fieldStudyInput)
            fieldArr += "<option selected='selected'>"+fieldOfStudy[i]+"</option>";
        else
            fieldArr += "<option>"+fieldOfStudy[i]+"</option>";
    }
    (async () => {

		const { value: formValues } = await Swal.fire({
			title: 'Filter out applicants now!',
			html:
				'<p style="color:red;">'+errormsg+'</p><hr>'+
                '<br>Field of Study: <br><select class="swal2-input signupplaceholder" id="swal-input1">'+fieldArr+"</select>"+
                'Please choose your preferred top 3 intellectual strengths required for the job: <br>'+
                '<select class="swal2-input signupplaceholder" id="swal-input2">'+optionArr1+"</select>"+
                '<select class="swal2-input signupplaceholder" id="swal-input3">'+optionArr2+"</select>"+
                '<select class="swal2-input signupplaceholder" id="swal-input4">'+optionArr3+"</select>"+
				'<p>These information will be used to match your posting with better suited candidates. </p>',
			focusConfirm: false,
			showConfirmButton: true,
			confirmButtonText: 'Proceed',
			showCloseButton: true,
			allowOutsideClick: true,
			preConfirm: () => {
				return [
                    fieldStudyInput = document.getElementById('swal-input1').value,
                    strength1 = document.getElementById('swal-input2').value,
                    strength2 = document.getElementById('swal-input3').value,
                    strength3 = document.getElementById('swal-input4').value,
				]
			}
		});

		if (formValues) {
			if(strength1!=strength2 && strength1 != strength3 && strength2 != strength3){
                
                var filterinfo = []; //To store all jon info into one array send to filter function
                filterinfo.push(fieldStudyInput);
                filterinfo.push(strength1);
                filterinfo.push(strength2);
                filterinfo.push(strength3);
                 console.log(filterinfo, jobinfo);
                postJob(filterinfo, jobinfo);
			}
			else{   //Detect any invalid entry
				errormsg = 'Invalid strengths chosen. Please try again!';
                proceedToFilter(jobinfo);
				errormsg = '';
			}
		}
	
	})();
}

//finalized everything the posting is submitted
function postJob(filterinfo, jobinfo){
    var jobtitle = jobinfo[0];
    var jobtype = jobinfo[1];
    var joblocation = jobinfo[2];
    var companyname = jobinfo[3];
    var companyemail = jobinfo[4];
    var companynumber = jobinfo[5];
    var fieldOfStudy = filterinfo[0];
    var strength1 = filterinfo[1];
    var strength2 = filterinfo[2];
    var strength3 = filterinfo[3];
    
    var dateposted = returnCurrentDateandTime();

    var docData = {
        companyUID: uid,
        jobtitle: jobtitle,
        jobtype: jobtype,
        joblocation: joblocation,
        companyname: companyname,
        companyemail: companyemail,
        companynumber: companynumber,
        fieldofstudy: fieldOfStudy,
        strength1: strength1,
        strength2:strength2,
        strength3: strength3,
        dateposted: dateposted,
        numOfApplicants: 0,
        applicantsID: []
    }

    var tokenID = generateTokenID();

    var firestorePath = firestoreDB.collection('myacadvisor-db').doc('myjobs-db').collection("jobs").doc(tokenID);  //Set the path for job posting on the database

    firestorePath.set(docData).then(function() {
        console.log("Job has been posted!");
        location.reload();
    });
    var firestorePath = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection("employer").doc(uid).collection("notifications");  //Set the path for job posting on the database
    var notification = {
        message: "Job posting for "+jobtitle+" has been posted!", type: "jobposting", dateposted: dateposted
    }
    firestorePath.doc(tokenID).set(notification).then(function() {
    });
}

function returnCurrentDateandTime(){
    var today = new Date();
    var date = (today.getMonth()+1)+'-'+today.getDate()+'-'+today.getFullYear();
    var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    var dateTime = date+' '+time;

    return dateTime;
}

//Function generates a random token ID
function generateTokenID(){
    var rand = function() {
        return Math.random().toString(36).substr(2); //Generate a random token ID
    };
    
    var token = function() {
        return rand() + rand(); //To make the token longer
    };
    var tokenID = token();  //assigned token id to a variable

    return tokenID;
}