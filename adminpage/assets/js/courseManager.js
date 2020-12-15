$(function(){
})
/**
 * LOAD THE PROFESSORS ACCOUNT
 */
function loadProfAcc(){
    
    var userEmail = (document.getElementById("userEmail").textContent).toLowerCase();   //GETS THE EMAIL FOR THE PROF
    var splitEmail = userEmail.split("@");
    var splitDomain = splitEmail[1].split(".");
    var email = splitEmail[0];
    var school = splitDomain[0];


    document.getElementById("resultsContent2").style.display="none";    //THIS HIDES THE SEARCH RESULTS TABLE AFTER OPENING THE ACCOUNT
    printAccount(email, school);
    document.getElementById("viewAccount2").style.display="block";      //THIS SHOWS THE COURSES THE PROFESSOR IS ASSIGNED TO
}

//THIS IS PRINTS THE NAME AND SCHOOL NAME OF PROFESSOR
function printAccount(username, school){
    var db = firebase.firestore();
        var docRef = db.collection("staff").doc("post-secondary").collection(school).doc(username); //Sets the doc reference
    
               
    docRef.get().then(function(doc) { //Gets the document reference and checks for the document
          
      if (doc.exists){ //if the document exists then output the fullname

        document.getElementById("fullname").textContent = doc.data().fname+" "+doc.data().lname;
        document.getElementById("schoolname").textContent = doc.data().school;

        getCourses(docRef);
      }
      else {
        console.log("ERROR IN PRINTACCOUNT() WHERE THE FIRESTORE CANT BE FOUND");
      }

    }).catch(function(error) { //Catch any retrieval error
             console.log("ERROR IN PRINTACCOUNT() IN COURSE MANAGER");
    });
}

/**
 * FOR GRABBING DATA ABOUT COURSES FROM FIRESTORE AND REALTIME DATABASE
 */
function getCourses(docPath){
    var courseList = [];
    var i = 0;
    var docRef = docPath.collection("upcomingSem"); //GETS THE DATA FROM THE COLLECTION

    docRef.get().then(sub => {
        /**
         * CHECK IF THE CURRENT PROF HAS ANY COURSES REGISTERED UNDER THEIR NAME
         */
          if (sub.docs.length > 0) {
          
            docRef.get().then(querySnapshot => {
                querySnapshot.forEach(doc => {
                    courseList.push(doc.id);    //PUSH THE COURSES INTO AN ARRAY
                    var coursePath = docRef.doc((doc.id).toString());  //doc.id = "comp-1000"
                    
                    coursePath.get().then(function(doc) { //Gets the document reference and checks for the document
                
                        if (doc.exists){ //if the document exists then output the fullname
                            
                            var courseCode = (doc.id).split("-");   //split the course code to use and find in the course database
                            var schoolDatabase = document.getElementById("schoolname").textContent;
                            
                            firebase.database().ref('/'+schoolDatabase+'/'+courseCode[0]+'/'+courseCode[1]).once('value').then(function(snapshot) {
                                if (snapshot.exists()){
                                    var coursename = snapshot.val().coursename;
                                    var html = '<tr id="'+doc.id+'"><th scope="row"></th>'
                                    +'<td class="tm-product-name">'+doc.id+'</td>'
                                    +'<td class="text-center">'+coursename+'</td>'
                                    +'<td><button value="'+doc.id+'" onclick=deleteCourse(this.value)>REMOVE</td></tr>';

                                    //APPEND THE TABLE FOR EACH COURSE
                                    $("#coursesResult").append(html); i++;

                                    //ONCE ALL COURSES ARE PRINTED THEN ADD THE BUTTON
                                    if(i==courseList.length){
                                        var addCourseBtn = '<tr><th scope="row"></th>'
                                            +'<td><input type=text id=newcourse></td>'
                                            +'<td><button onclick=addCourse()>ADD COURSE</td>'
                                            +'<td class="text-center"></td></tr>';

                                        $("#addCoursesTable").append(addCourseBtn);
                                    }
                                }
                                /**
                                 * IF THE COURSE TO BE ADDED DOESNT EXIST IN THE CURRENT COURSE DB THEN DISREGARD THE ENTRY
                                 */
                                else{
                                    var addCourseBtn = '<tr><th scope="row"></th>'
                                    +'<td><input type=text id=newcourse></td>'
                                    +'<td><button onclick=addCourse()>ADD COURSE</td>'
                                    +'<td class="text-center"></td></tr>';

                                    $("#addCoursesTable").append(addCourseBtn);

                                    //FOLLOWING ELEMENTS ARE FOR THE INPUT
                                    document.getElementById("newcourse").style.borderColor = "red";
                                    document.getElementById("newcourse").placeholder = "Course not offered";
                                    document.getElementById("newcourse").style.textAlign = "center";
                                    
                                    deleteCourse(doc.id);   //DELETE AND DISREGARD THE ENTRY
                                }
                            
                            })  
                        }
                    }).catch(function(error) { //Catch any retrieval error
                        console.log("ERROR IN GETCOURSES() IN COURSE MANAGER");
                    })
                })
            })
        }
        /**
         * IF NO COURSE IS REGISTERED UNDER A PROFESSOR ACCOUNT THEN JUST APPEND A ENTRY TABLE TO ADD COURSES
         */
        else{
            var addCourseBtn = '<tr><th scope="row"></th>'
            +'<td><input type=text id=newcourse></td>'
            +'<td><button onclick=addCourse()>ADD COURSE</td>'
            +'<td class="text-center"></td></tr>';

            $("#addCoursesTable").append(addCourseBtn);
        }
    });
}

