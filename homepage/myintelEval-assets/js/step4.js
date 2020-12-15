
    var totalScore = 0;

    var kinestheticLearning = [6, 7, 8, 9, 16, 18, 19, 22, 26, 27, 31, 35, 38];
        var kinestheticLearningScore = [];
        var kinestheticLearningTotal = 0;

    var auditoryLearning = [5, 12, 13, 15, 17, 23, 25, 28, 29, 32, 33, 34, 36];
        var auditoryLearningScore = [];
        var auditoryLearningTotal = 0;

    var visualLearning = [1, 2, 3, 4, 10, 11, 14, 20, 21, 24, 30, 37, 39];
        var visualLearningScore = [];
        var visualLearningTotal = 0;

$(function(){
    var storageRef = storageDB.ref();
    var path = '/myintel-storage/learningstyle-questions/learningStyles.txt/';
    var fileRef = storageRef.child(path);

    $('#homeBtn').click(function(){
        location.href = 'index.html';
    });

    $('#infoBtn').click(function(){
        swal({
            id: 'intelInfo',
            title: 'Different General Types of Learning',
            text: "• Kinesthetic Learning - You like to learn and apply your knowledge through hands-on application.\n\n"
                    +"• Auditory Learning - You learn best in lectures and seminars as you listen and learnign more effectively that way.\n\n"
                    +"• Visual Learning - You tend to understand more of the lesson when you see it with your own eyes and create a photographic memory of how it's supposed to work.",
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
                        console.log("Error in $function in step4.js");
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


    var total = $('.questions').length; //39

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
     * For the kinestheticLearning scores
     */
    for(var a=0; a<kinestheticLearning.length; a++){
        var question = kinestheticLearning[a]-1;
        var kinestheticLearningInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(kinestheticLearningInput != undefined || kinestheticLearningInput != null){
            kinestheticLearningScore.push(kinestheticLearningInput);
            totalScore += parseInt(kinestheticLearningInput);
            kinestheticLearningTotal += parseInt(kinestheticLearningInput);
        }
    }

    /**
     * For the Auditory scores
     */
    for(var a=0; a<auditoryLearning.length; a++){
        var question = auditoryLearning[a]-1;
        var auditoryLearningInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(auditoryLearningInput != undefined || auditoryLearningInput != null){
            auditoryLearningScore.push(auditoryLearningInput);
            totalScore += parseInt(auditoryLearningInput);
            auditoryLearningTotal += parseInt(auditoryLearningInput);
        }
    }

    /**
     * For the Visual scores
     */
    for(var a=0; a<visualLearning.length; a++){
        var question = visualLearning[a]-1;
        var visualLearningInput = $('input[class="choice'+question+'"]:checked').val();
        
        if(visualLearningInput != undefined || visualLearningInput != null){
            visualLearningScore.push(visualLearningInput);
            totalScore += parseInt(visualLearningInput);
            visualLearningTotal += parseInt(visualLearningInput);
        }
    }

    var learningStyleList = ['Kinesthetic', 'Auditory', 'Visual'];
    var learningStyleScoreArray = [(kinestheticLearningTotal/65)*100,
                            (auditoryLearningTotal/65)*100,
                            (visualLearningTotal/65)*100
                            ];
                            console.log(learningStyleList,learningStyleScoreArray );                
    for(var n=0; n < Math.pow(learningStyleScoreArray.length, 2); n++){
        for(var i=0; i < learningStyleScoreArray.length; i++){
            if(learningStyleScoreArray[i] < learningStyleScoreArray[i+1]){
                var temp = learningStyleScoreArray[i];
                learningStyleScoreArray[i] = learningStyleScoreArray[i+1];
                learningStyleScoreArray[i+1] = temp;

                var temp = learningStyleList[i];
                learningStyleList[i] = learningStyleList[i+1];
                learningStyleList[i+1] = temp;
            }
        console.log(i);
        }
    }
    console.log(learningStyleList,learningStyleScoreArray );
    var topLearningStyle = '<p>Based on your top match score of '+ (learningStyleScoreArray[0].toFixed(0)) +'%. You excel the best when you use your '
                            + learningStyleList[0] + ' Learning Skills.</p>';
    saveStep4(learningStyleScoreArray, learningStyleList, topLearningStyle);
};

function saveStep4(learningStyleScoreArray, learningStyleList, topLearningStyle){
    var user = userAuth.currentUser;
    var step4Path = firestoreDB.collection("myacadvisor-db").doc("myintel-db")
                        .collection(user.uid).doc('step4-Report');
    
    var docData = {
        Kinesthetic:  learningStyleScoreArray[0],
        Auditory:  learningStyleScoreArray[1],
        Visual:    learningStyleScoreArray[2]
    };

    step4Path.set(docData).then(function() {
        console.log("Step 4 Report submitted!");
        var title = '<i style="font-size: 18px;">Learning Style Results</i>';
        var html = topLearningStyle + '<div class="chart-container"><canvas id="pieChart" style="width: 50%; height: 50%"></canvas></div>';
        var btnText = 'Proceed to Step 5 <i class="fa flaticon-right-arrow-3"></i>';

        var loadwhat = "../myintelEval-assets/html/myintelstep5.html";
        var loadwhere = "#mainpage";
        
        launchSweetAlertFire(title, html, false, true, btnText, loadwhat, loadwhere);
        createPieGraph(learningStyleList, learningStyleScoreArray);
    });
};

$('#reset').click(function(){
    load("#mainpage","../myintelEval-assets/html/myintelstep4.html");
});

$('#topRight').click(function(){
    window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
});

$('#step4checkbox').change(function(){
    if($('#step4checkbox').is(":checked")){
        console.log('checked');
        $('#submitBtn').attr('disabled', false);
    }
    else{
        $('#submitBtn').attr('disabled', true);
    }
});