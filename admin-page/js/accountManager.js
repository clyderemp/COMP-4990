//THIS FUNCTION IS FOR GETTING ALL THE INPUT
function createAccount(){

    var value = document.getElementById("user-drop").value;
    switch(value){
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

    if(fname!="" && lname!="" && email!="" && password!="" ){
        console.log(fname);
        //IF THE ACCOUNT TO BE CREATED IS A PARENT OR ADMIN
        if(value=="parent" || value =="admin"){
            createParentAdmin(fname, lname, value, email, password);
        }
        else
            proceedToCreate(fname, lname, idnum, school, value, email, password);
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
      firebase.firestore().collection(usertype).doc("post-secondary").collection(schoolDomain[0]).doc(username[0]).set(docData).then(function() {
          console.log("User has been successfully created!");
      });
}

//this function is solely for admin and parents
function createParentAdmin(fname, lname, usertype, email, password){
    firebase.auth().createUserWithEmailAndPassword(email, password).catch(function(error) {
        
      });
      
      var splitEmail = email.split("@");
      var domain = splitEmail[1].split(".");
      var docData = {
          fname: fname, lname: lname, email: email, level: usertype
      }
      firebase.firestore().collection(usertype).doc(domain[0]).collection(splitEmail[0]).doc("user").set(docData).then(function() {
          console.log("User has been successfully created!");
      });
}