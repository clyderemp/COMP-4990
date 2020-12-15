/**
 * THIS SCRIPT IS SPECIFICALLY FOR GATHERING DATA FROM DATABASE
 * FOR ADDING FACILITIES
 * REMOVING FACILITIES
 * UPDATING FACILITIES
 */


$(document).ready(function(){

    var database = firebase.database();

    firebase.auth().onAuthStateChanged(function(user) {
      var user = firebase.auth().currentUser;
      var emailPath = (user.email).split("@");
  
        if (user) {
            if(user!=null){


                database.ref("company-database/"+emailPath[0]+"/info/").once('value').then(function(snapshot) {
                    var current = parseInt(snapshot.val(). currentnum_facilities);
                    var max = parseInt(snapshot.val().maxnum_facilities);

                    if(current>=0 && max>=0){
                        try{
                            document.getElementById("facility-info").textContent += ": "+current+"/"+max;
                            database.ref("company-database/"+emailPath[0]+'/facilities/').once('value').then(function(snapshot) {
                                if (snapshot.val() !== null) {
                                    var table = Object.keys(snapshot.val());
                                    for(var i=0; i<table.length; i++){
                                        var html = '<option value="'+table[i]+'">'+table[i]+'</option>';
                                    $('#facilitydrop').append(html);console.log(html);
                                    }
                                     // ["answers", "blocks", "chats", "classes"]
                                }
                        });
                        }catch(err){}
                    }
                });
            }
        }
        else {
            window.location.href = "../login/login.html";
        }
    
    });
})


/**
 * DELETION OF FACILITIES
 */
function deleteSelection(){
    var confirmation = window.confirm("This deletion is permanent and cannot be recovered. Click OK to proceed.");
    if(confirmation==true){
        var database = firebase.database();
        var user = firebase.auth().currentUser;
        var emailPath = (user.email).split("@");

        var selection = document.getElementById("facilitydrop").value;

        if(selection!=""){
            document.getElementById("facilitydrop").style.backgroundColor =  "#50657b";
            document.getElementById("facilitydrop").style.color =  "#acc6de";

            var path = "company-database/"+emailPath[0]+"/facilities/"+selection;
            var path2 = "facility-database/"+selection;
            updateCurrent("company-database/"+emailPath[0]+"/info/");

            var deletionRef = database.ref(path);
                deletionRef.remove();
            var deletionRef = database.ref(path2);
                deletionRef.remove();
        }
        else{
            document.getElementById("facilitydrop").style.backgroundColor =  "red";
            document.getElementById("facilitydrop").style.color =  "white";
        }
    }
}

function updateCurrent(path){

    firebase.database().ref(path).once('value').then(function(snapshot) {
        var fname = snapshot.val().fname;
        var lname = snapshot.val().lname;
        var company = snapshot.val().company;
        var email = snapshot.val().email;
        var plan = snapshot.val().plan;

        var max = snapshot.val().maxnum_facilities;
        var current = parseInt(snapshot.val().currentnum_facilities)-1;

 // A post entry.
 var postData = {
    fname: fname, lname: lname, company: company, email: email, plan: plan,
    currentnum_facilities: current, maxnum_facilities: max
  };

  // Write the new post's data simultaneously in the posts list and the user's post list.
  var updates = {};
  updates[path] = postData;
  document.getElementById("deleteResult").textContent = "Deleting...Please wait...";
  window.location.reload();
  return firebase.database().ref().update(updates);
    });
}

function getUpdateData(selection, save){
    
    var user = firebase.auth().currentUser;
    var emailPath = (user.email).split("@");
    

    //THIS IS IF THE USER MADE ANY CHANGES
    if(save==true && selection == "save"){
        var facility = document.getElementById("facilitydrop").value;
            var path = "company-database/"+emailPath[0]+"/facilities/";
            var path2 = "facility-database/";
        console.log("SAVE");
        saveChanges(path, path2, facility);
    }
    //THIS IS JUST FOR GETTING THE DATA
    else{
        var path = "company-database/"+emailPath[0]+"/facilities/";
    try{

    console.log(path);

    firebase.database().ref(path+selection).once('value').then(function(snapshot) {
        //get all of the information from the database and show the user
        document.getElementById("facility").innerHTML = snapshot.val().name;
        document.getElementById("facilityname").value = snapshot.val().name;
        document.getElementById("address").value = snapshot.val().address;
        document.getElementById("phone").value = snapshot.val().phone_num;
        document.getElementById("max").value = snapshot.val().max_capacity;
        
    });
    }catch(err){}

    }
    document.getElementById("updatepanel").style.display = "block";
}

function saveChanges(path, path2, name){

    firebase.database().ref(path+name).once('value').then(function(snapshot) {

        //gather all of the new information
        var newname = document.getElementById("facilityname").value
        var addr = document.getElementById("address").value
        var num = document.getElementById("phone").value
        var cap = document.getElementById("max").value
        var current_counter = snapshot.val().current_people;

        if(newname!=snapshot.val().name || addr!=snapshot.val().address || num!=snapshot.val().phone_num || cap != snapshot.val().max_capacity ){

            //delete all the old information
            var deletionRef = firebase.database().ref(path+name);
                deletionRef.remove();

            var deletionRef = firebase.database().ref(path2+name);
                    deletionRef.remove();

            //this path is for the company database
            firebase.database().ref(path+newname).set({
                name: newname, address: addr, phone_num: num, max_capacity: cap, current_people: current_counter
                });
            //this path is for the facility databas which is accessed by the end-users
            firebase.database().ref(path2+newname).set({
                name: newname, address: addr, phone_num: num, max_capacity: cap, current_people: current_counter
                });
               window.location.reload();
        }
        else{
            alert("You have not made any changes");
        }
    });
}