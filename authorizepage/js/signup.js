var fname = '';
var lname = '';
var email = '';
var pass = '';
var repeatpass = '';
var schoolname = '';
var idnum = '';
var usertype = '';
var phonenum = '';
var companyname = '';
var errormsg = '';
var errormsg2 = '';
var loggingAs = loggingAs;
$('#signup-button').click(function(){
	usertype = loggingAs;
	console.log("Sign up: "+loggingAs);
	switch(loggingAs){
		case 'student':
			signupfirst(); break;
		case 'employer':
			employersignup(); break;
		case 'educator':
			signupfirst(); break;
		default:
			signupfirst(); break;
	}
});

function signupfirst(){
  	(async () => {

		const { value: formValues } = await Swal.fire({
			title: 'Create your myAccount',
			html:
				'<p style="color:red;">'+errormsg+'</p><hr>'+
				'<input value="'+fname+'" placeholder="First name" id="swal-input1" class="swal2-input signupplaceholder" type="text">' +
				'<input value="'+lname+'" placeholder="Last name" id="swal-input2" class="swal2-input signupplaceholder" type="text">' +
				'<input value="'+email+'" placeholder="Email" id="swal-input3" class="swal2-input signupplaceholder" type="email">' +
				'<input value="'+pass+'" placeholder="Password" id="swal-input4" class="swal2-input signupplaceholder" type="password">' +
				'<input value="'+repeatpass+'" placeholder="Repeat Password" id="swal-input5" class="swal2-input signupplaceholder" type="password">'	+
				'<p>By creating an account you agree to our <a href="#" style="color:dodgerblue">Terms & Privacy</a>.</p>',
			focusConfirm: false,
			showConfirmButton: true,
			confirmButtonText: 'Next',
			showCloseButton: true,
			allowOutsideClick: true,
			preConfirm: () => {
				return [
				fname = document.getElementById('swal-input1').value,
				lname = document.getElementById('swal-input2').value,
				email = document.getElementById('swal-input3').value,
				pass = document.getElementById('swal-input4').value,
				repeatpass = document.getElementById('swal-input5').value
				]
			}
		})
		console.log(schoolname);

		if (formValues) {
			//Swal.fire(JSON.stringify(formValues));
			if(fname!='' && lname!='' && email!='' && pass!='' && repeatpass!='' && pass==repeatpass && pass.length >= 6){
				signupnext();
			}
			else{
				errormsg = 'Invalid ';
				var list = [];
					if(fname=='')
						list.push('First Name');
					if(lname=='')
						list.push('Last Name');
					if(email=='')
						list.push('Email');
					if(pass=='' && repeatpass=='')
						list.push('Password');
					else if(pass.length < 6)
						list.push('Password length');
					if(pass!=repeatpass)
						list.push('Password match')

				for(var i=0; i<list.length; i++){
					if(i==list.length-2)
						var tempStr = list[i] + ' and ';
					else if(list.length!=1 && i<list.length-1)
						var tempStr = list[i] + ', ';
					else
						var tempStr = list[i];
					errormsg += tempStr;
				}
				signupfirst();
				errormsg = '';
			}
		}
	
	})();
}

function signupnext(){
	var refPath = realtimeDB.ref('/');
	var schools = [];
	//document.getElementById('school').value = 'University of Windsor';

	refPath.once('value').then(function(snapshot) {

        if (snapshot.exists()){
			snapshot.forEach(function(childSnapshot) {
				schools.push(childSnapshot.key);
			})

			var schoolDropDown = '<option value="none">Select the school</option>';

			for(var i=0; i<schools.length; i++){
				if(schools[i]==schoolname)
				var optionStr = '<option value="'+schools[i]+'" id="'+schools[i]+'" selected>'+schools[i]+'</option>';
				else
				var optionStr = '<option value="'+schools[i]+'" id="'+schools[i]+'">'+schools[i]+'</option>';
				schoolDropDown+=optionStr;
				//console.log(schools[i]);
			}
			
			var htmlbody = '<div>'
				+'<form class="signup-form">'
					+'<p style="color:red;">'+errormsg2+'</p><hr>'
					+'<label for="school" id="schoollabel"><b>Select your current school</b></label>'
					+'<select id="school">'+schoolDropDown+'</select>'
					+'<label for="id"><b>Student number</b></label>'
					+'<input type="number" id="idnum" value="'+idnum+'">'
				+'</form>'
				+'<button class="backbutton" onclick=signupfirst() >Go Back</button>'
			+'</div>';
			
			(async () => {

				const { value: formValues } = await Swal.fire({
					title: 'Choose your institution',
					html: htmlbody,
					focusConfirm: false,
					showCancelButton: true,
					cancelButtonText: 'Cancel',
					showConfirmButton: true,
					confirmButtonText: 'Save and Proceed',
					allowOutsideClick: true,
					preConfirm: () => {
						return [
							schoolname = document.getElementById('school').value,
							idnum = document.getElementById('idnum').value
						]
					}
				})
				
				if (formValues) {
					//Swal.fire(JSON.stringify(formValues));
					if(schoolname!='none' && idnum!=''){
						signup();
					}
					else{
						errormsg2 = 'Invalid ';
						var list = [];
							if(schoolname=='none')
								list.push('Institution');
							if(idnum=='')
								list.push('Student ID');
		
						for(var i=0; i<list.length; i++){
							if(i < list.length-1)
								var tempStr = list[i] + ' and ';
							else
								var tempStr = list[i]; + ' ';

							errormsg2 += tempStr;
						}
						signupnext();
					}
				}

			})();
		}
	});
};

