/**
 *  THIS SCRIPT IS WRITTEN FOR THE INFO LOADING OF THE USER BASED ON THE TRANSCRIPT THEY UPLOADED 
 * 
 * 
 *  AUTHOR: CLYDE REMPILLO
 */
var docRef = firestoreDB.collection('myacadvisor-db').doc('myaccount-db');
var uid, userData;
var coursesSaved = 0;

var storageRef = storageDB.ref();

$(function(){

    userAuth.onAuthStateChanged(function(user) {
  
      if (user) {
       // User is signed in.
        if(user!=null){
          uid = user.uid;
                userData = docRef.collection('student').doc("post-secondary").collection(uid).doc('userData'); //Sets the doc reference
                    
                userData.get().then(function(doc) { //Gets the document reference and checks for the document
                    
                    if (doc.exists){
                        handleStudents(doc, userData);
                        updateJobList();
                        
                    }
                    else{
                        alert("User does not have access to student page");
                        logout();
                    }
                }).catch(function(error) { //Catch any retrieval error
                    //console.log("Error in $function in dataloader.js, LINE: 138");
                    console.log(error);
                    console.log('need transcript');
                    $('#gradeCalculator').remove();
                    $('#genInfoGraphs').remove();
                    $('#transcriptRecord').remove();
                    $('#userinfo').text('Data not available. Please upload transcript.');
                    $('#semReportContent').html('<p style="text-align:center; padding-left: 20%;">Data not available. Please upload your transcript.<p>');

                    Swal.fire({
                        title: 'Welcome to myAccount!', 
                        html: 'In order for you to maximize our services, we need to gather initial information from academic transcript.<br><br>'
                            +'<button class="swal2-confirm swal2-styled" onclick=initialTranscriptUpload()>Upload my Transcript</button>',
                        showConfirmButton: false,
                        allowOutsideClick: false
                    });
                });
        }
      }
    });
})

function initialTranscriptUpload(){
    $("#file").trigger("click");
};

/**
 * This is basically just for loading data from firestore if no new transcript is uploaded
 */
function getDataFromFirestore(doc, userData){

    document.getElementById("totalCourses-calc").textContent = doc.data().totalCourses;
    document.getElementById("goalCumulative").placeholder = "CURRENT: "+doc.data().cumulativeAve+" %";
    document.getElementById("goalMajor").placeholder = "CURRENT: "+doc.data().majorAve+"%";
    loadCalcMyAve();
    //Gets the OEN number from firestore
    document.getElementById("oen").textContent = "OEN: "+doc.data().oen;

    //Gets the cumulative and major aver of the student from firestore
    document.getElementById("cumulative-title").textContent = "Cumulative Ave";
        gradeIndicator(doc.data().cumulativeAve, "cumulative");
    document.getElementById("major-title").textContent = "Major Ave";
        gradeIndicator(doc.data().majorAve, "major");

    //Grabs the Major and Minor info of the student from firestore and outputs it
    var majorInfo = (doc.data().major).split(" - ");
    var major = "<li>"+majorInfo[0]+"</li><li style='padding-left: 5%;'>"+majorInfo[1]+"</li>";
    var minor = "<li>"+doc.data().minor.toString();

    document.getElementById("userinfo").innerHTML = major;
    document.getElementById("userinfo").innerHTML += minor;

    //Grabs the data from firestore and outputs it in a circle graph
    creditsCircle(doc.data().totalCredits);

    //Gets all the semester or courses related data from the ones saved on the database
    getSemester(doc.data().fullTranscriptData, userData);
    
}

/**
 * GET THE ONTARIO EDUCATION NUMBER OF STUDENT
 */
function getOEN(fullinfo, userData){
    for(var i=0; i<fullinfo.length; i++){

        //Will check all the lines and if the line has the keyword OEN then get that value
        if(fullinfo[i].includes("OEN")){
            var oen_str = fullinfo[i].toString();   //THIS TURNS OEN STRING
            var oen_line = oen_str.split(":");   //SPLITS OEN: 123345 into 2 halves
            var oen_num =parseInt(oen_line[1]);

        document.getElementById("oen").textContent = "OEN: "+oen_num;
        var docData = { oen: oen_num }
        var userData =  userData;
        
        updateTranscriptData(docData, userData);
        }
    }
}

/**
 * GET THE CUMULATIVE AVERAGE DATA FROM TEH TRANSCRIPT
 */
