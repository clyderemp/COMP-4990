$(function(){
    document.getElementById("courses").style.display = "none";
    document.getElementById("coursePlanner").style.display = "none";
    document.getElementById("footer").style.display = "none";

    firebase.auth().onAuthStateChanged(function(user) {
        var user = firebase.auth().currentUser;
        var db = firebase.firestore();
  
      if (user) {
       // User is signed in.
        if(user!=null){
            var splitEmail = user.email.split("@"); //Splits the email into 2 strings
            var splitSchoolDomain = splitEmail[1].split("."); //Splits the email into 2 strings by the period
            var username = splitEmail[0]; //takes the username from the initial split email array
            var school = splitSchoolDomain[0];  //takes the schoolname from the splitter array

            deleteAllFiles();//delete any previous data
            var docRef = db.collection("student").doc("post-secondary").collection(school).doc(username); //Sets the doc reference
                
            docRef.get().then(function(doc) { //Gets the document reference and checks for the document
                    
                if (doc.exists){
                    var school = doc.data().school;
                    var id = doc.data().id_num;
                    
                    document.getElementById("schoolDatabase").textContent = school;
                    document.getElementById("schoolDatabase").style.color = "#ffcd24";
                    document.getElementById("schoolDatabase").style.fontWeight = "bolder";
                    document.getElementById("input").placeholder  = "Search courses from "+school;

                    var html = '<th scope="col">&nbsp;</th>'
                    +'<th scope="col" class="text-center">Course Code</th>'
                    +'<th scope="col" class="text-center">Course Name</th>'
                    +'<th scope="col" class="text-center">Difficulty</th>'
                    +'<th scope="col" class="text-center">Workload</th>'
                    +'<th scope="col" class="text-center">Learning Style</th>'
                    +'<th scope="col">&nbsp;</th>';
                //APPEND THE TABLE FOR EACH COURSE
                $("#tableheader2").append(html);
                }

                }).catch(function(error) { //Catch any retrieval error
                    console.log("Error in $function in searchCourses.js");
                    console.log("Error getting document:", error);
                });
            }
        }
    });
})

function grabCourseData(input){
    document.getElementById("tableheader").innerHTML = "";
    document.getElementById("resultTable").innerHTML = "";
    document.getElementById("courses").style.display = "block";
    var input = input.toUpperCase();
    
    var searchResults = document.getElementById("courses");
    var schoolDatabase = document.getElementById("schoolDatabase").textContent;

    if(input.length>0){
        $('.preloader').fadeIn(1000); // set duration in brackets   


        setTimeout(function(){
            if(/[A-Za-z]+-[\d]+/.test(input)){
                var courseCode = input.split("-");   //split the course code to use and find in the course database
                var refPath = firebase.database().ref('/'+schoolDatabase+'/'+courseCode[0]+'/'+courseCode[1]);
                getSpecificCourse(refPath, input);
                document.getElementById("resultsForHeader").textContent = 'Results for "'+input+'"';
            }
            if(input=="ALL"){
                getAllCourses(schoolDatabase, input);
            }
            else
            {
                var refPath = firebase.database().ref('/'+schoolDatabase+'/'+input);
                getDeptCourse(refPath, input);
                document.getElementById("resultsForHeader").textContent = 'Results for "'+input+'"';
            }
    
            var html = '<th scope="col">&nbsp;</th>'
                        +'<th scope="col" class="text-center">Course Code</th>'
                        +'<th scope="col" class="text-center">Course Name</th>'
                        +'<th scope="col" class="text-center">Difficulty</th>'
                        +'<th scope="col" class="text-center">Workload</th>'
                        +'<th scope="col" class="text-center">Learning Style</th>'
                        +'<th scope="col" class="text-center">Professor</th>'
                        +'<th scope="col">&nbsp;</th>';
            //APPEND THE TABLE FOR EACH COURSE
            $("#tableheader").append(html); //APPENED THE HEADER

            $('.preloader').fadeOut(2000);
            window.location = 'index.html#courses'; //go to courses section
            document.getElementById("coursePlanner").style.display = "block";
            document.getElementById("footer").style.display = "block";
            document.getElementById("newSearchBtn").style.visibility = "visible";
            document.getElementById("resultsBtn").style.visibility = "visible";
        },1000)
    }
    else
    document.getElementById("input").placeholder = "Please enter something...OR enter ALL to get all courses...";
}

