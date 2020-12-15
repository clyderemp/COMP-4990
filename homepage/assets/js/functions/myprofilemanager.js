var errormsg = '';
var successmsg = '';
var pass1 = '';
var pass2 = '';

function viewProfile(){
    console.log('load');
    load("#mainpage","../myProfile-assets/html/myprofile-test.html");    
}

function reauthorize(){
    var user  = userAuth.currentUser;
    var htmlBody = '<form style="text-align:center; padding-left: 20px;" class="form-group">'
                +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Please enter your password: </span>'
                    +'</div><input type=password id=password placeholder="'+errormsg+'" style="width:45%;"></div>'
                +'</form>';
    Swal.fire({
        title: 'Re-Authorization Needed', 
        html: htmlBody,
        showConfirmButton: true,
        confirmButtonText: 'Proceed',
        showCloseButton: true,
        allowOutsideClick: false
    }).then(function(result) {
        if (result.value){
            userAuth.signInWithEmailAndPassword(user.email, $('#password').val()).then(function(user) {

                accountSettings();

            }).catch(function(error){
                //console.log(error);
                errormsg = 'Invalid password!';
                reauthorize();
            });
        }
    });
};


function accountSettings(){
    errormsg = '';

    var userData = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection('student').doc('post-secondary').collection(uid).doc('userData'); //Sets the doc reference
                               
    userData.get().then(function(doc) { //Gets the document reference and checks for the document
            
        if (doc.exists){

                var fname = doc.data().fname;
                var lname = doc.data().lname;
                var email = doc.data().email;
                var idnum = doc.data().id_num;
                var oen = doc.data().oen;
            

            var htmlBody = '<form style="text-align: center;padding-left: 15%;" class="form-group">'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Student number:</span>'
                                +'</div><h5 style="padding-top: 8px;">&nbsp&nbsp'+idnum+'</h5></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Government Student Number:</span>'
                                +'</div><h5 style="padding-top: 8px;">&nbsp&nbsp'+oen+'</h5></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">First Name:</span>'
                                +'</div><input type=text id=fnameInput></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Last Name:</span>'
                                +'</div><input type=text id=lnameInput></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Email Address:</span>'
                                +'</div><input type=text id=emailInput></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Password</span>'
                                +'</div><button class="btn-md btn-secondary btn-border btn-round mr-2" onclick=changepass()>Update password</button></div>'
                            +'</form><hr><p style="color: green;">'+successmsg+'</p>';
            Swal.fire({
                        title: 'Account Settings', 
                        html: htmlBody,
                        showCancelButton: true,
                        cancelButtonText: 'Close',
                        showConfirmButton: true,
                        confirmButtonText: 'Save',
                        showCloseButton: true,
                        allowOutsideClick: false
            }).then(function(result) {
                if (result.value) 
                   saveButton(userData); 
            });

            $('#fnameInput').val(fname);
            $('#lnameInput').val(lname);
            $('#emailInput').val(email);
        }
    });
}

function saveButton(docRef){

    var fname = $('#fnameInput').val();
    var lname = $('#lnameInput').val();
    var email = $('#emailInput').val();

    var userData = {
        fname: fname,
        lname: lname,
        email: email
    };
    
    //Update the email for the user
    userAuth.currentUser.updateEmail(email).then(function(){
        //Update the userdata
        docRef.update(userData).then(function(){
            location.reload();
        }).catch(function(err){
            docRef.set(userData)
        });
        
    }).catch(function(error) {
        alert(error);
    });
};
function changepass(){
        var htmlBody = '<p style="color: red;">'+errormsg+'</p><hr>'
        +'<form style="text-align: center;padding-left: 15%;" class="form-group">'
        +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">New password:</span>'
            +'</div><input type=password id=pass1 value="'+pass1+'"></div>'
        +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Repeat password:</span>'
            +'</div><input type=password id=pass2 value="'+pass2+'"></div>'
        +'</form>';
    Swal.fire({
    title: 'Change password', 
    html: htmlBody,
    showCancelButton: true,
    cancelButtonText: 'Cancel',
    showConfirmButton: true,
    confirmButtonText: 'Update',
    allowOutsideClick: false
    }).then(function(result) {
        if (result.value){
            pass1 = $('#pass1').val();
            pass2 = $('#pass2').val();
            if(pass1 == pass2  && pass1.length>=6 && pass2.length>=6){
                
                userAuth.currentUser.updatePassword(pass1).catch(function(error) {
                    alert(error);
                });
                successmsg = 'Password successfully changed!';
                accountSettings();

                var placementFrom = "top";
                var placementAlign = "center";
                var state = "success";
                var content = {};
            
                    content.message = 'Password successfully updated.';
                    content.title = 'Notification from Account Settings';
                    content.icon = 'fas fa-wrench';
                    content.target = '_blank';
            
                    $.notify(content,{
                        type: state,
                        placement: {
                            from: placementFrom,
                            align: placementAlign
                        },
                        time: 2000, //opens after 1 second
                        delay: 10000 //closes after 2 seconds
                });
            }
            else{
                if(pass1!=pass2)
                    errormsg = 'Passwords dont match!';
                if(pass1.length<6 || pass2.length<6)
                    errormsg = 'Password contains less than 6 characters!';
                changepass();
            }
        }
        else
            accountSettings();
    });
}