function getCumulativeAverage(fullinfo, userData){

    for(var i = 0; i<fullinfo.length; i++){
        //Go through all the lines and find the ones that has the keyword cumulative
        if(fullinfo[i].includes("Cumulative")){
           
            var cumulativeAverage = fullinfo[i].split("Average"); //SPLIT THE LATEST LINE OF CUMULATIVE UPDATE
            var decimal = cumulativeAverage[1].split('.');  //TAKES THE DECIMAL VALUE OF YOUR AVERAGE
            var getPercent = decimal[0] + '.' + decimal[1];
            var parsed = parseFloat(getPercent);

            //Since the total credits and cumulative are on the same line then might as well get the most updated total credits
            getTotalCredits(parseInt(decimal[2]), userData);

            //Make sure that parsed value is valid
            if(parsed!=NaN || parsed!=null){
                document.getElementById("cumulative-title").textContent = "Cumulative Ave";
                gradeIndicator(parsed, "cumulative");
                var docData = { cumulativeAve: parsed }
                var userData =  userData;
                document.getElementById("goalCumulative").placeholder = "CURRENT: "+parsed+" %";
                updateTranscriptData(docData, userData);
            }
        }
    }
}

/**
 * GET THE MAJOR AAVERAGE FROM TRANSCRIPT
 */
function getMajorAverage(fullinfo, userData){
    
    for(var i=0; i<fullinfo.length; i++){
        //Check all lines and if the line has the key word major and the value is not 0% then grab the line and consider as valid
        if(fullinfo[i].includes("Major") && !fullinfo[i].includes("0.000")){
            var majorAve = fullinfo[i].toString();
            var getPercent = majorAve.split(":");
            var parsed = parseFloat(getPercent[1]);
            console.log(parsed);
        }
    }
    gradeIndicator(parsed, "major");
    document.getElementById("major-title").textContent = "Major Ave";

    var docData = { majorAve: parsed }
    
    updateTranscriptData(docData, userData);
    document.getElementById("goalMajor").placeholder = "CURRENT: "+parsed+"%";
}

/**
 * GET BACHELORS DEGREE VALUE
 */
function getBachelors(fullinfo, userData){
    var major = "<li>No degree stated on transcript";
    
    for(var i=0; i<fullinfo.length; i++){
        //Check all lines and fine the one that has the keyword Bachelor
        if(fullinfo[i].includes("Bachelor")){
            var majorInfo = fullinfo[i].split(" - ");
            major = "<li>"+majorInfo[0]+"</li><ul><li>"+majorInfo[1]+"</li>";
            var docData = { major: fullinfo[i] }
        }
    }
    
    document.getElementById("userinfo").innerHTML = major;

    updateTranscriptData(docData, userData);
}

/**
 * GET MINOR INFO
 */
function getAnyMinor(fullinfo, userData){
    var minor = "<li>MINOR: None";
    var docData = { minor: "NONE" }
    
    for(var i=0; i<fullinfo.length; i++){
        //Go through all the lines and find the keyword Minor
        if(fullinfo[i].includes("Minor")){
            minor = "<li>"+fullinfo[i].toString();
            var docData = { minor: fullinfo[i].toString() }
        }
    } 
    document.getElementById("userinfo").innerHTML += minor;

    updateTranscriptData(docData, userData);
}

/**
 * GET TOTAL CREDITS ACCCUMULATED
 */
function getTotalCredits(totalCredits, userData){
    //From the getcumulative function, since they are on the same line, this is executed at the same time
    creditsCircle(totalCredits);

    var docData = { totalCredits: totalCredits, totalCourses: (totalCredits/3)}

    
    updateTranscriptData(docData, userData);
}

/**
 * MAKE CIRCLE VALUE FOR THE TOTAL CREDITS
 */
function creditsCircle(totalCredits){
    //This is for the circle graph executed to show the total credits
    
    document.getElementById("credits-title").textContent = "Total Credits";

        Circles.create({
            id:"credits",
            radius:50,
            value: totalCredits,
            maxValue:totalCredits,
            width:7,
            text: totalCredits,
            colors: ['#f1f1f1', '#ffcd24'],
            duration:400,
            wrpClass:'circles-wrp',
            textClass:'circles-text',
            styleWrapper:true,
            styleText:true
        });
}

/**
 * MAKE CIRCLE PERCENTAGE FOR THE AVERAGES
 */
function gradeIndicator(average, type){
            if(average>70){
                Circles.create({
                    id:type,
                    radius:50,
                    value: average,
                    maxValue:100,
                    width:7,
                    text: average.toFixed()+" %",
                    colors: ['#f1f1f1', '#2BB930'],
                    duration:400,
                    wrpClass:'circles-wrp',
                    textClass:'circles-text',
                    styleWrapper:true,
                    styleText:true
                })
            }
            else if(average>50 && average<70){
                Circles.create({
                    id:type,
                    radius:50,
                    value: average,
                    maxValue:100,
                    width:7,
                    text: average.toFixed()+" %",
                    colors: ['#f1f1f1', '#ff8c00'],
                    duration:400,
                    wrpClass:'circles-wrp',
                    textClass:'circles-text',
                    styleWrapper:true,
                    styleText:true
                })
            }
            else if(average<50){
                Circles.create({
                    id:type,
                    radius:50,
                    value: average,
                    maxValue:100,
                    width:7,
                    text: average+" %",
                    colors: ['#f1f1f1', '#ff2a00'],
                    duration:400,
                    wrpClass:'circles-wrp',
                    textClass:'circles-text',
                    styleWrapper:true,
                    styleText:true
                })
            }
}

