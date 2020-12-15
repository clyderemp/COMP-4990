/**
 * THIS SCRIPT IS SPECIFICALLY FOR THE LIVE COUNTER PAGE
 * 
 * IT ADDS AND SUBTRACTS VALUE FROM THE COUNTER AND LIVE CASTS IT ON THE WEB
 * 
 */

 /**
  * RESET THE CANVAS EVERY TIME
  */
$(function (){
    var canvas = document.getElementById("myCanvas");
    var ctx = canvas.getContext("2d");
        ctx.font = "90px Arial";
    var num = 0;
    document.getElementById("counter").textContent = num;

    ctx.textAlign = "center";
    ctx.strokeStyle = "white";

    ctx.fillText(num, 150, 110);
    ctx.strokeText(num, 150, 110);
});


/**
 * GET THE VALUE FROM THE DROPDOWN SELECT
 * THEN RETRIEVE THE MAX AND CURRENT COUNTER FROM THE DATABASE
 */
function getCounter(facility){

    document.getElementById("livecounter-lowerpanel").style.display = "flex";

    var database = firebase.database();
    var user = firebase.auth().currentUser;
    var emailPath = (user.email).split("@");
    var path = "company-database/"+emailPath[0]+"/facilities/"+facility;

    database.ref(path).once('value').then(function(snapshot) {
        var counter = snapshot.val().current_people;    //GET THE CURRENT
        var capacity = snapshot.val().max_capacity;     //GET THE MAX

        if(counter>capacity){
            window.alert("YOU HAVE HIT YOUR MAX! Please control traffic");
        }
        else{

            if(counter==capacity){
                window.alert("YOU ARE AT YOU MAXIMUM CAPACITY. PLEASE SLOW DOWN.")
            }
            document.getElementById("counter").textContent = counter;
            document.getElementById("capacity").textContent = capacity;
        }
    });
}



/**
 * ADD TO THE COUNTER
 */
function add(){

    //PARSE THE CURRRENT AND MAX FROM THE DATABASE
    var num = parseInt(document.getElementById("counter").textContent);
    var max = parseInt(document.getElementById("capacity").textContent);
    
    //IF THE NUM HAS NOT REACHED THE MAX THEN ALWAYS REFRESH THE CANVAS
    if(num<max){
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        
        ctx.font = "90px Arial";
        num++; //INCREMENT BY ONE
        document.getElementById("counter").textContent = num;
        ctx.textAlign = "center";
        ctx.strokeStyle = "green";  //CHANGE THE COLOUR TO GREEN TO LET THE USER KNOW THE LAST ACTION THEY MADE
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.fillText(num, 150, 110);
        ctx.strokeText(num, 150, 110);

        sendToDatabase(num);    //SEND THE CHANGES TO THE DATABASE
    }
}
/**
 * SUBTRACT FROM THE COUNTER
 */
function remove(){
    
    var num = parseInt(document.getElementById("counter").textContent);

    //ONLY TAKE REAL NUMBERS GREATER THAN ZERO
    if(num>0){
        var canvas = document.getElementById("myCanvas");
        var ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        ctx.font = "90px Arial";
        
        num--;
        document.getElementById("counter").textContent = num;
        ctx.textAlign = "center";
        ctx.strokeStyle = "red";
        ctx.fillText(num, 150, 110);
        ctx.strokeText(num, 150, 110);

        sendToDatabase(num);
    }
}

/**
 * AFTER CHANGES, SEND ALL THE CHANGES TO THE DATABASE FOR THE END-USERS TO ACCESS
 */
function sendToDatabase(counter_val){

    var database = firebase.database();
    var user = firebase.auth().currentUser;
    var emailPath = (user.email).split("@");

    //PATH 1 IS FOR THE COMPANY DATABASE
    //PATH 2 IS FOR THE FACILITY DATABASE ACCESSED BY THE END USERS
    var path = "company-database/"+emailPath[0]+"/facilities/"+document.getElementById("facilitydrop").value;
    var path2 = "facility-database/"+document.getElementById("facilitydrop").value;

    //UPDATE THE COMPANY FACILITY DATA
    database.ref(path).once('value').then(function(snapshot) {
        var name = snapshot.val().name;
        var addr = snapshot.val().address;
        var num  = snapshot.val().phone_num;
        var max  = snapshot.val().max_capacity;
        var counter = counter_val;
        document.getElementById("counter").textContent = counter;

        firebase.database().ref(path).set({
            name: name, address: addr, phone_num: num, max_capacity: max, current_people: counter
        })
    })

    //UPDATE THE FACILITY DATA
    database.ref(path2).once('value').then(function(snapshot) {
        var name = snapshot.val().name;
        var addr = snapshot.val().address;
        var num  = snapshot.val().phone_num;
        var max  = snapshot.val().max_capacity;
        var counter = counter_val;
        document.getElementById("counter").textContent = counter;

        firebase.database().ref(path2).set({
            name: name, address: addr, phone_num: num, max_capacity: max, current_people: counter
        })
    })  
}