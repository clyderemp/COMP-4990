//For the scores collected from the test. Goes up by 1 everytime correct answer is picked
var logical = 0;
var kinesthetic = 0;
var musical = 0;
var linguistic = 0;
var visual = 0;
var naturalist = 0;
var interpersonal = 0;
var intrapersonal = 0;

//Arrays used to eventually save data to the database
var stringArray = [];
var scoreArray = [];

//String used to save into stringArray[] and saved to database
var logicStr = '';
var kinStr = '';
var musicStr = '';
var lingStr = '';
var visStr = '';
var natureStr = '';
var interStr = '';
var intraStr = '';

//This is the length of questions answer to be used for calculating percentage like -> total correct / total attempted
var logicalLength = 0;
var kinestheticLength = 0;
var musicalLength = 0;
var linguisticLength = 0;
var visualLength = 0;
var naturalistLength = 0;
var interpersonalLength = 0;
var intrapersonalLength = 0;

function generateQuiz(path) {

    var questionsArray = [];    //Array for all the questions
    var answersArray = [];      //Array for all the answers per questions
    var correctAnswerArray = [];   //Array for all correct indexes per questions
    var counter = 0;            //Counter of intelligences, will eventually stop when 4 is reached

    //for all 4 strong intelligences, grab the path files for questions from firebase storage
    for(var m=0; m<4; m++){

        var fileRef = storageDB.ref().child(path[m]);

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
                        
                        try{
                            var data1 = (data.trim()).split('\n');

                            var b=2;    //Starting index for answers
                            for(var a=1; a < data1.length; a+=2){
                                
                                var question = data1[a].split(')');
                                var string = (data1[0]+' Question:'+question[1]).toString();
                                    questionsArray.push(string);


                                var takeCorrectIndex = data1[b].split('-->');
                                var removeLeftBracket = takeCorrectIndex[0].replace("{", "");
                                var removeRightBracket = removeLeftBracket.replace("}", "");

                                answersArray.push(removeRightBracket);
                                correctAnswerArray.push(parseInt(takeCorrectIndex[1]));
                                //console.log(answersArray,correctAnswerArray);
                                b+=2;
                            }
                            counter++; //Counter for the question files loaded. Should be 4 files as top 4 strengths are being tested

                            //Once all 4 files are loading into the arrays then finalize and build the quiz
                            if(counter >= 4){
                                finalizeQuiz(questionsArray, answersArray, correctAnswerArray);
                            }

                        }catch(err){
                            console.log("Error in $function in loader.js");
                            console.log(err);
                        }
                    }
                }
            }
        })
    }            
};

function finalizeQuiz(questionsArray, answersArray, correctAnswerArray){

    var questionDataArray = [];

    for(var i=0; i<correctAnswerArray.length; i++){
        
        if(answersArray[i]!=undefined || answersArray[i]!=null){

            var options = answersArray[i].split(',');
            var genericMessage = 'You may skip this question, but there will be consequences in your score.<br>You CANNOT skip 2 questions in a row.';
            var questionData = {
                'q': questionsArray[i],
                'options': options,
                'correctIndex': correctAnswerArray[i],
                'correctResponse': genericMessage,
                'incorrectResponse': genericMessage
            };

            questionDataArray.push(questionData);
        }
        
    };

    //Make the quiz
    $('#quiz').quiz({
        counterFormat: 'Question %current of '+questionsArray.length,
        questions: questionDataArray
    });
};

//Update the score for each intelligence
function updateIntelScore(intelType){

    if(intelType.includes('logical')){
        logical++;
        logicStr = "Logical: "+logical;
    }
    if(intelType.includes('kinesthetic')){
        kinesthetic++;
        kinStr = "Kinesthetic: "+kinesthetic;
    }
    if(intelType.includes('musical')){
        musical++;
        musicStr = "Musical: "+musical;
    }
    if(intelType.includes('linguistic')){
        linguistic++;
        lingStr = "Linguistic: "+linguistic;
    }
    if(intelType.includes('visual')){
        visual++;
        visStr = "Visual: "+visual;
    }
    if(intelType.includes('naturalist')){
        naturalist++;
        natureStr = "Naturalist: "+naturalist;
    }
    if(intelType.includes('interpersonal')){
        interpersonal++;
        interStr = "Interpersonal: "+interpersonal;
    }
    if(intelType.includes('intrapersonal')){
        intrapersonal++;
        intraStr = "Intrapersonal: "+intrapersonal;
    }

    stringArray = [logicStr,kinStr, musicStr, lingStr, visStr, natureStr, interStr, intraStr];
    scoreArray = [logical,kinesthetic, musical, linguistic, visual, naturalist, interpersonal, intrapersonal];

    saveStep2toDB(stringArray,scoreArray );
};

//Save the scores to the database
function saveStep2toDB(stringArray,scoreArray){
    var filteredScore = [];
    var filteredStr = [];   


    for(var i = 0; i<scoreArray.length; i++){
        if(scoreArray[i]>0){
            filteredScore.push(scoreArray[i]);
            filteredStr.push(stringArray[i]);
        }
    }

    var docData = {
        step2Results: filteredStr, step2Scores: filteredScore
    }

    step2ReportPath.set(docData).then(function() {
        console.log("Step 2 Scores and Report submitted!");
    });
};

//Update the total amount of questions attempted in order to calculate the percentage
function addTotalAnswered(intelType){

    if(intelType.includes('logical')){
        logicalLength++;
    }
    if(intelType.includes('kinesthetic')){
        kinestheticLength++;
    }
    if(intelType.includes('musical')){
        musicalLength++;
    }
    if(intelType.includes('linguistic')){
        linguisticLength++;
    }
    if(intelType.includes('visual')){
        visualLength++;
    }
    if(intelType.includes('naturalist')){
        naturalistLength++;
    }
    if(intelType.includes('interpersonal')){
        interpersonalLength++;
    }
    if(intelType.includes('intrapersonal')){
        intrapersonalLength++;
    }
};

function returnTotal(intelType){

    if(intelType.includes('logical')){
        var returnVal = logicalLength;
    }
    if(intelType.includes('kinesthetic')){
        var returnVal = kinestheticLength;
    }
    if(intelType.includes('musical')){
        var returnVal = musicalLength;
    }
    if(intelType.includes('linguistic')){
        var returnVal = linguisticLength;
    }
    if(intelType.includes('visual')){
        var returnVal = visualLength;
    }
    if(intelType.includes('naturalist')){
        var returnVal = naturalistLength;
    }
    if(intelType.includes('interpersonal')){
        var returnVal = interpersonalLength;
    }
    if(intelType.includes('intrapersonal')){
        var returnVal = intrapersonalLength;
    }

    return returnVal;
};