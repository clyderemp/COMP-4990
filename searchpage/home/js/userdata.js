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
      
  
        if (user) {
            if(user!=null){
                var emailPath = (user.email).split("@");
                console.log(user.email);


                database.ref("company-database/"+emailPath[0]+"/info/").once('value').then(function(snapshot) {
                    var username = (snapshot.val() && snapshot.val().fname) || 'Anonymous';
                    var plan = snapshot.val().plan;
                    var current = parseInt(snapshot.val(). currentnum_facilities);
                    var max = parseInt(snapshot.val().maxnum_facilities);

                    if(current>=0 && max>=0){
                        try{
                            document.getElementById("facility-info").textContent += ": "+current+"/"+max;
                        }catch(err){}
                    }
                    
                    try{
                    document.getElementById("user-fname").innerHTML = 'Welcome back, <b>'+username+'</b>';
                    document.getElementById("plan").innerHTML = "Current Plan: "+plan;
                    
                    database.ref("company-database/"+emailPath[0]+'/facilities/').once('value').then(function(snapshot) {
                        if (snapshot.val() !== null) {
                            var table = Object.keys(snapshot.val());
                            for(var i=0; i<table.length; i++){
                                var html = "<option>"+table[i]+"</option>";
                                $('#facilitydrop').append(html);console.log(table[i]);
                            }           // ["answers", "blocks", "chats", "classes"]
                        }
                    });



                    }
                    catch(err){} 
                });
            }
        }
        else {
            window.location.href = "../login/login.html";
        }
    });
})
function logout(){
    firebase.auth().signOut().then(function() {
        // Sign-out successful.
      }).catch(function(error) {
        // An error happened.
      });
}



/**
* THIS IS FOR THE USERS ADDING FACILITIES UNDER THEIR COMPANY
*/

function addFacility(){
    var user = firebase.auth().currentUser;
    var emailPath = (user.email).split("@");

    var facilityname = document.getElementById("facilityname").value;
    var address = document.getElementById("address").value;
    var phone = document.getElementById("phone").value;
    var max = document.getElementById("max").value;

    //CHANGE COLOR OF THE MISSING INPUTS
    if(facilityname==""){document.getElementById("facilityname").style.backgroundColor = "red";console.log("MISSING FACILITY NAME");}
    if(address==""){document.getElementById("address").style.backgroundColor = "red";console.log("MISSING ADDRESS");}
    if(phone==""){document.getElementById("phone").style.backgroundColor = "red";console.log("MISSING PHONE NUMBER");}
    if(max=="" || max<=0){document.getElementById("max").style.backgroundColor = "red";console.log("MISSING MAX");}

    if(facilityname != "" && address!="" && phone != "" && max !="" && parseInt(max)>0){
        var path = "company-database/"+emailPath[0]+"/info/";

        firebase.database().ref(path).once('value').then(function(snapshot) {
            var fname = snapshot.val().fname;
            var lname = snapshot.val().lname;
            var company = snapshot.val().company;
            var email = snapshot.val().email;
            var plan = snapshot.val().plan;

            var max_facilities = snapshot.val().maxnum_facilities;
            var current = snapshot.val().currentnum_facilities;
            current++;

            if(current<=max_facilities){

                firebase.database().ref("company-database/"+emailPath[0]+"/facilities/"+facilityname).once("value",snapshot => {
                    if (snapshot.exists()){
                        window.alert("Your input already exists! Please try again");
                    }
                    else{
                        updateAccount(fname, lname, company, email, plan, current, max_facilities, path);

                        firebase.database().ref("company-database/"+emailPath[0]+"/facilities/"+facilityname).set({
                            name: facilityname, address: address, phone_num: phone, max_capacity: max, current_people: 0
                        });

                        firebase.database().ref("facility-database/"+facilityname).set({
                                name: facilityname, address: address, phone_num: phone, max_capacity: max, current_people: 0
                        });
                    }
                });

                
            }
            else{
                window.alert("YOU HAVE MET YOUR MAXIMUM FACILITY ADDITIONS.")
            }
        });
    }
}

function updateAccount(fname, lname, company, email, plan, current, max, path) {
    // A post entry.
    var postData = {
      fname: fname, lname: lname, company: company, email: email, plan: plan,
      currentnum_facilities: current, maxnum_facilities: max
    };
  
    // Write the new post's data simultaneously in the posts list and the user's post list.
    var updates = {};
    updates[path] = postData;
  
    return firebase.database().ref().update(updates);
}