//DELETE THE COURSE FROM THE FIRESTORE
function deleteCourse(course){
    var db = firebase.firestore();
    var userEmail = document.getElementById("userEmail").textContent;
    var splitEmail = userEmail.split("@");
    var splitDomain = splitEmail[1].split(".");
    var username = splitEmail[0];
    var school = splitDomain[0];
    
    //FIRESTORE REF
    var docRef = db.collection("staff").doc("post-secondary").collection(school).doc(username); //Sets the doc reference

    docRef.collection("upcomingSem").doc(course).delete().then(function() {
        $("#"+course).remove(); //REMOVES THE ROW IN THE TABLE THAT HAS THE COURSE SELECTED TO BE DELETED
    }).catch(function(error) {
        console.error("ERROR IN DELETECOURSES IN COURSE MANAGER");
    });
}


/**
 * FOR ADDING COURSES INTO FIRESTORE
 */
function addCourse(){
    var db = firebase.firestore();
    var newCourse = (document.getElementById("newcourse").value).toUpperCase(); //CONVERTS THE INPUT TO ALL UPPERCASE
    var userEmail = (document.getElementById("userEmail").textContent).toLowerCase();

    //SPLIT THE EMAIL TO FIND THE USER DIRECTORY
    var splitEmail = userEmail.split("@");
    var splitDomain = splitEmail[1].split(".");
    var username = splitEmail[0];
    var school = splitDomain[0];

    //MAKE SURE USER ENTERS A VALID USER FORMAT
    if(/[A-Za-z]+-[\d]+/.test(newCourse)){
        document.getElementById("newcourse").style.borderColor = "grey";
        var docRef = db.collection("staff").doc("post-secondary").collection(school).doc(username); //Sets the doc reference

        //CREATE THE DATA TO THE STAFF'S FIRESTORE
        var data = {
            workload: "none", difficulty: "none", learning_style: "none"
        }

        //SAVE DATA IN FIRE STORE
        docRef.collection("upcomingSem").doc(newCourse).set(data);

        //UPDATE THE COURSE
        updateCourseDB(newCourse, userEmail);
        
        
        //RESET THE TABLE
        document.getElementById("coursesResult").innerHTML = "";
        document.getElementById("addCoursesTable").innerHTML = "";
        document.getElementById("loadtable").style.visibility = "hidden";
        document.getElementById("load3").style.display = "block";   //SHOWS THE LOADING 
        
        //LOAD THE NEW TABLE
        setTimeout(function(){
            getCourses(docRef);
            document.getElementById("load3").style.display = "none";
            document.getElementById("loadtable").style.visibility = "visible";
        },1500);
    }
    else{
        document.getElementById("newcourse").style.borderColor = "red";
        document.getElementById("newcourse").value = "";
        document.getElementById("newcourse").placeholder = "Invalid course entry";
        document.getElementById("newcourse").style.textAlign = "center";
    }
}

// UPDATES THE REALTIME DATABASE
function updateCourseDB(newCourse, profEmail){

    var schoolDatabase = document.getElementById("schoolname").textContent;
    var splitCourseCode = newCourse.split("-");
    firebase.database().ref('/'+schoolDatabase+'/'+splitCourseCode[0]+'/'+splitCourseCode[1]).once('value').then(function(snapshot){

        //if the course exists in the db then add the current professor teaching it
        if (snapshot.exists()){
            var postdata = {
                instructor: document.getElementById("fullname").textContent,
                workload: "none", 
                difficulty: "none", 
                learning_style: "none",
                coursename: snapshot.val().coursename,
                profEmail: profEmail
            }
            firebase.database().ref('/'+schoolDatabase+'/'+splitCourseCode[0]+'/'+splitCourseCode[1]).set(postdata);
        }})      
}