
    var totalScore = 0;
    var logic = [14,17,25,27,34,38,52,55,64,68]; var logicScore = []; var logicTotal = 0;
    var naturalist = [23,39,45,51,66,67,74,77,78,79]; var naturalistScore = []; var naturalistTotal = 0;
    var intrapersonal = [6,19,20,21,22,35,53,54,58,76]; var intrapersonalScore = [];    var intrapersonalTotal = 0;
    var interpersonal = [8,10,26,28,29,32,46,59,60,71]; var interpersonalScore = [];    var interpersonalTotal = 0;
    var musical = [11,15,30,31,37,44,48,61,62,75]; var musicalScore = [];   var musicalTotal = 0;
    var kinesthetic = [1,5,24,36,47,49,56,57,72,73]; var kinestheticScore = []; var kinestheticTotal = 0;
    var visual = [2,3,4,9,12,13,33,40,50,69]; var visualScore = []; var visualTotal = 0;
    var linguistic = [7,16,18,41,42,43,63,65,70,80]; var linguisticScore = [];  var linguisticTotal = 0;

$(function(){
    var storageRef = storageDB.ref();
    var path = '/myintel-storage/intelligence-questions/myintelquestions.txt/';
    var fileRef = storageRef.child(path);

    $('#homeBtn').click(function(){
        location.href = 'index.html';
    });

    $('#infoBtn').click(function(){
        swal({
            id: 'intelInfo',
            title: 'MyIntel Strengths',
            text: "• Logical-Mathematical\n• Musical-Rhythmic\n• Visual-Spatial\n• Verbal-linguistic\n• Logical-Mathematical\n"
                +"• Modily-kinesthetic\n• Interpersonal\n• Intrapersonal\n• Naturalistic\n",
            icon: 'info',
            
        });
        var info = document.getElementById('intelInfo');
        //info.style.textAlign = 'left'; //doesnt work
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
                                                            +'<input id=step1checkbox class="form-check-input" type="checkbox" value="">'
                                                            +'<span class="form-check-sign">Agree with terms and conditions</span>'
                                                    +'</label></div>'
                                                    +'<button onclick=load() class="clear">Clear</button>'
                                                    +'<button id=submitBtn onclick=submit() class="submit" disabled>Submit</button>'
                                                +'</div></div>';
                                        
                                    
                                
                                
                               // $('#formPanel').append(submitHTML);
                            }
                        }
                    }catch(err){
                        console.log("Error in $function in step1.js");
                        console.log(err);
                    }
                }
            }
        }   
    }).catch(function(error) {
        swal("Welcome!", "It is mandatory to upload a transcript upon your first log in!", {
                                icon : "warning",
                                buttons: {        			
                                    confirm: {
                                        text: 'Upload here',
                                        className : 'btn-warning'
                                    }
                                },
                            }).then(function() {
                                $('#file').trigger('click');
                            });
    });
})