//THIS IS FOR WHEN USER INPUT SPECIFIC COURSES SUCH AS (COMP-100-, CMAF-1010)
function getSpecificCourse(refPath, input){
    var totalResults = 0; //TO OUTPUT THE TOTAL NUMBER

    refPath.once('value').then(function(snapshot) {
        if (snapshot.exists()){
                var coursename = snapshot.val().coursename;
                var workload = snapshot.val().workload;
                var difficulty = snapshot.val().difficulty;
                var learning_style = snapshot.val().learning_style;
                var instructor = snapshot.val().instructor;

                var html = '<tr id="'+snapshot.val()+'"><th scope="row"></th>'
                        +'<td class="text-center">'+input+'</td>'
                        +'<td class="text-center">'+coursename+'</td>'
                        +'<td class="text-center">'+workload+'</td>'
                        +'<td class="text-center">'+difficulty+'</td>'
                        +'<td class="text-center">'+learning_style+'</td>'
                        +'<td class="text-center">'+instructor+'</td>'
                        +'<td><a id=addBtn href="#coursePlanner" class="smoothScroll" onclick=addToCoursePlan(this.name)  name="'
                            +input+','+coursename
                            +','+workload+','+difficulty+','+learning_style+'" > ADD </a></td></tr>';
                //APPEND THE TABLE FOR EACH COURSE
                $("#resultTable").append(html);
                totalResults++; //INCREMENT FOR EACH COURSE
        }
        else{
            document.getElementById("resultsForHeader").textContent = 'Sorry but no results were found for "'+input+'"';
        }                  
    })
    document.getElementById("resultsForHeader").textContent = 'There are '+totalResults+' total results for "'+input+'"';
 }


//THIS IS WHEN THE USER ONLY INPUTS THE COURSE DEPT SUCH AS (COMP, ACCT, CMAF)
function getDeptCourse(refPath, input){
    var totalResults = 0;

    refPath.once('value').then(function(snapshot) {
        if (snapshot.exists()){

           snapshot.forEach(function(childSnapshot) {
                var coursename = childSnapshot.val().coursename;
                var workload = childSnapshot.val().workload;
                var difficulty = childSnapshot.val().difficulty;
                var learning_style = childSnapshot.val().learning_style;
                var instructor = childSnapshot.val().instructor;

                var html = '<tr id="'+snapshot.key+"-"+childSnapshot.key+'"><th scope="row"></th>'
                        +'<td class="text-center">'+snapshot.key+"-"+childSnapshot.key+'</td>'
                        +'<td class="text-center">'+coursename+'</td>'
                        +'<td class="text-center">'+workload+'</td>'
                        +'<td class="text-center">'+difficulty+'</td>'
                        +'<td class="text-center">'+learning_style+'</td>'
                        +'<td class="text-center">'+instructor+'</td>'
                        +'<td><a id=addBtn href="#coursePlanner" onclick=addToCoursePlan(this.name)  name="'
                            +snapshot.key+"-"+childSnapshot.key+','+coursename
                            +','+workload+','+difficulty+','+learning_style+'" > ADD </a></td></tr>';
                //APPEND THE TABLE FOR EACH COURSE
                $("#resultTable").append(html);
                totalResults++;
            })
            document.getElementById("resultsForHeader").textContent = 'There are '+totalResults+' total results for "'+input+'"';
        }
        else{
            document.getElementById("resultsForHeader").textContent = 'Sorry but no results were found for "'+input+'"';
        }                  
    })  
 }