function signup(){
    userAuth.createUserWithEmailAndPassword(email, pass).catch(function(error) {
		Swal.fire({
			title: "We're sorry! There's an error.",
			html:'<hr><p style="color:red;">'+error+' Please try again!</p>',
			focusClose: false,
			showConfirmButton: true,
			confirmButtonText: 'Try Again',
			showCloseButton: true,
			allowOutsideClick: true
		}).then(function(){
			$('#signup-button').trigger('click');
		});
  
	}).then(function(){
		
		userAuth.onAuthStateChanged(firebaseUser =>{
			
			var uid = firebaseUser.uid;

			fname = fname.substring(0, 1).toUpperCase() + fname.substring(1, fname.length).toLowerCase();
			lname = lname.substring(0, 1).toUpperCase() + lname.substring(1, lname.length).toLowerCase();
			
			//Creates the user data in the database
			switch(usertype){

				case 'student':
					var docData = {
						fname: fname, lname: lname, email: email, id_num: idnum, level: usertype, school: schoolname, uid: uid
					}
					var firestorePath = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection(usertype).doc("post-secondary").collection(uid);
					break;

				case 'employer':
					var docData = {
						fname: fname, lname: lname, email: email, phonenum: phonenum, level: usertype, companyname: companyname, uid: uid
					}
					var firestorePath = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection(usertype).doc(uid).collection("employerData");
					break;

				case 'educator':
					signupfirst();
					break;
				//default is student
				default:
					var docData = {
						fname: fname, lname: lname, email: email, id_num: idnum, level: usertype, school: schoolname, uid: uid
					}
					var firestorePath = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection(usertype).doc("post-secondary").collection(uid);
					break;
			}
			
			
				
				firestorePath.doc('userData').set(docData).then(function() {
					console.log("User has been successfully created!");
				});
				
			var today = new Date();
			var date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();

				firestorePath.doc('creationDate').set({
					createdOn: date
				});
			
			var updateTotalUsersPath = firestoreDB.collection('myacadvisor-db').doc('myaccount-db');
			
			updateTotalUsersPath.get().then(function(doc) {
				var updateTotalNumOfUsers = {totalUsers: (doc.data().totalUsers)+1}
				updateTotalUsersPath.set(updateTotalNumOfUsers).then(function() {});
			})
		});
				
	});
}

//Function that handles the employer sign up
function employersignup(){
	(async () => {

	  const { value: formValues } = await Swal.fire({
		  title: 'Create your myEmployerAccount',
		  html:
			  '<p style="color:red;">'+errormsg+'</p><hr>'+
			  '<input value="'+fname+'" placeholder="First name" id="swal-input1" class="swal2-input signupplaceholder" type="text">' +
			  '<input value="'+lname+'" placeholder="Last name" id="swal-input2" class="swal2-input signupplaceholder" type="text">' +
			  '<input value="'+phonenum+'" placeholder="Phone Number" id="swal-input3" class="swal2-input signupplaceholder" type="tel">' +
			  '<input value="'+companyname+'" placeholder="Company Name" id="swal-input4" class="swal2-input signupplaceholder" type="text">' +
			  '<input value="'+email+'" placeholder="Email" id="swal-input5" class="swal2-input signupplaceholder" type="email">' +
			  '<input value="'+pass+'" placeholder="Password" id="swal-input6" class="swal2-input signupplaceholder" type="password">' +
			  '<input value="'+repeatpass+'" placeholder="Repeat Password" id="swal-input7" class="swal2-input signupplaceholder" type="password">'	+
			  '<p>By creating an account you agree to our <a href="#" style="color:dodgerblue">Terms & Privacy</a>.</p>',
		  focusClose: false,
		  showConfirmButton: true,
		  confirmButtonText: 'Sign up',
		  showCloseButton: true,
		  allowOutsideClick: true,
		  preConfirm: () => {
			  return [
			  fname = document.getElementById('swal-input1').value,
			  lname = document.getElementById('swal-input2').value,
			  phonenum = document.getElementById('swal-input3').value,
			  companyname = document.getElementById('swal-input4').value,
			  email = document.getElementById('swal-input5').value,
			  pass = document.getElementById('swal-input6').value,
			  repeatpass = document.getElementById('swal-input7').value
			  ]
		  }
	  })

	  if (formValues) {
		  //Swal.fire(JSON.stringify(formValues));
		  if(fname!='' && lname!='' && phonenum!='' && companyname!='' && email!='' && pass!='' && repeatpass!='' && pass==repeatpass  && pass.length >= 6){
			signup();
		  }
		  else{
			  errormsg = 'Invalid ';
			  var list = [];
				  	if(fname=='')
					  list.push('First Name');
				  	if(lname=='')
					  list.push('Last Name');
					if(phonenum=='')
					  list.push('Phone Number');
					if(companyname=='')
					  list.push('Company Name');
				  	if(email=='')
					  list.push('Email');
				  	if(pass=='' && repeatpass=='')
					  list.push('Password');
					  else if(pass.length < 6)
					  	list.push('Password length');
				  	if(pass!=repeatpass)
					  list.push('Password match')

			  for(var i=0; i<list.length; i++){
				  if(i==list.length-2)
					  var tempStr = list[i] + ' and ';
				  else if(list.length!=1 && i<list.length-1)
					  var tempStr = list[i] + ', ';
				  else
					  var tempStr = list[i];
				  errormsg += tempStr;
			  }
			  employersignup();
			  errormsg = '';
		  }
	  }
  
  })();
}