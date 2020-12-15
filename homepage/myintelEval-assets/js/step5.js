
    var totalScore = 0;

    var multipleChoices = [3, 6];
        var multipleChoicesScore = [];
        var multipleChoicesTotal = 0;

    var writing = [5, 10];
        var writingScore = [];
        var writingTotal = 0;

    var presentations = [4, 9];
        var presentationsScore = [];
        var presentationsTotal = 0;

    var labs = [1, 8];
        var labsScore = [];
        var labsTotal = 0;


$(function(){
    var storageRef = storageDB.ref();
    var path = '/myintel-storage/evaluationpref-questions/evaluationPreference.txt/';
    var fileRef = storageRef.child(path);

    $('#homeBtn').click(function(){
        location.href = 'index.html';
    });

    $('#infoBtn').click(function(){
        swal({
            id: 'intelInfo',
            title: 'Types of Evalation',
            text: "• Multiple Choices -\n\n"
                +"• Writing -\n\n"
                +"• Presentation -  \n\n"
                +"• Labs -\n\n",
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
                                                            +'<input id=step4checkbox class="form-check-input" type="checkbox" value="">'
                                                            +'<span class="form-check-sign">Agree with terms and conditions</span>'
                                                    +'</label></div>'
                                                    +'<button onclick=load() class="clear">Clear</button>'
                                                    +'<button id=submitBtn onclick=submit() class="submit" disabled>Submit</button>'
                                                +'</div></div>';
                            }
                        }
                    }catch(err){
                        console.log("Error in $function in step5.js");
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


    var total = $('.questions').length; //10

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
     * For the multipleChoices scores
     */
    for(var a=0; a<multipleChoices.length; a++){
        var question = multipleChoices[a]-1;
        var multipleChoicesInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(multipleChoicesInput != undefined || multipleChoicesInput != null){
            multipleChoicesScore.push(multipleChoicesInput);
            totalScore += parseInt(multipleChoicesInput);
            multipleChoicesTotal += parseInt(multipleChoicesInput);
        }
    }

    /**
     * For the writing scores
     */
    for(var a=0; a<writing.length; a++){
        var question = writing[a]-1;
        var writingInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(writingInput != undefined || writingInput != null){
            writingScore.push(writingInput);
            totalScore += parseInt(writingInput);
            writingTotal += parseInt(writingInput);
        }
    }

    /**
     * For the presentations scores
     */
    for(var a=0; a<presentations.length; a++){
        var question = presentations[a]-1;
        var presentationsInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(presentationsInput != undefined || presentationsInput != null){
            presentationsScore.push(presentationsInput);
            totalScore += parseInt(presentationsInput);
            presentationsTotal += parseInt(presentationsInput);
        }
    }

    /**
     * For the Labs scores
     */
    for(var a=0; a<labs.length; a++){
        var question = labs[a]-1;
        var labsInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(labsInput != undefined || labsInput != null){
            labsScore.push(labsInput);
            totalScore += parseInt(labsInput);
            labsTotal += parseInt(labsInput);
        }
    }


    var evaluationList = ['Multiple Choices', 'Writing', 'Presentations', 'Labs'];
    var evaluationScoreArray = [(multipleChoicesTotal/10)*100,
                            (writingTotal/10)*100,
                            (presentationsTotal/10)*100,
                            (labsTotal/10)*100
                            ];

    for(var n=0; n < Math.pow(evaluationScoreArray.length, 2); n++){

        for(var i=0; i < evaluationScoreArray.length; i++){

            if(evaluationScoreArray[i] < evaluationScoreArray[i+1]){

                var temp = evaluationScoreArray[i];
                evaluationScoreArray[i] = evaluationScoreArray[i+1];
                evaluationScoreArray[i+1] = temp;

                var temp = evaluationList[i];
                evaluationList[i] = evaluationList[i+1];
                evaluationList[i+1] = temp;
            }
            
        }

    }
    console.log(evaluationList,evaluationScoreArray );
    var topEvaluationPref = '<p>According to your response, you prefer ' + evaluationList[0] + ' type of evaluation, is this correct? If so, press FINISH, if not, redo.</p>';
    saveStep4(evaluationScoreArray, evaluationList, topEvaluationPref);
};

function saveStep4(evaluationScoreArray, evaluationList, topEvaluationPref){
    var user = userAuth.currentUser;
    var step4Path = firestoreDB.collection("myacadvisor-db").doc("myintel-db")
                        .collection(user.uid).doc('step4-Report');
    
    var docData = {
        MultipleChoices:  evaluationScoreArray[0],
        Writing:  evaluationScoreArray[1],
        Presentations:    evaluationScoreArray[2],
        Labs:    evaluationScoreArray[3]
    };

    step4Path.set(docData).then(function() {
        console.log("Step 5 Report submitted!");
        var title = '<i style="font-size: 18px;">Evaluation Style Results</i>';
        var html = topEvaluationPref + '<div class="chart-container"><canvas id="pieChart" style="width: 50%; height: 50%"></canvas></div>';
        var btnText = 'Finish and go back to homepage <i class="fa flaticon-right-arrow-3"></i>';

        var loadwhat = "../myintelEval-assets/html/myintelstep4.html";
        var loadwhere = "#mainpage";
        
        launchSweetAlertFireStep5(title, html, false, true, btnText, loadwhat, loadwhere); //Located in step1.js
        createPieGraph(evaluationList, evaluationScoreArray);
    });
};

$('#reset').click(function(){
    load("#mainpage","../myintelEval-assets/html/myintelstep5.html");
});

$('#topRight').click(function(){
    window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

$('#step5checkbox').change(function(){
    if($('#step5checkbox').is(":checked")){
        console.log('checked');
        $('#submitBtn').attr('disabled', false);
    }
    else{
        $('#submitBtn').attr('disabled', true);
    }
});

function launchSweetAlertFireStep5(title, htmlContent, outsideClick, confirmBtn, btnText){
    Swal.fire({
        title: title, 
        html: htmlContent,
        showConfirmButton: confirmBtn,
        confirmButtonText: btnText,
        allowOutsideClick: outsideClick
    }).then(function() {
        location.reload();
    });
}