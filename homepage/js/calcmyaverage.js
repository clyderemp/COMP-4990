
function calculator(){
    var goalCumulative = $("#goalCumulative").val();
    var goalMajor = $("#goalMajor").val();
    var courses = parseInt($("#registeredCourses").val());

    var totalNumCourses = parseInt(document.getElementById("totalCourses-calc").textContent);
    var major = parseFloat(document.getElementById("major-calc").textContent);
    var cumulative = parseFloat(document.getElementById("cumulative-calc").textContent);

    if(courses<=5 && courses>0){
        document.getElementById("calcResults").style.color = "#ffcd24";
        cumulativeCalc(totalNumCourses, cumulative, courses, goalCumulative);
        majorCalc(totalNumCourses, major, courses, goalMajor);
    }
    else if(courses<=0){
        document.getElementById("calcResults").textContent = "Please enter a valid number of upcoming courses";
        document.getElementById("calcResults").style.color = "red";
    }
}

function cumulativeCalc(totalNumCourses, cumulative, upcomingCourses, goalCumulative){

    var totalCumulative = cumulative * totalNumCourses; //70% = n/33 --> n=2310

    var goalCourses = totalNumCourses + upcomingCourses;
    var goalTotalCumulative = goalCumulative * goalCourses; //goal: 72% then multiply by registered courses the upcoming semester with total completed
    var difference = goalTotalCumulative - totalCumulative;

    var goalTotal = difference / upcomingCourses; console.log(goalTotal);
    if(goalTotal>100 ||  goalTotal<0)
        document.getElementById("calcResults").textContent = "Your goal for this semester is UNACHIEVABLE";
    else
        document.getElementById("calcResults").textContent = "Your average goal for this semester is "+goalTotal.toFixed(3)+"%";
}

function majorCalc(totalNumCourses, major, upcomingCourses, goalMajor){

    var totalCumulative = major * totalNumCourses; //70% = n/33 --> n=2310

    var goalCourses = totalNumCourses + upcomingCourses;
    var goalTotalCumulative = goalMajor * goalCourses; //goal: 72% then multiply by registered courses the upcoming semester with total completed
    var difference = goalTotalCumulative - totalCumulative;

    var goalTotal = difference / upcomingCourses; console.log(goalTotal);

    if(goalTotal>100 || goalTotal < major || goalTotal<0)
        document.getElementById("calcResults").textContent += " and unachievable";
    else
        document.getElementById("calcResults").textContent += "\n\n and Major average of "+goalTotal.toFixed(3)+"%";
}

$(document).ready(function () {
    firebase.auth().onAuthStateChanged(function(user) {
        var db = firebase.firestore();
        var user = firebase.auth().currentUser;
    
        if(user){
        var splitEmail = user.email.split("@"); //Splits the email into 2 strings
              var splitSchoolDomain = splitEmail[1].split("."); //Splits the email into 2 strings by the period
              var username = splitEmail[0]; //takes the username from the initial split email array
              var school = splitSchoolDomain[0];  //takes the schoolname from the splitter array
          
              var docRef = db.collection("student").doc("post-secondary").collection(school).doc(username); //Sets the doc reference
              docRef.get().then(function(doc) { //Gets the document reference and checks for the document
                    
                if (doc.exists){
                    var totalNumCourses = doc.data().totalCourses;
                    var cumulative = doc.data().cumulativeAve;
                    var major = doc.data().majorAve;

                    document.getElementById("totalCourses-calc").textContent = totalNumCourses;
                    document.getElementById("cumulative-calc").textContent = cumulative+"%";
                    document.getElementById("major-calc").textContent = major+"%";
                    console.log(totalNumCourses);

                    $("#registeredCourses").keyup(calculator);
                    $("#goalCumulative").keyup(calculator);
                    $("#goalMajor").keyup(calculator);
                }
                else
                    console.log("ERROR IN calcmyavergae");
            }).catch(function(error){
                console.log(error);
            })
            }
        })




    
});