//THIS IS FOR WHEN THE USER INPUTS THE WORD "ALL" TO GET ALL THE OFFERED COURSES
function getAllCourses(schoolDatabase, input){
    var totalResults = 0;
    
    var refPath = firebase.database().ref('/'+schoolDatabase);
    refPath.once('value').then(function(snapshot) {
        if (snapshot.exists()){

           snapshot.forEach(function(childSnapshot) {

                childSnapshot.forEach(function(childSnapshot2){
                    var coursename = childSnapshot2.val().coursename;
                    var workload = childSnapshot2.val().workload;
                    var difficulty = childSnapshot2.val().difficulty;
                    var learning_style = childSnapshot2.val().learning_style;
                    var instructor = childSnapshot2.val().instructor;

                    var html = '<tr id="'+childSnapshot.val()+'"><th scope="row"></th>'
                            +'<td class="text-center">'+childSnapshot.key+"-"+childSnapshot2.key+'</td>'
                            +'<td class="text-center">'+coursename+'</td>'
                            +'<td class="text-center">'+workload+'</td>'
                            +'<td class="text-center">'+difficulty+'</td>'
                            +'<td class="text-center">'+learning_style+'</td>'
                            +'<td class="text-center">'+instructor+'</td>'
                            +'<td><a class="smoothScroll" id=addBtn href="#coursePlanner" onclick=addToCoursePlan(this.name)  name="'
                            +childSnapshot.key+"-"+childSnapshot2.key+','+coursename
                            +','+workload+','+difficulty+','+learning_style+'" > ADD </a></td></tr>';
                    //APPEND THE TABLE FOR EACH COURSE
                    $("#resultTable").append(html);
                    totalResults++;
                })
               
            })
            document.getElementById("resultsForHeader").textContent = 'There are '+totalResults+' total results for "'+input+'"';
        }
        else{
            document.getElementById("resultsForHeader").textContent = 'Sorry but no results were found for "'+input+'"';
        }                  
    })  
 }

 /**
  * THIS IS TO ADD COURSES TO THE PLANNER
  */
 function addToCoursePlan(input){

    if(!input.includes(undefined)){
        document.getElementById("resultTable2").innerHTML = "";
        document.getElementById("plannerBtn").style.visibility = "visible";
        document.getElementById("coursePlanner").style.display = "block"; 
        var user = firebase.auth().currentUser;
        var userEmail = user.uid;
        var courseInfo = input.split(",");
        console.log(userEmail);

        var docRef = firebase.firestore().collection("temp").doc("tempdoc").collection("temp-"+userEmail).doc(courseInfo[0]);

        var docData = {
            code: courseInfo[0], coursename: courseInfo[1], workload: courseInfo[2], difficulty: courseInfo[3], learning_style: courseInfo[4]
        }

        docRef.set(docData).then(function() {
            console.log("Temp-courseplanner has been successfully created!");
        })

        updateCoursePlanner();
    }
    else{
        document.getElementById("coursePlanner").style.display = "none";        
        window.alert("INVALID");
    }
        
}

 /**
  * THIS IS TO RELOAD THE TABLE AND UPDATE THE COURSE PLANNER
  */
function updateCoursePlanner(){
     var totalCourses = 0;
     var difficultyScore = 0;
     var workloadScore = 0;


    document.getElementById("resultTable2").innerHTML = "";
    var user = firebase.auth().currentUser;
    var userEmail = user.uid;

    var tempPath = firebase.firestore().collection("temp").doc("tempdoc").collection("temp-"+userEmail);
    tempPath.get().then(sub => {
        /**
         * CHECK IF THE CURRENT PROF HAS ANY COURSES REGISTERED UNDER THEIR NAME
         */
          if (sub.docs.length > 0) {
          
            tempPath.get().then(querySnapshot => {
                querySnapshot.forEach(doc => {  //PUSH THE COURSES INTO AN ARRAY
                    var coursePath = tempPath.doc((doc.id).toString());  //doc.id = "comp-1000"
                    
                    coursePath.get().then(function(doc) { //Gets the document reference and checks for the document
                
                        if (doc.exists){ //if the document exists then output the fullname
                            
                            var courseCode = doc.data().code;   //split the course code to use and find in the course database
                            var coursename = doc.data().coursename;
                            var workload = doc.data().workload;
                            var difficulty = doc.data().difficulty;
                            var learning_style = doc.data().learning_style;

                            var html2 = '<tr><th scope="row"></th>'
                                +'<td class="text-center">'+courseCode+'</td>'
                                +'<td class="text-center">'+coursename+'</td>'
                                +'<td class="text-center">'+difficulty+'</td>'
                                +'<td class="text-center">'+workload+'</td>'
                                +'<td class="text-center">'+learning_style+'</td>'
                                +'<td><a id=removeBtn href="#coursePlanner" onclick=deleteCourse("'+courseCode+'")>REMOVE</a></td></tr>';
                        
                            $("#resultTable2").append(html2); totalCourses++;

                            //TO DETERMINE DIFFUCILTY LEVEL
                            switch(difficulty){
                                case "low":
                                    difficultyScore+=1; break;
                                case "med":
                                    difficultyScore+=2; break;
                                case "high":
                                    difficultyScore+=3; break;
                                default:
                                    break;
                            }
                            //TO DETERMINE WORKLOAD LEVEL
                            switch(workload){
                                case "low":
                                    workloadScore+=1; break;
                                case "med":
                                    workloadScore+=2; break;
                                case "high":
                                    workloadScore+=3; break;
                                default:
                                    break;
                            }
                            //CALCULATE THE SCORES
                            calculate(difficultyScore, workloadScore, sub.docs.length, totalCourses);
                        }
                    }).catch(function(error) { //Catch any retrieval error
                        console.log("ERROR IN GETCOURSES() IN COURSE MANAGER"+error);
                    })
                })
            })
        }
        else{
            document.getElementById("coursePlanner").style.display = "none";
            deleteAllFiles();
        }
    })
}

