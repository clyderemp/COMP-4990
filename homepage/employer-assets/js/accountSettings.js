$('#accountSettingsBtn').click(function(){
    var errormsg = '', successmsg = '';
    var userData = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection("employer").doc(uid).collection("employerData").doc('userData');
			             
    userData.get().then(function(doc) { //Gets the document reference and checks for the document
            
        if (doc.exists || !doc.exists){
            try{
                var fname = doc.data().fname;
                var lname = doc.data().lname;
                var companyname = doc.data().companyname;
                var email = doc.data().email;
                var phonenum = doc.data().phonenum;
                var uid = doc.data().uid;
            }catch(err){}

            var htmlBody = '<form style="text-align: center;padding-left: 5%;" class="form-group">'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">UID:</span>'
                                +'</div><h5 style="padding-top: 8px;">&nbsp&nbsp '+uid+'</h5></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Company Name:</span>'
                                +'</div><input type=text id=companyInput></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">First Name:</span>'
                                +'</div><input type=text id=fnameInput></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Last Name:</span>'
                                +'</div><input type=text id=lnameInput></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Email Address:</span>'
                                +'</div><input type=text id=emailInput></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Phone Number:</span>'
                                +'</div><input type=text id=phoneInput></div>'
                            +'<div class="input-group"><div class="input-group-prepend"><span class="input-group-text">Password:</span>'
                                +'</div><input type=password id=passwordInput></div>'
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
                    saveChanges(userData, email); 
            });

            $('#fnameInput').val(fname);
            $('#lnameInput').val(lname);
            $('#emailInput').val(email);
            $('#phoneInput').val(phonenum);
            $('#companyInput').val(companyname);
        }
    });
});



function saveChanges(userData, prevEmail){
    var fname = $('#fnameInput').val();
    var lname = $('#lnameInput').val();
    var email = $('#emailInput').val();
    var phonenum = $('#phoneInput').val();
    var companyname = $('#companyInput').val();
    var pass = $('#passwordInput').val();
    var user  = userAuth.currentUser;
    var updateData = {
        fname: fname,
        lname: lname,
        email: email,
        phonenum: phonenum,
        companyname: companyname
    }
    //Update the email for the user
    if(email != prevEmail)
        user.updateEmail(email);
    if(pass!=null || pass!='')
        user.updatePassword(pass);
    //Update the userdata
    userData.update(updateData).then(function(){
        location.reload();
    }).catch(function(err){
        alert(err);
    });
}