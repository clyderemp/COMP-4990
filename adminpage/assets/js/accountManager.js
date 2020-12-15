//THIS FUNCTION IS FOR GETTING ALL THE INPUT
function createAccount(){

    var userdrop = document.getElementById("manager-drop").value;
    console.log(userdrop);
    switch(userdrop){
        case "student":
            var fname = document.getElementById("fname").value;
            var lname = document.getElementById("lname").value;
            var idnum = document.getElementById("studentId").value;
            var school = document.getElementById("school-drop").value;
            var email = document.getElementById("emailField").value;
            var password = document.getElementById("passwordField").value;
            break;
        case "parent":
            var fname = document.getElementById("fname").value;
            var lname = document.getElementById("lname").value;
            var email = document.getElementById("emailField").value;
            var password = document.getElementById("passwordField").value;
            break;
        case "staff":
            var fname = document.getElementById("fname").value;
            var lname = document.getElementById("lname").value;
            var idnum = document.getElementById("staffId").value;
            var school = document.getElementById("school-drop").value;
            var email = document.getElementById("emailField").value;
            var password = document.getElementById("passwordField").value;
            break;
        case "admin":
            var fname = document.getElementById("fname").value;
            var lname = document.getElementById("lname").value;
            var email = document.getElementById("emailField").value;
            var password = document.getElementById("passwordField").value;
            break;
        default:
            break;
    }

    if(fname!="" && lname!="" && email!="" && password!="" && /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email)){
        console.log(fname);
        //IF THE ACCOUNT TO BE CREATED IS A PARENT OR ADMIN
        if(userdrop=="parent" || userdrop =="admin"){
            createParentAdmin(fname, lname, userdrop, email, password);
        }
        else
            proceedToCreate(fname, lname, idnum, school, userdrop, email, password);
    }
    else{
        document.getElementById("error").style.textAlign = "center";
        document.getElementById("error").style.color = "red";
        document.getElementById("error").textContent = "*Please fill all fields*";
        
    }
}

//this function is solely for students and professor accounts
function proceedToCreate(fname, lname, idnum, school, usertype, email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {   
    });

        var username = email.split("@");
        var schoolDomain = username[1].split(".");
        var docData = {
            fname: fname, lname: lname, email: email, id_num: idnum, level: usertype, school: school
        }
       /** var firestorePath = firebase.firestore().collection('myacadvisor-db').doc('myaccount-db').collection(usertype).doc("post-secondary").collection(schoolDomain[0]).doc(username[0]);
            firestorePath.set(docData).then(function() {
                console.log("User has been successfully created!");
            })
            */
        var updateTotalUsersPath = firebase.firestore().collection('myacadvisor-db').doc('myaccount-db');
        
        updateTotalUsersPath.get().then(function(doc) {
            var updateTotalNumOfUsers = {totalUsers: (doc.data().totalUsers)+1}
            updateTotalUsersPath.set(updateTotalNumOfUsers).then(function() {});
                
                    firebase.auth().signInWithEmailAndPassword(adminUser, "123123").catch(function(error) {
                    })
                    location.reload();
        })
}

//this function is solely for admin and parents
function createParentAdmin(fname, lname, usertype, email, password){
    var adminUser = document.getElementById("adminloademail").textContent;
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        
      });
      
      var splitEmail = email.split("@");
      var domain = splitEmail[1].split(".");
      var docData = {
          fname: fname, lname: lname, email: email, level: usertype
      }
      var firestorePath = firebase.firestore().collection('myacadvisor-db').doc('myaccount-db').collection(usertype).doc(domain[0]).collection(splitEmail[0]).doc("user");
      firestorePath.set(docData).then(function() {
          window.alert("New user has been successfully created!");
          firebase.auth().signInWithEmailAndPassword(adminUser, "123123").catch(function(error) {
            
          })
          location.reload();
      });
}