function submit(){
    var choiceArray = [];
    var totalScore = 0;



    var total = $('.questions').length; //80
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
     * For the logic-mathematical scores
     */
    for(var a=0; a<logic.length; a++){
        var question = logic[a]-1;
        var logicInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(logicInput != undefined || logicInput != null){
            logicScore.push(logicInput);
            totalScore += parseInt(logicInput);
            logicTotal += parseInt(logicInput);
        }
    }

    /**
     * For the naturalistic score array
     */
    for(var a=0; a<naturalist.length; a++){
        var question = naturalist[a]-1;
        var naturalistInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(naturalistInput != undefined || naturalistInput != null){
            naturalistScore.push(naturalistInput);
            totalScore += parseInt(naturalistInput);
            naturalistTotal += parseInt(naturalistInput);
        }
    }

    /**
     * For the intrapersonal score array
     */
    for(var a=0; a<intrapersonal.length; a++){
        var question = intrapersonal[a]-1;
        var intrapersonalInput = $('input[class="choice'+question+'"]:checked').val();

        if(intrapersonalInput != undefined || intrapersonalInput != null){
            intrapersonalScore.push(intrapersonalInput);
            totalScore += parseInt(intrapersonalInput);
            intrapersonalTotal += parseInt(intrapersonalInput);
        }
    }

    /**
     * For the interpersonal scoer array
     */
    for(var a=0; a<interpersonal.length; a++){
        var question = interpersonal[a]-1;
        var interpersonalInput = $('input[class="choice'+question+'"]:checked').val();

        if(interpersonalInput != undefined || interpersonalInput != null){
            interpersonalScore.push(interpersonalInput);
            totalScore += parseInt(interpersonalInput);
            interpersonalTotal += parseInt(interpersonalInput);
        }
    }

    /**
     * For the musical score array
     */
    for(var a=0; a<musical.length; a++){
        var question = musical[a]-1;
        var musicalInput = $('input[class="choice'+question+'"]:checked').val();

        if(musicalInput != undefined || musicalInput != null){
            musicalScore.push(musicalInput);
            totalScore += parseInt(musicalInput);
            musicalTotal += parseInt(musicalInput);
        }
    }

    /**
     * For the kinesthetic score array
     */
    for(var a=0; a<kinesthetic.length; a++){
        var question = kinesthetic[a]-1;
        var kinestheticInput = $('input[class="choice'+question+'"]:checked').val();

        if(kinestheticInput != undefined || kinestheticInput != null){
            kinestheticScore.push(kinestheticInput);
            totalScore += parseInt(kinestheticInput);
            kinestheticTotal += parseInt(kinestheticInput);
        }

    }


    /**
     *  For the visual score array
     */
    for(var a=0; a<visual.length; a++){
        var question = visual[a]-1;
        var visualInput = $('input[class="choice'+question+'"]:checked').val();
        if(visualInput != undefined || visualInput != null){
            visualScore.push(visualInput);
            totalScore += parseInt(visualInput);
            visualTotal += parseInt(visualInput);
        }
    }

    /**
     * For linguistic score array
     */
    for(var a=0; a<linguistic.length; a++){
        var question = linguistic[a]-1;
        var linguisticInput = $('input[class="choice'+question+'"]:checked').val();


        if(linguisticInput != undefined || linguisticInput != null){
            linguisticScore.push(linguisticInput);  //Array of scores
            totalScore += parseInt(linguisticInput);
            linguisticTotal += parseInt(linguisticInput); //Total score for linguistic
        }
    }
    var intelScoreArray = [ (logicTotal/50)*10,
                            (kinestheticTotal/50)*10,
                            (musicalTotal/50)*10,
                            (linguisticTotal/50)*10,
                            (visualTotal/50)*10, 
                            (naturalistTotal/50)*10,
                            (interpersonalTotal/50)*10,
                            (intrapersonalTotal/50)*10];
                            
    console.log(logicScore,naturalistScore,intrapersonalScore, interpersonalScore, musicalScore, kinestheticScore,visualScore, linguisticScore);
    console.log(logicTotal,naturalistTotal,intrapersonalTotal, interpersonalTotal, musicalTotal, kinestheticTotal,visualTotal, linguisticTotal);


    var intelligenceList = ['Logic', 'Kinesthetic', 'Musical', 'Linguistic', 'Visual', 'Naturalistic', 'Interpersonal', 'Intrapersonal'];
    saveToDatabase(intelScoreArray, intelligenceList);
};

function saveToDatabase(intelScoreArray, intelligenceList){
    var user = userAuth.currentUser;
    var firestorePath = firestoreDB.collection("myacadvisor-db").doc("myintel-db")
                        .collection(user.uid).doc('step1-Report');
    
    var docData = {
        Logic:  intelScoreArray[0],
        Kinesthetic:  intelScoreArray[1],
        Musical:    intelScoreArray[2],
        Linguistic: intelScoreArray[3],
        Visual: intelScoreArray[4],
        Naturalistic:   intelScoreArray[5],
        Interpersonal:  intelScoreArray[6],
        Intrapersonal:  intelScoreArray[7],
    };
    firestorePath.set(docData).then(function() {
        console.log("Report submitted!");
        var title = '<i>myIntel Results</i>';
        var html = '<div id="chart-container"><canvas id="results"></canvas></div>';
        var btnText = 'Proceed to Step 2 <i class="fa flaticon-right-arrow-3"></i>';

        var loadwhat = "../myintelEval-assets/html/myintelstep2.html";
        var loadwhere = "#mainpage";

        launchSweetAlertFire(title, html, false, true, btnText, loadwhat, loadwhere);
        createGraph(intelScoreArray, intelligenceList);
    });
};

function launchSweetAlertFire(title, htmlContent, outsideClick, confirmBtn, btnText, loadwhat, loadwhere){
    Swal.fire({
        title: title, 
        html: htmlContent,
        showConfirmButton: confirmBtn,
        confirmButtonText: btnText,
        allowOutsideClick: outsideClick
    }).then(function() {
        load(loadwhere,loadwhat);
    });
}

function createGraph(intelScoreArray,intelligenceList){
    var semesterGraph = document.getElementById('results').getContext('2d');

    
                    
	var semesterGraph = new Chart(semesterGraph, {
			type: 'bar',
			data: {
                labels: intelligenceList,
				datasets : [{
                    label: "Score",
                    max: 10,
					backgroundColor: 'rgb(23, 125, 255)',
					borderColor: 'rgb(23, 125, 255)',
                    data: intelScoreArray,
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

$('#reset').click(function(){
    load("#mainpage","../myintelEval-assets/html/myintelstep1.html");
});

$('#topRight').click(function(){
    window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

$('#step1checkbox').change(function(){
    if($('#step1checkbox').is(":checked")){
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