/**
 * GET SEMESTER LIST FROM TRANSCRIPT AND PUT INTO AN ARRAY
 */
function getSemester(fullinfo, userData){
    var newfiltered = [""]; //This is to ensure that each semester is divided, not sure how it works but it does
    var semList = [];   //This array is to get all the values of semesters
    var termAve = [];   //This array is to get all the average per semester
    var cumulativeAve = []; //This is to get the cumulativeAve Progress as each semester is finished (example Sem1: 75% -> Sem2: 90% etc..)
    
    for(var i=0; i<fullinfo.length; ++i){
        var line = fullinfo[i].toString();
        newfiltered.push(line);
        /**
         * We start with the raw file and filter all the lines that include the following keywords
         * We should just be left with the semesters and courses
         * use console.log() to execute the filtered values
         */
        if( fullinfo[i].includes("OEN") || fullinfo[i].includes("Bachelor") 
            || fullinfo[i]=="" || fullinfo[i].includes("Repeated") || fullinfo[i].includes("Co-op")
            || fullinfo[i].includes("Minor")){
                newfiltered.pop();
        }
    }

    for(var j=0; j < newfiltered.length; j++){

        /**
         * After filteration, we now must divided each one and add them into their respective array
         * All the cumulative progress ave to one, and so on
         */
        if(newfiltered[j].includes("Term")){
            var semesterAve = newfiltered[j].split("Average");
            termAve.push(parseInt(semesterAve[1]));
            newfiltered[j] = "";
        }
        if(newfiltered[j].includes("Cumulative")){
            var cumulativeTemp = newfiltered[j].split("Average");
            cumulativeAve.push(parseInt(cumulativeTemp[1]));
            newfiltered[j] = "";
        }
        if(newfiltered[j].includes("Major") ||newfiltered[j].includes("Cumulative")){
            newfiltered[j] = "";
        }
    }
    
    var filtered = [];

    //Since we dont want any empty lines and the trim() function wont work so a hard-coded it so it pops all the empty lines
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
    getCourses(filtered, semList, userData, termAve, cumulativeAve);
}

/**
 * EXTRACT COURSES FROM THE TRANSCRIPT AND INTO AN ARRAY
 */
function getCourses(filtered, semList, userData, termAve, cumulativeAve){
    
    var courseList = [];
    var gradeArray = [];

    for(var i=0; i<filtered.length; ++i){
        /**
         * After filterting, we now get all the courses and the grades from the array
         */
        var line = filtered[i].toString();

            courseList.push(line);

        if(filtered[i]==""){
            courseList.pop();
        }
    }

    semesterGraph(semList,termAve); //We make a bar graph for semester comparison, that shows which semester you've done well in
    semesterLine(cumulativeAve) //We make a line graph to show the progress of your cumulative term ave throughout your time

    var n=0;
    //this is to rename each semester from 'F2016' to 'Fall 2016'
    for(var i=0; i<courseList.length; i++){

        if(courseList[i]==semList[n]){
            if(semList[n].includes("F"))
                var rename = semList[n].replace("F", "Fall ");
            else if(semList[n].includes("IS"))
                var rename = semList[n].replace("IS", "Summer ");
            else if(semList[n].includes("W"))
                var rename = semList[n].replace("W", "Winter ");
            var  tableHTML = '<tr><td colspan=3 style="font-size:25px; font-weight: bolder; text-align: center;" class="sem-term" id="semester'+n+'">'+rename+'</td></tr>';
            $("#semTable").append(tableHTML);
            n++;
        }
        else {
            parseCourses(courseList, i, userData, gradeArray, gradeArray.length)
        }
    }

    document.getElementById("totalCourses-calc").textContent = courseList.length;
}

/**
 * GET THE COURSES FROM AN ARRAY
 * THEN OUTPUT INTO A TABLE
 */
function parseCourses(courseList, i, userData, gradeArray, courseLengthIndex){

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
        var transcriptData = { grade: grade }
        var firestorePath =  userData;
        
        gradeArray.push(parseInt(grade));
        saveTranscriptData(transcriptData, firestorePath, dept, code, gradeArray, courseLengthIndex);

        }
    }

    var  tableHTML = '<tr id="course-info"><td id="dept">'+dept+'</td><td style="text-align: left;" id="code">'
                    +code+'</td><td style="text-align:right;" id="grade">'+grade+'</td></tr>';
    
    $("#semTable").append(tableHTML); 
}

