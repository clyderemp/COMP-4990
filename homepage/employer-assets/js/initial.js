
var docRef = firestoreDB.collection('myacadvisor-db').doc('myaccount-db');
var totalNumOfApplicants = 0;
$(function(){

    userAuth.onAuthStateChanged(function(user) {
      if (user) {
       // User is signed in.
        if(user!=null){
          uid = user.uid;
            userData = docRef.collection("employer").doc(uid).collection("employerData").doc('userData'); //Sets the doc reference
                    
            userData.get().then(function(doc) { //Gets the document reference and checks for the document
                    
                if (doc.exists){
                    
                    handleEmployer(doc);    //Checks if the user is authorized
                    loadPic(uid); //located in uploadlogo.js
                    companyRating();    //Gets the company rating
                    recommendRating();  //Gets the recommendation rating
                    getMyJobs();        //Gets the jobs
                }
                else{
                    alert("User does not have access to employer page");
                    logout();
                }
            }).catch(function(error) { //Catch any retrieval error
                console.log(error);
            });
        }
      }
      else
        logout();
    });
});

//Gets the company rating and outputs it as a graph
function companyRating(){
    ratingData = docRef.collection("employer").doc(uid).collection("employerData").doc('ratingData'); //Sets the doc reference

    ratingData.get().then(function(rating){
        $("#companyrating-title").html("Company Rating<br>Coming Soon...");
        var companyRating = rating.data().companyRating;
        Circles.create({
            id:"companyrating",
            radius:50,
            value: companyRating,
            maxValue:100,
            width:7,
            text: "N/A",
            colors: ['#f1f1f1', '#ffcd24'],
            duration:400,
            wrpClass:'circles-wrp',
            textClass:'circles-text',
            styleWrapper:true,
            styleText:true
        });
    });
}

function recommendRating(){
    //Set the db reference to the rating database
    ratingData = docRef.collection("employer").doc(uid).collection("employerData").doc('ratingData'); //Sets the doc reference

    ratingData.get().then(function(rating){
        $("#recommend-title").html("Recommendation Rating<br>Coming Soon...");
        var recommendRating = rating.data().recommendationRating;
        Circles.create({
            id:"recommend",
            radius:50,
            value: recommendRating,
            maxValue:100,
            width:7,
            text: "N/A",
            colors: ['#f1f1f1', '#ffcd24'],
            duration:400,
            wrpClass:'circles-wrp',
            textClass:'circles-text',
            styleWrapper:true,
            styleText:true
        });
    });
}

function applicantsReport(difference_between_creationDate_and_today){
    //Function to get the average applicants per day
    getAverageApplicantsPerDay();
    //Data array for the sparkline data chart
    var applicantsArr = [0, totalNumOfApplicants];
    var average = totalNumOfApplicants/difference_between_creationDate_and_today;
    $("#applicants-title").text("Daily Applicants Report");
    //Current number of applicants
    $("#currentapplicants").text("Current number of applicants: "+totalNumOfApplicants);
    //Average number of applicants per day
    $("#averageapplicants").text("Average number of applicants per day: "+average.toFixed(2));
    
    $("#updateprogress").text((applicantsArr[applicantsArr.length-1])-(applicantsArr[applicantsArr.length-2])+"+");
    //Sparkline to show the data of average applicants from the date account is created
    $('#applicantschart').sparkline(applicantsArr, {
        labels: "Number of Applicants:",
        type: 'line',
        height: '100',
        width: '100%',
        lineWidth: '2',
        lineColor: '#ffcd24',
        fillColor: 'rgba(255, 165, 52, .14)'
    })
}

function getMyJobs(){
    var jobDatabase = firestoreDB.collection('myacadvisor-db').doc('myjobs-db').collection("jobs");
    var applicantsArray = [];
    //Get each job that matches the employers ID
    jobDatabase.get().then(snapshot => {
        snapshot.forEach(doc => {   //for each job, get each applicant
            if(doc.data().companyUID == uid){
                //Using the applicants ID, use a reference to the students database to get more information
                getApplicantSchools(doc.data().applicantsID);
                totalNumOfApplicants++;
            }
        })
    });
}

function getApplicantSchools(applicants){
    var schools = [];
    
    for(var i=0; i<applicants.length; i++){
        var applicantData = docRef.collection("student").doc("post-secondary").collection(applicants[i]).doc('userData');
        //Get each applicants schoo information and add to the schools array
        applicantData.get().then(function(doc){
            schools.push(doc.data().school);
            getOccurence(schools);
        });
    }
}

//Function handles and finds the occurence of each school
function getOccurence(schools){
    
    //a is for active schools
    //b is for the num of applicants per school
    var a = [], b = [], prev;
  
    schools.sort();
    for ( var i = 0; i < schools.length; i++ ) {
        if ( schools[i] !== prev ) {
            a.push(schools[i]);
            b.push(1);
        } else {
            b[b.length-1]++;
        }
        prev = schools[i];
    }
    applicantactivity(a, b);
}

//Execute the search for the most top active school per applicant
function applicantactivity(activeschools, numofapplicants){
    
    getAverageApplicantsPerDay();

    var topschool = gettopschool(numofapplicants);

    document.getElementById("activeschool").innerHTML = "&nbsp&nbsp&nbsp"+activeschools[topschool];

    var activityGraph = document.getElementById('schoolactivity').getContext('2d');
    var activityGraph = new Chart(activityGraph, {
        type: 'bar',
        data: {
            labels: activeschools,
            datasets : [{
                label: "Number of Applicants",
                backgroundColor: '#ffcd24',
                borderColor: 'rgb(23, 125, 255)',
                data: numofapplicants
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
                        display: false, //this will remove only the label
                        beginAtZero: true
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

//Function used to get the top school
function gettopschool(arr){
    if (arr.length === 0) {
        return -1;
    }

    var max = arr[0];
    var maxIndex = 0;

    for (var i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
            maxIndex = i;
            max = arr[i];
        }
    }
    return maxIndex;
}

function getAverageApplicantsPerDay(){
    userData = docRef.collection("employer").doc(uid).collection("employerData").doc('creationDate');
    // JavaScript program to illustrate 
    // calculation of no. of days between two date 
    userData.get().then(function(doc){
        
        var creationDate = doc.data().createdOn.split('-');
        var month = creationDate[1];
        var day = creationDate[2];
        var year = creationDate[0];
        var account_created = month+'/'+day+'/'+year
        
        var today = new Date();
        var today_month = today.getMonth()+1;
        var today_day = today.getDate();
        var today_year = today.getFullYear();
        var today_date = today_month+'/'+today_day+'/'+today_year;
        
        // To set two dates to two variables 
        var date1 = new Date(account_created); 
        var date2 = new Date(today_date);
        
        // To calculate the time difference of two dates 
        var Difference_In_Time = date2.getTime() - date1.getTime(); 
        
        // To calculate the no. of days between two dates 
        var Difference_In_Days = Difference_In_Time / (1000 * 3600 * 24);
        
        applicantsReport(Difference_In_Days); //Gets the report about the applicants
    });
}