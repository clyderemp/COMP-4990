/**
 *  THIS SCRIPT IS WRITTEN FOR THE INFO LOADING OF THE USER BASED ON THE TRANSCRIPT THEY UPLOADED 
 * 
 * 
 *  AUTHOR: CLYDE REMPILLO
 */


$(function(){

    firebase.auth().onAuthStateChanged(function(user) {
        var user = firebase.auth().currentUser;
        var db = firebase.firestore();
        var storage = firebase.storage();
        var storageRef = storage.ref();
  
      if (user) {
       // User is signed in.
        if(user!=null){
          var splitEmail = user.email.split("@"); //Splits the email into 2 strings
          var splitSchoolDomain = splitEmail[1].split("."); //Splits the email into 2 strings by the period
          var username = splitEmail[0]; //takes the username from the initial split email array
          var school = splitSchoolDomain[0];  //takes the schoolname from the splitter array
      
          var docRef = db.collection("student").doc("post-secondary").collection(school).doc(username); //Sets the doc reference
               
          docRef.get().then(function(doc) { //Gets the document reference and checks for the document
                
            if (doc.exists){
                var level = doc.data().level;
                var id = doc.data().id_num;
                var path ="/"+level+"/"+school+"/"+id+"/transcript";

                var fileRef = storageRef.child(path);

                // Get the download URL
                fileRef.getDownloadURL().then(function(url) {

                    
                    // read text from URL location
                    var request = new XMLHttpRequest();
                    request.open('GET', url, true);
                    request.send(null);

                    request.onreadystatechange = function () {
                        if (request.readyState === 4 && request.status === 200) {

                            //GET THE CONTENT FOR THE TEXT FILE
                            var type = request.getResponseHeader('Content-Type');

                            if (type.indexOf("text") !== 1) {
                                var data = request.responseText;

                                var key = document.getElementById("idnum").textContent;
                                var a = key.split(": ");
                                try{
                                
                                /**
                                 * DECRYPT THE TEXT FILE FROM FIRBASE
                                 */
                                var decrypted = (CryptoJS.AES.decrypt(data, a[1]));
                                var file = decrypted.toString(CryptoJS.enc.Utf8);
                                var fullinfo = file.split('\n');
                                getOEN(fullinfo);
                                getCumulativeAverage(fullinfo,username, school);
                                getMajorAverage(fullinfo,username, school);
                                getBachelors(fullinfo,username, school);
                                getAnyMinor(fullinfo, username, school);
                                getTotalCredits(fullinfo,username, school);
                                getSemester(fullinfo, username, school);

                                }catch(err){
                                    console.log("Error in $function in loader.js");
                                    console.log(err);
                                }
                            }
                        }
                    }   
                }).catch(function(error) {
                    window.alert("Welcome to MyAcAdvisor! It seems that you haven't uploaded a transcript yet! Make sure to upload one to maximize the benefits of our services!");
                    window.location.href = "../pdf/parser/index.html";
                });
            }

            }).catch(function(error) { //Catch any retrieval error
                console.log("Error in $function in loader.js");
                console.log("Error getting document:", error);
            });
        }
      }
    });
  })


function getOEN(fullinfo){
    for(var i=0; i<fullinfo.length; i++){

        if(fullinfo[i].includes("OEN")){
            var oen_num = fullinfo[i].toString();   //THIS TURNS OEN STRING
            var oen = oen_num.split(":");   //SPLITS OEN: 123345 into 2 halves
        }
    }
    document.getElementById("oen").textContent += oen[1];
}

/**
 * GET THE CUMULATIVE AVERAGE DATA FROM TEH TRANSCRIPT
 * 
 */
function getCumulativeAverage(fullinfo,username, school){

    var cumulativeAverage = fullinfo[fullinfo.length-1].split("."); //SPLIT THE LATEST LINE OF CUMULATIVE UPDATE
    var decimal = "."+cumulativeAverage[1];                         //TAKES THE DECIMAL VALUE OF YOUR AVERAGE
    var getPercent = cumulativeAverage[0].split("Average");
    var parsed = parseFloat(getPercent[1]+decimal);
       
    gradeIndicator(parsed, "cumulative");
    document.getElementById("cumulative").textContent = getPercent[1]+decimal+" %";

    var docData = { cumulativeAve: parsed }
    firebase.firestore().collection("student").doc("post-secondary").collection(school).doc(username).update(docData).then(function() {
        console.log("Cumulative Average Successfully Saved!");
    });
}

/**
 * GET THE MAJOR AAVERAGE FROM TRANSCRIPT
 */
function getMajorAverage(fullinfo,username, school){
    
    for(var i=0; i<fullinfo.length; i++){

        if(fullinfo[i].includes("Major") && !fullinfo[i].includes("0.000")){
            var majorAve = fullinfo[i].toString();
            var getPercent = majorAve.split(":");
            var parsed = parseFloat(getPercent[1]);
        }
    }
    gradeIndicator(parsed, "major");
    document.getElementById("major").textContent += getPercent[1]+" %";

    var docData = { majorAve: parsed }
    firebase.firestore().collection("student").doc("post-secondary").collection(school).doc(username).update(docData).then(function() {
        console.log("Major Average Successfully Saved!");
    });
}

/**
 * GET BACHELORS DEGREE VALUE
 */
function getBachelors(fullinfo,username, school){
    var major = "</p><p>No degree stated on transcript";
    
    for(var i=0; i<fullinfo.length; i++){
        
        if(fullinfo[i].includes("Bachelor")){
            major = "</p><p>"+fullinfo[i].toString();
            var docData = { major: fullinfo[i] }
        }
    }
    
    document.getElementById("addinfo").innerHTML += major;

    firebase.firestore().collection("student").doc("post-secondary").collection(school).doc(username).update(docData).then(function() {
        console.log("Data about Major Successfully Saved!");
    });
}