/**
 * DELETE FROM THE COURSEPLANNER
 */
function deleteCourse(code){
    var user = firebase.auth().currentUser;
    var userEmail = user.uid;
    var db = firebase.firestore().collection("temp").doc("tempdoc").collection("temp-"+userEmail);

    db.doc(code).delete().then(function() {
        updateCoursePlanner();
        console.log("Document successfully deleted!");
    }).catch(function(error) {
        console.error("Error removing document: ", error);
    });
 }

 /**
  * THIS IS TO CALCULATE THE SCORES
  */
function calculate(difficultyScore, workloadScore, totalLength, totalCourses){

    var denominator = totalCourses * 3;
    var diff_score = (difficultyScore/denominator)*100;
    var work_score = (workloadScore/denominator)*100;

    /**
     * USING THE SCORES ABOVE, WE CALCULATE THE LEVEL SCORES
     * 
     * SO DENOMINATOR IS MAX LEVEL SCORE POSSIBLE USING THE TOTAL NUMBER OF COURSES MULTIPLIED BY 3
     * THEN WE USE THIS TO DIVIDE THE CURRENT LEVEL SCORE OF DIFFICULTY OR WORKLOAD
     * 
     * SO,
     * LEVEL OF DIFFICULTY = 5 AND TOTAL NUMBER OF COURSES IS 2
     * WE DO,
     * 5 / (2*3) => 3.3333 
     */


     /**THIS ONE IS TO SEE IF DIFFICULTY IS ABOVE 67%, IN BETWEEN OR BELOW
      * 
      */
    if(diff_score>(100*(2/3))){
        var difficulty = "High Difficulty!";
    }
    else if((100*(1/3))<diff_score && diff_score<=(100*(2/3))){
        var difficulty = "Medium Difficulty";
    }
    else
        var difficulty = "Low Difficulty";

    /**
    * FOR WORKLOAD SCORE
    */
    if(work_score>(100*(2/3))){
        var workload = "High Workload!";
    }
    else if((100*(1/3))<work_score && work_score<=(100*(2/3))){
        var workload = "Medium Workload";
    }
    else
        var workload = "Low Workload";

    //ONE ALL COURSES HAVE BEEN APPENEDED TO THE COURSE PLANNER TABLE
    //THEN OUTPUT THE RESULTS OF THE CALCULATOR
     if(totalCourses==totalLength){
        var lastLine = '<tr><th style="padding-top:10%;" scope="row"></th>'
            +'<td class="text-center"></td>'
            +'<td style="font-weight: bold; font-size: 20px;" class="text-center">TOTAL: </td>'
                +'<td style="font-weight: bold; font-size: 15px;" class="text-center">'+difficulty+'</td>'
                +'<td class="text-center">'+'</td>'
                +'<td style="font-weight: bold; font-size: 15px;" class="text-center">'+workload+'</td>'
                +'<td class="text-center">'+'</td>'
                +'<td></td></tr>';
     $("#resultTable2").append(lastLine);
     }
}

//RESET THE TABLE AND DELETE ALL THE FILES IN THE DATABASE
 function deleteAllFiles(){
    var user = firebase.auth().currentUser;
    var userEmail = user.uid;

    var tempPath = firebase.firestore().collection("temp").doc("tempdoc").collection("temp-"+userEmail);
    tempPath.get().then(sub => {
        /**
         * CHECK IF THE CURRENT PROF HAS ANY COURSES REGISTERED UNDER THEIR NAME
         */
        if (sub.docs.length > 0) {
          
            tempPath.get().then(querySnapshot => {
                querySnapshot.forEach(doc => {  //PUSH THE COURSES INTO AN ARRAY
                    var coursePath = tempPath.doc((doc.id).toString());  //doc.id = "comp-1000"
                            
                            coursePath.delete().then(function() {
                                console.log("Document successfully deleted!");
                            }).catch(function(error) {
                                console.error("Error removing document: ", error);
                            });
                    }).catch(function(error) { //Catch any retrieval error
                    console.log("ERROR IN LINE 416 OF SEARCH COURSES");
                })
            })
        }
    })
}