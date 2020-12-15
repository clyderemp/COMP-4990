
    var totalScore = 0;

    var engineering = [8, 9, 13, 21, 23]; var engineeringScore = []; var engineeringTotal = 0;
    var humanKinetics = [3, 10, 11, 22, 26]; var humanKineticsScore = []; var humanKineticsTotal = 0;
    var nursing = [1, 6, 12, 14, 17]; var nursingScore = []; var nursingTotal = 0;
    var fahss = [2, 7, 15, 24, 29]; var fahssScore = []; var fahssTotal = 0;
    var science = [4, 18, 20, 25, 28]; var scienceScore = []; var scienceTotal = 0;
    var business = [5, 16, 19, 27, 30]; var businessScore = []; var businessTotal = 0;

$(function(){
    var storageRef = storageDB.ref();
    var path = '/myintel-storage/interest-questions/interestQuestions.txt/';
    var fileRef = storageRef.child(path);

    $('#homeBtn').click(function(){
        location.href = 'index.html';
    });

    $('#infoBtn').click(function(){
        swal({
            id: 'intelInfo',
            title: 'Faculties',
            text: "• Engineering\n• Human Kinetics\n• Nursing\n• FAHSS\n• Sciences\n• Business\n",
            icon: 'info',
            
        });
    });

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
                    var final = [];
                    
                    try{
                        var data1 = data.split('\n');
                            
                        for(var i=0; i<=data1.length; i++){
                        
                            if(i<data1.length){
                                final.push(data1[i].trim());
                                
                                var htmlBody = '<label class="statement">'+data1[i].trim()+'</label>'
                                                +'<ul class="questions">'
                                                    +'<li>'
                                                        +'<input class=choice'+i+' type="radio" value=1 name="action'+i+'">'
                                                        +'<label>Strongly Disagree</label>'
                                                    +'</li>'
                                                    +'<li>'
                                                        +'<input class=choice'+i+' type="radio" value=2 name="action'+i+'">'
                                                        +'<label>Somewhat Disagree</label>'
                                                    +'</li>'
                                                    +'<li>'
                                                        +'<input class=choice'+i+' type="radio"  value=3 name="action'+i+'">'
                                                        +'<label>Neutral</label>'
                                                    +'</li>'
                                                    +'<li>'
                                                        +'<input class=choice'+i+' type="radio" value=4 name="action'+i+'">'
                                                        +'<label>Somewhat Agree</label>'
                                                    +'</li>'
                                                    +'<li>'
                                                        +'<input class=choice'+i+' type="radio" value=5 name="action'+i+'">'
                                                        +'<label>Strongly Agree</label>'
                                                    +'</li>'
                                                +'</ul>';

                                $('#formPanel').append(htmlBody);
                            }
                            else{
                                var submitHTML = '<div class="row"><div class="col-md-12 buttons" style="text-align: center;">'
                                                    +'<a href="#">View Terms and Conditions</a>'
                                                    +'<div class="form-check"><label class="form-check-label">'
                                                            +'<input id=step3checkbox class="form-check-input" type="checkbox" value="">'
                                                            +'<span class="form-check-sign">Agree with terms and conditions</span>'
                                                    +'</label></div>'
                                                    +'<button onclick=load() class="clear">Clear</button>'
                                                    +'<button id=submitBtn onclick=submit() class="submit" disabled>Submit</button>'
                                                +'</div></div>';
                            }
                        }
                    }catch(err){
                        console.log("Error in $function in step3.js");
                        console.log(err);
                    }
                }
            }
        }   
    }).catch(function(error) {
    });
})

function submit(){
    var choiceArray = [];
    var totalScore = 0;


    var total = $('.questions').length; //30
    var choices = $('.questions .choice').length;

    for(var i=0; i<total; i++){
        var input = $('input[class="choice'+i+'"]:checked').val();

        if(input!=undefined || input!=null || input > 0){
            choiceArray.push(input);
            totalScore += parseInt(input);
        }
        
    }
    getIntelScore();
};

