$(document).ready(function () {
/*
    document.getElementById("myCoursePlannerInfo").textContent = "Need help finding courses? We are here to help you figure out the best suitable courses for based on your preferred workload, degree of difficulty, learning and evaluation style and MORE!"
    document.getElementById("myCareerInfo").textContent = "Let us help you find your destined career in life";
    document.getElementById("myAcAdvisorInfo").textContent = "Want any Academic Advising? We've innovated an AI-based academic advisor that can help you OR you can have a live chat with a human advisor!"
    document.getElementById("myCampusEventsInfo").textContent = "You can now have access to all the activities and events happening live on campus!";
    document.getElementById("myIntelCalcInfo").textContent = "Use our myIntel Calculator to calculate your intellectual capabilities to help you with your academic journey!";
    document.getElementById("myCampusInfo").textContent = "Visit your own campus website for any further information you would like to access.";
    */
})

function openServiceSite(service){
    switch(service){
        case "mycourseplanner":
            window.location.href = "../searchpage/index.html";
    }
}