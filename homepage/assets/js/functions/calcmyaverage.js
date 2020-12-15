function loadCalcMyAve() {

                    //document.getElementById("totalCourses-calc").textContent = totalNumCourses;
                    document.getElementById("totalCourses-calc").style.display = "none";
                    //document.getElementById("goalCumulative").placeholder = "CURRENT: "+cumulative+" %";
                    //document.getElementById("goalMajor").placeholder = "CURRENT: "+major+"%";

                    $("#registeredCourses").keyup(calculator);
                    $("#goalCumulative").keyup(calculator);
                    $("#goalMajor").keyup(calculator);

};

function calculator(){
    var goalCumulative = $("#goalCumulative").val();
    var goalMajor = $("#goalMajor").val();
    var courses = parseInt($("#registeredCourses").val());

    var totalNumCourses = parseInt(document.getElementById("totalCourses-calc").textContent);
        
    var cumulativeSplit = (document.getElementById("goalCumulative").placeholder).split(": ");
    var majorSplit = (document.getElementById("goalMajor").placeholder).split(": ");

    var cumulative = parseFloat(cumulativeSplit[1]);
    var major = parseFloat(majorSplit[1]);

    if(courses<=5 && courses>0){
        document.getElementById("calcResults").style.color = "#ffcd24";
        cumulativeCalc(totalNumCourses, cumulative, courses, goalCumulative);
        majorCalc(totalNumCourses, major, courses, goalMajor);
    }
    else if(courses<=0){
        document.getElementById("calcResults").textContent = "Please enter a valid number of upcoming courses";
        document.getElementById("calcResults").style.color = "red";
    }
};

function cumulativeCalc(totalNumCourses, cumulative, upcomingCourses, goalCumulative){

    var totalCumulative = cumulative * totalNumCourses; //70% = n/33 --> n=2310

    var goalCourses = totalNumCourses + upcomingCourses;
    var goalTotalCumulative = goalCumulative * goalCourses; //goal: 72% then multiply by registered courses the upcoming semester with total completed
    var difference = goalTotalCumulative - totalCumulative;

    var goalTotal = difference / upcomingCourses; console.log(goalTotal);
    if(goalTotal>100 ||  goalTotal<0)
        document.getElementById("calcResults").textContent = "Your goal for this semester is UNACHIEVABLE";
    else
        document.getElementById("calcResults").textContent = "Your cumulative goal for this semester is "+goalTotal.toFixed(3)+"%";
};

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
};