function getIntelScore(){
    /**
     * For the engineering-mathematical scores
     */
    for(var a=0; a<engineering.length; a++){
        var question = engineering[a]-1;
        var engineeringInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(engineeringInput != undefined || engineeringInput != null){
            engineeringScore.push(engineeringInput);
            totalScore += parseInt(engineeringInput);
            engineeringTotal += parseInt(engineeringInput);
        }
    }

    /**
     * For the humanKinetics-mathematical scores
     */
    for(var a=0; a<humanKinetics.length; a++){
        var question = humanKinetics[a]-1;
        var humanKineticsInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(humanKineticsInput != undefined || humanKineticsInput != null){
            humanKineticsScore.push(humanKineticsInput);
            totalScore += parseInt(humanKineticsInput);
            humanKineticsTotal += parseInt(humanKineticsInput);
        }
    }

    /**
     * For the nursing-mathematical scores
     */
    for(var a=0; a<nursing.length; a++){
        var question = nursing[a]-1;
        var nursingInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(nursingInput != undefined || nursingInput != null){
            nursingScore.push(nursingInput);
            totalScore += parseInt(nursingInput);
            nursingTotal += parseInt(nursingInput);
        }
    }

    /**
     * For the FAHSS scores
     */
    for(var a=0; a<fahss.length; a++){
        var question = fahss[a]-1;
        var fahssInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(fahssInput != undefined || fahssInput != null){
            fahssScore.push(fahssInput);
            totalScore += parseInt(fahssInput);
            fahssTotal += parseInt(fahssInput);
        }
    }

    /**
     * For the Sciences scores
     */
    for(var a=0; a<science.length; a++){
        var question = science[a]-1;
        var scienceInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(scienceInput != undefined || scienceInput != null){
            scienceScore.push(scienceInput);
            totalScore += parseInt(scienceInput);
            scienceTotal += parseInt(scienceInput);
        }
    }

    /**
     * For the Business scores
     */
    for(var a=0; a<business.length; a++){
        var question = business[a]-1;
        var businessInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(businessInput != undefined || businessInput != null){
            businessScore.push(businessInput);
            totalScore += parseInt(businessInput);
            businessTotal += parseInt(businessInput);
        }
    }
 
    var facultyScoreArray = [(engineeringTotal/25)*10,
                            (humanKineticsTotal/25)*10,
                            (nursingTotal/25)*10,
                            (fahssTotal/25)*10,
                            (scienceTotal/25)*10,
                            (businessTotal/25)*10,
                            ];
    var facultyList = ['Engineering', 'Human Kinetics', 'Nursing', 'FAHSS', 'Science', 'Business'];

    saveStep3(facultyScoreArray, facultyList);
};

function saveStep3(facultyScoreArray, facultyList){
    var user = userAuth.currentUser;
    var step3Path = firestoreDB.collection("myacadvisor-db").doc("myintel-db")
                        .collection(user.uid).doc('step3-Report');
    
    var docData = {
        engineering:  facultyScoreArray[0],
        humanKinetics:  facultyScoreArray[1],
        nursing:    facultyScoreArray[2],
        fahss: facultyScoreArray[3],
        science: facultyScoreArray[4],
        business:   facultyScoreArray[5]
    };
    step3Path.set(docData).then(function() {
        console.log("Step 3 Report submitted!");
        var title = '<i style="font-size: 18px;">Your Interest-Faculty Match Results</i>';
        var html = '<div id="chart-container"><canvas id="results"></canvas></div>';
        var btnText = 'Proceed to Step 4 <i class="fa flaticon-right-arrow-3"></i>';

        var loadwhat = "../myintelEval-assets/html/myintelstep4.html";
        var loadwhere = "#mainpage";
        
        launchSweetAlertFire(title, html, false, true, btnText, loadwhat, loadwhere);
        createFacultyGraph(facultyScoreArray, facultyList);
    });
};

function createFacultyGraph(facultyScoreArray , facultyList){
    var facultyGraph = document.getElementById('results').getContext('2d');

	var facultyGraph = new Chart(facultyGraph, {
			type: 'bar',
			data: {
                labels: facultyList,
				datasets : [{
                    label: "Faculty Match Score",
                    max: 10,
					backgroundColor: 'rgb(23, 125, 255)',
					borderColor: 'rgb(23, 125, 255)',
                    data: facultyScoreArray,
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
                    ticks: {
                        autoSkip: false
                    }          
				}]
			},
		}
	});
}

$('#reset').click(function(){
    load("#mainpage","../myintelEval-assets/html/myintelstep3.html");
});

$('#topRight').click(function(){
    window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

$('#step3checkbox').change(function(){
    if($('#step3checkbox').is(":checked")){
        console.log('checked');
        $('#submitBtn').attr('disabled', false);
    }
    else{
        $('#submitBtn').attr('disabled', true);
    }
});

function tester(){
    var total = $('.questions').length; //80
    var choices = $('.questions .choice').length;
    var choiceArray = [];
    for(var i=0; i<total; i++){
        var input = $('input[class="choice'+i+'"]:checked').trigger('click');

        if(input!=undefined || input!=null || input > 0){
            choiceArray.push(input);
        }
        
    }
    console.log(choiceArray);
}