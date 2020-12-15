var user = userAuth.currentUser;
var step2ReportPath = firestoreDB.collection("myacadvisor-db").doc("myintel-db").collection(user.uid).doc('step2-Report');
var step2Status = 'in progress';
$(function(){
    //Sets the doc reference
    var docRef = firestoreDB.collection("myacadvisor-db").doc("myintel-db").collection(user.uid).doc('step1-Report');
                  
    docRef.get().then(function(doc) { //Gets the document reference and checks for the document

        if (doc.exists){

            var intelligenceList = ['Logic', 'Kinesthetic', 'Musical', 'Linguistic', 'Visual', 'Naturalistic', 'Interpersonal', 'Intrapersonal'];
            var strengths = [];
    
                    /**for( var i = 0; i < intelligenceList.length; i++){
                        strengths.push(intelligenceList[i].toLowerCase());
                    }**/
                    
            var unfilteredData = [];

            var logic = doc.data().Logic;
            var kinesthetic = doc.data().Kinesthetic;
            var musical = doc.data().Musical;
            var linguistic = doc.data().Linguistic;
            var visual = doc.data().Visual;
            var naturalistic = doc.data().Naturalistic;
            var interpersonal = doc.data().Interpersonal;
            var intrapersonal = doc.data().Intrapersonal;

            unfilteredData.push(logic);
            unfilteredData.push(kinesthetic);
            unfilteredData.push(musical);
            unfilteredData.push(linguistic);
            unfilteredData.push(visual);
            unfilteredData.push(naturalistic);
            unfilteredData.push(interpersonal);
            unfilteredData.push(intrapersonal);
            //console.log(unfilteredData);
                
            //Squared of the length to ensure that it is sorted thoroughly
            for(var p=0; p < Math.pow(unfilteredData.length, 2); p++){

                for(var m=0; m < unfilteredData.length; m++){
                        
                    if(unfilteredData[m] > unfilteredData[m+1]){

                        var temp = unfilteredData[m];
                        unfilteredData[m] = unfilteredData[m+1];
                        unfilteredData[m+1] = temp;

                        var temp = intelligenceList[m];
                        intelligenceList[m] = intelligenceList[m+1];
                        intelligenceList[m+1] = temp;
                    }
                }
            }

            var strengthData = [];
            var weakData = [];
            var strLine = '';
            var wkLine = '';

            for(var n=0; n<8; n++){
                if(4 <= n){
                    strengthData.push(unfilteredData[n]);
                    weakData.push(0);
                    strLine+=intelligenceList[n]+',';
                }
                else{
                    weakData.push(unfilteredData[n]);
                    strengthData.push(0);
                    wkLine+=intelligenceList[n]+',';
                }
            }
                    
            drawChartData(intelligenceList, strengthData, weakData, unfilteredData, 'center');

            var removeWeakness = strLine.split(',');
            removeWeakness.pop();
            $('#strengthsReport').text(removeWeakness.toString());
        }
        //End of if(exists)

    }).catch(function(error) { //Catch any retrieval error
        console.log("Error in $function in step2.js");
        console.log(error);
    });
});

/**
 * Once the start button is press then do this
 * - Launch the timer
 * - Launch the quiz in step2Quiz.js
 */
$('#start-btn').click(function(){
    
    var strengths = $('#strengthsReport').text();
    var strengthsArray = strengths.split(',');
    var questionsPathArray = [];
    var firestoreSetup = [];

    for(var i=0; i<strengthsArray.length; i++){
        //$('#'+removeWeakArray[i]+'btn').remove();
        switch(strengthsArray[i]){
            case 'Logic':
                questionsPathArray.push('/myintel-storage/iqtest-questions/logical.txt/'); break;
            case 'Kinesthetic':
                questionsPathArray.push('/myintel-storage/iqtest-questions/kinesthetic.txt/'); break;
            case 'Musical':
                questionsPathArray.push('/myintel-storage/iqtest-questions/musical.txt/'); break;
            case 'Linguistic':
                questionsPathArray.push('/myintel-storage/iqtest-questions/linguistic.txt/'); break;
            case 'Visual':
                questionsPathArray.push('/myintel-storage/iqtest-questions/visual.txt/'); break;
            case 'Naturalistic':
                questionsPathArray.push('/myintel-storage/iqtest-questions/naturalist.txt/'); break;
            case 'Interpersonal':
                questionsPathArray.push('/myintel-storage/iqtest-questions/interpersonal.txt/'); break;
            case 'Intrapersonal':  
                questionsPathArray.push('/myintel-storage/iqtest-questions/intrapersonal.txt/'); break;
        }
    firestoreSetup.push(strengthsArray[i]+": "+0);
    }

    var docData = {
        step2Results: firestoreSetup
    }

    step2ReportPath.set(docData).then(function() {
        console.log("Step 2 Setup is succesful!");
    });


    $('#termsAndConditions').remove();
    $('#radarChart').remove();

    $('#step2Content').html('<div id=timerDiv><h4 id=timer></h4></div>');
    //document.getElementById("step2Content").innerHTML = '<div id=timerDiv><h4 id=timer></h4></div>';
    var quizHTML = '<div data-aos="fade-in" data-aos-duration="3000" id="quiz-header">'
                    +'<h4>You will have 5 minutes to answer as many questions as possible to test your intellectual capabilities under pressure. Are you ready?</h4></div>'
                    +"<div data-aos='fade-in' data-aos-duration='3000' id='quiz-start-screen' style='padding-top: 2%;'>"
                    +"<p><a href='#' id='quiz-start-btn' class='btn-lg btn-secondary'>I'M READY!</a></p></div>";

    $('#quiz').append(quizHTML);
    generateQuiz(questionsPathArray);

    setTimeout(function(){

        $('#quiz-header').removeAttr('data-aos');
        $('#quiz-start-screen').removeAttr('data-aos');
            
    }, 3000);

});