/**
 * GET MINOR INFO
 */
function getAnyMinor(fullinfo, username, school){
    var minor = "</p><p>MINOR: None";
    var docData = { minor: "NONE" }
    
    for(var i=0; i<fullinfo.length; i++){
     
        if(fullinfo[i].includes("Minor")){
            minor = "</p><p>"+fullinfo[i].toString();
            var docData = { minor: fullinfo[i].toString() }
        }
    } 
    document.getElementById("addinfo").innerHTML += minor;


    firebase.firestore().collection("student").doc("post-secondary").collection(school).doc(username).update(docData).then(function() {
        console.log("Data about Minor Successfully Saved!");
    });
}

/**
 * GET TOTAL CREDITS ACCCUMULATED
 */
function getTotalCredits(fullinfo, username, school){

    var line = fullinfo[fullinfo.length-1].split("."); //SPLIT THE LATEST LINE OF CUMULATIVE UPDATE
    var totalCredits = parseInt(line[2]);
       
    document.getElementById("credits").innerHTML += "Total Credits Earned: "+totalCredits;

    var docData = { totalCredits: totalCredits, totalCourses: (totalCredits/3)}

    firebase.firestore().collection("student").doc("post-secondary").collection(school).doc(username).update(docData).then(function() {
        console.log("Total Credits Data Successfully Saved!");
    });
}

function gradeIndicator(average, type){
    switch(type){
        case "major":
            if(average>70){
                document.getElementById("major").style.color = "green";
            }
            else if(average>50 && average<70){
                document.getElementById("major").style.color = "orange";
            }
            else if(average<50){
                document.getElementById("major").style.color = "red";
            }
            break;
        case "cumulative":
            if(average>70){
                document.getElementById("cumulative").style.color = "green";
            }
            else if(average>50 && average<70){
                document.getElementById("cumulative").style.color = "orange";
            }
            else if(average<50){
                document.getElementById("cumulative").style.color = "red";
            }
            break;

    }
}

function getSemester(fullinfo, username, school){
    var newfiltered = [""];
    var semList = [];
    
    for(var i=0; i<fullinfo.length; ++i){
        var line = fullinfo[i].toString();
        newfiltered.push(line);
            
        if( fullinfo[i].includes("OEN") || fullinfo[i].includes("Bachelor") 
            || fullinfo[i]=="" || fullinfo[i].includes("Repeated") || fullinfo[i].includes("Co-op")
            || fullinfo[i].includes("Minor")){
                newfiltered.pop();
        }
    }

    
    for(var j=0; j < newfiltered.length; j++){
        if(newfiltered[j].includes("Major") ||newfiltered[j].includes("Cumulative")){
            newfiltered[j] = "";
        }
    }
    
    var filtered = [];
    for(var j=0; j < newfiltered.length; j++){
        var line = newfiltered[j].toString();
            filtered.push(line);
        if(newfiltered[j]=="" && newfiltered[j-1]==""){
            filtered.pop();
        }
        
    }

    for(var j=0; j < filtered.length; j++){
        if(filtered[j-1]==("") && filtered[j]!=null){
            semList.push(filtered[j]);
        }
    }
    
    getCourses(filtered, semList, username, school);
    
}

function getCourses(filtered, semList, username, school){
    
    var courseList = [];

    for(var i=0; i<filtered.length; ++i){

        var line = filtered[i].toString();

            courseList.push(line);

        if(filtered[i]==""){
            courseList.pop();
        }
    }

    var n =0;
    //this is to rename each semester from 'F2016' to 'Fall 2016'
    for(var i=0; i<courseList.length; i++){

        if(courseList[i]==semList[n]){
            if(semList[n].includes("F"))
                var rename = semList[n].replace("F", "Fall ");
            else if(semList[n].includes("IS"))
                var rename = semList[n].replace("IS", "Summer ");
            else if(semList[n].includes("W"))
                var rename = semList[n].replace("W", "Winter ");
            var  tableHTML = '<tr><th class="sem-term" id="semester'+n+'">'+rename+'</th></tr>';
            $("table").append(tableHTML);
            n++;
        }
        else {
            parseCourses(courseList, i, username, school)
        }
    } 
}

function parseCourses(courseList, i, username, school){

    if(courseList[i].includes("  ")){
       var course = courseList[i].split("  "); 
    }
    else
    var course = courseList[i].split(" "); 
    
    var dept = course[0].trim();
    var code = parseInt(course[1]);
    var findGrade = courseList[i].split(".");

    if(findGrade[findGrade.length-1].includes("VW")){
        var grade = "VW";
    }
    else if(findGrade[findGrade.length-1]==("000")){
        var grade = "NA";
    }
    else if(findGrade[findGrade.length-1].includes("IP")){
        var grade = "PASSED";
    }
    else{
    var grade = parseInt(findGrade[findGrade.length-1]) + " %";

        if(parseInt(grade) >= 50){
        var docData = { grade: grade }
            firebase.firestore().collection("student").doc("post-secondary").collection(school).doc(username).collection("courses").doc(dept+"-"+code).set(docData).then(function() {
            console.log("Course List successfully written!");
            })
        }
    }

    var  tableHTML = '<tr id="course-info"><td id="dept">'+dept+'</td><td style="text-align: left;" id="code">'
                    +code+'</td><td style="text-align:right;" id="grade">'+grade+'</td></tr>';
    
    $("table").append(tableHTML); 
}