/**
 * FOR THE SEMESTER PROGRESS REPORT - BAR GRAPH
 */
function semesterGraph(semList, termAve){
    
    var ascendingtermAve = [];
    for(var i=0; i<termAve.length; i++){
        if(termAve[i]!=0){
            ascendingtermAve.push(termAve[i]);
        }
    }
    
    ascendingtermAve.sort(function(a,b){return a-b});

    document.getElementById("lowestSem").textContent = ascendingtermAve[0] + " %";
    document.getElementById("highestSem").textContent = ascendingtermAve[ascendingtermAve.length-1] + " %";

    var semesterGraph = document.getElementById('semesterGraph').getContext('2d');

		var semesterGraph = new Chart(semesterGraph, {
			type: 'bar',
			data: {
				labels: semList,
				datasets : [{
					label: "Average",
					backgroundColor: '#ffcd24',
					borderColor: 'rgb(23, 125, 255)',
                    data: termAve
				}],
			},
			options: {
				responsive: true,
				maintainAspectRatio: false,
				legend: {
					display: false,
				},
				scales: {
					yAxes: [{
						ticks: {
							display: false //this will remove only the label
						},
						gridLines : {
							drawBorder: false,
							display : true
						}
					}],
					xAxes : [ {
						gridLines : {
							drawBorder: false,
							display : false
                        },
                        
					}]
				},
			}
		});
}

/**
 * FOR THE CUMULATIVE PROGRESS REPORT - LINE GRAPH
 */
function semesterLine(cumulativeAve){
    var ascendingCourseGrades = [];
    var newTermAve = [];
    var average = 0;
    
    for(var i=0; i<cumulativeAve.length; i++){
        if(cumulativeAve[i]>0){
            ascendingCourseGrades.push(cumulativeAve[i]);
            newTermAve.push(cumulativeAve[i]);
            average += cumulativeAve[i];
        }
        else if((cumulativeAve[i]==0))
        cumulativeAve.pop();
    }
    ascendingCourseGrades.sort(function(a,b){ return a-b});

    $('#courseReportChart').sparkline(newTermAve, {
        labels: "Grade:",
        type: 'line',
        height: '100',
        width: '100%',
        lineWidth: '2',
        lineColor: '#ffcd24',
        fillColor: 'rgba(255, 165, 52, .14)'
    })

    var difference = (ascendingCourseGrades[ascendingCourseGrades.length-1]-(average/newTermAve.length)).toFixed(2);
    
    document.getElementById("aveProgress-title").textContent = "Cumulative Average Progress";

    document.getElementById("highestCourse").textContent = "Peak Term Average (%): "+ascendingCourseGrades[ascendingCourseGrades.length-1] +" %";
    document.getElementById("median").textContent = "Mean Average: "+(average/newTermAve.length).toFixed(3) +" %";
        

    if(difference>0){
        document.getElementById("percent").innerHTML = ("+"+difference+"%").fontcolor("green");
    }
    else{
        document.getElementById("percent").innerHTML = ("-"+difference+"%").fontcolor("red");
    }
}

/**
 * THIS IS MAINLY FOR SAVING THE COURSES ONTO THE DATABASE
 */
function saveTranscriptData(transcriptData, firestorePath, dept, code, gradeArray, index){
    firestorePath.get().then(function(doc) { //Gets the document reference and checks for the document
        
        //Only execute if a new transcript is uploaded
        if (doc.exists && doc.data().newTranscript == 'true'){
                
                var transcriptUpdate = {newTranscript: 'false' }
                firestorePath.update(transcriptUpdate).then(function() {
                })

                firestorePath.collection("courses").doc(dept+"-"+code).set(transcriptData).then(function() {
                    console.log("Course List successfully written!");
                })
        }
    })
}

/**
 * THIS CAN BE USED FOR ANY UPDATE TO THE DATA ON FIRESTORE
 */
function updateTranscriptData(docData, fieldPath){

    fieldPath.get().then(function(doc) { //Gets the document reference and checks for the document
                
        if (doc.exists && doc.data().newTranscript == 'true'){ //Only execute if a new transcript is uploaded
            
            var transcriptUpdate = {newTranscript: 'false' }
            fieldPath.update(transcriptUpdate).then(function() {
            });

            fieldPath.update(docData).then(function() {
                //console.log("Average Successfully Saved!");
            });
        }
    })
}

function loadinitialdata(){
    Swal.fire({
        title: 'please wait...\nupdating your user data...',
        html: '<div class=loading-position><div class="loader"></div><div>',
        showConfirmButton: false,
        allowOutsideClick: false,
        timer: 10000
    }).then(function(){ 
        updateJobList();
        notify("dataloader.js", "none"); //LOCATED IN MYCOURSEPLANNER --> NOTIFY
    });
}