/**
 * This is to ensure that the checkbox is checked before starting the quiz
 */
$('#step2checkbox').change(function(){

    if($('#step2checkbox').is(":checked")){
        $('#start-btn').attr('disabled', false);
    }
    else{
        $('#start-btn').attr('disabled', true);
    }

});

//Once the test is done, user can view the final results
$('#viewFinalResults').click(function(){
    
    step2ReportPath.get().then(function(doc) {
        if(doc.exists){

            var resultsArray = doc.data().step2Results;
            var iqScores = doc.data().step2Scores;
            var intelligences = [];

            //Since the value taken from setp2Results is "Logical: 3", so we split those into 2 values, left and right side
            for(var i=0; i<resultsArray.length;i++){
                var split = resultsArray[i].split(": ");
                intelligences.push(split[0]);
            }

            //Sort the array so the lowest value is placed to the very right ready to be popped out of the array
            for(var n=0; n<Math.pow(intelligences.length, 2); n++){
                for(var i=0; i<intelligences.length;i++){
                    if(parseInt(iqScores[i]) < parseInt(iqScores[i+1])){
                        var temp = intelligences[i];
                        intelligences[i] = intelligences[i+1];
                        intelligences[i+1] = temp;

                        var temp = iqScores[i];
                        iqScores[i] = iqScores[i+1];
                        iqScores[i+1] = temp;
                    }
                }
            }
            
            //If there are four intellegences saved then pop the lowest one
            if(intelligences.length == 4 && iqScores.length == 4){
            intelligences.pop(); iqScores.pop();
            }
            
        
    var title = '<i>IQ Test Results</i>';
    var html = '<p>We have taken your top 3 results to determine your top intellectual strengths. The results shown below are taken from your intellectual performance under pressure.</p>'
                +'<div class="chart-container"><canvas id="pieChart" style="width: 50%; height: 50%"></canvas></div>';
    var btnText = 'Proceed to Step 3 <i class="fa flaticon-right-arrow-3"></i>';

    var loadwhat = "../myintelEval-assets/html/myintelstep3.html";
    var loadwhere = "#mainpage";
    
    launchSweetAlertFire(title, html, false, true, btnText, loadwhat, loadwhere);

    createPieGraph(intelligences, iqScores);
    }});
});

//This is to start the timer
function startTimer(){
    $('#quiz-header').remove(); //Remove the header
    
        // Set the date we're counting down to
        var d = new Date();
        var min = d.getSeconds() + 2; //+ 5 minutes
        var countDownDate = d.setSeconds(min);
    
        // Update the count down every 1 second
        var x = setInterval(function() {

            // Get today's date and time
            var now = new Date().getTime();
                
            // Find the distance between now and the count down date
            var distance = countDownDate - now;
                
            // Time calculations for days, hours, minutes and seconds
            var days = Math.floor(distance / (1000 * 60 * 60 * 24));
            var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            var seconds = Math.floor((distance % (1000 * 60)) / 1000);

            //If there are less than 10 seconds left then make it a double value
            if(seconds<10){
                seconds = '0'+seconds;
            }
    
            // Output the result in an element with id="demo"
            document.getElementById("timer").innerHTML = "Time remaining: 0" + minutes + ":" + seconds;
            switch(minutes){
                case 0: document.getElementById("timer").style.color = 'red';break;
                case 1: document.getElementById("timer").style.color = '#ff8c00';break;
                default: document.getElementById("timer").style.color = 'green';break;
            }

            // If the count down is over or if the user finishes the test before time runs out
            if (distance <= 0 || step2Status == 'finished') {
                clearInterval(x);

                $('#quiz-finish-btn').trigger('click'); //If time runs out then trigger to finish

                //2 cases where the time expires or the user finishes first
                if(distance <= 0)
                    document.getElementById("timer").innerHTML = "TIMER HAS EXPIRED";
                else
                    document.getElementById("timer").innerHTML = "";

                document.getElementById('viewFinalResults').style.display = 'inline-block';
            }
        }, 0); //<-- I put zero to ensure that there are NO delays
};

//Pie graph for the step 2 results
function createPieGraph(intelligences, iqScores){
    var myPieChart = new Chart(pieChart, {
        type: 'pie',
        data: {
            datasets: [{
                data: iqScores,
                backgroundColor :["#1d7af3","#f3545d","#fdaf4b"],
                borderWidth: 0
            }],
            labels: intelligences 
        },
        options : {
            responsive: true, 
            maintainAspectRatio: false,
            legend: {
                position : 'bottom',
                labels : {
                    fontColor: 'rgb(154, 154, 154)',
                    fontSize: 11,
                    usePointStyle : true,
                    padding: 20
                }
            },
            pieceLabel: {
                render: 'percentage',
                fontColor: 'white',
                fontSize: 14,
            },
            tooltips: false,
            layout: {
                padding: {
                    left: 20,
                    right: 20,
                    top: 20,
                    bottom: 20
                }
            }
        }
    })
};