$(function(){
    firebase.auth().onAuthStateChanged(function(user) {
        var user = userAuth.currentUser;
        var db = firebase.firestore();
  
      if (user) {
       // User is signed in.
        if(user!=null){
            var docRef = db.collection("myacadvisor-db").doc("myintel-db").collection(user.uid).doc('step1-Report');
            //Sets the doc reference
                
            docRef.get().then(function(doc) { //Gets the document reference and checks for the document


                if (doc.exists){

                    var intelligenceList = ['Logic', 'Kinesthetic', 'Musical', 'Linguistic', 'Visual', 'Naturalistic', 'Interpersonal', 'Intrapersonal'];
                    
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
                      
                    for(var p=0; p < Math.pow(unfilteredData.length, 2); p++){
                        //Squared of the length to ensure that it is sorted thoroughly
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
                        if(4<=n){
                            strengthData.push(unfilteredData[n]);
                            weakData.push(0);
                            if(n==7){
                                strLine += ' and '+intelligenceList[n]+'.';
                            }
                            else 
                                strLine+=intelligenceList[n]+', ';
                        }
                        else{
                            weakData.push(unfilteredData[n]);
                            strengthData.push(0);
                            if(n==3){
                                wkLine += ' and '+intelligenceList[n]+'.';
                            }
                            else 
                                wkLine+=intelligenceList[n]+', ';
                        }
                    }
                    
                    $('#strengthReport').text(strLine);
                    $('#weaknessReport').text(wkLine);
                    
                    drawChartData(intelligenceList, strengthData, weakData, unfilteredData, 'right');
                }
                else{
                    document.getElementById('myIntelReport').textContent = 'Data not available.';
                    document.getElementById('myIntelReport').style.textAlign = 'center';

                    document.getElementById('printIntelBtn').style.display = 'none';
                    document.getElementById('evalIntelBtn').textContent = 'Take Test';
                }

                }).catch(function(error) { //Catch any retrieval error
                    console.log("Error in $function in searchCourses.js");
                    console.log("Error getting document:", error);
                });
            }
        }
    });

});

function drawChartData(intelligenceList, strengthData, weakData, unfilteredData, legendPosition){

    radarChart = document.getElementById('myIntelChart').getContext('2d');
    var myRadarChart = new Chart(radarChart, {
        type: 'radar',
        data: {
            labels: intelligenceList,
            datasets: [{
                data: unfilteredData,
                borderColor: '#005596',
                backgroundColor : 'rgba(255, 255, 255, 0.15)',
                pointBackgroundColor: "#ffcd24",
                pointHoverRadius: 4,
                pointRadius: 3,
                label: 'Overall'
            }, {
                data: strengthData,
                borderColor: '#28FF45',
                backgroundColor: 'rgba(56, 255, 56, 0.25)',
                pointBackgroundColor: "#716aca",
                pointHoverRadius: 4,
                pointRadius: 3,
                label: 'Strengths'
            }, {
                data: weakData,
                borderColor: '#FF146A',
                backgroundColor: 'rgba(255, 20, 106, 0.25)',
                pointBackgroundColor: "#716aca",
                pointHoverRadius: 4,
                pointRadius: 3,
                label: 'Weaknesses'
            },
            ]
        },
        options : {
            responsive: true, 
            maintainAspectRatio: false,
            legend : {
                position: legendPosition
            }
        }
    });
}

$('#evalIntelBtn').click(function(){
    changeTopBar();
    load("#mainpage","../myintelEval-assets/html/myintelstep1.html");    
    swal({
        id: 'intelPanel',
        title: 'Welcome to myIntel Evaluation!',
        text: "There will be a series of multiple evaluation that will help us understand you intellectual strengths, weaknesses"
            +", preferences, learning styles and MORE!",
        icon: 'success',
        
    });
});

function load(whereToLoad, htmlPageToLoad){
    $(whereToLoad).load(htmlPageToLoad);
}

function changeTopBar(){
    var newItem = document.createElement("LI");
    newItem.classList.add('nav-item');
    newItem.classList.add('dropdown');
    newItem.classList.add('hidden-caret');
    newItem.id = 'homeBtn';
    var topBar = document.getElementById("topbarBtn");

    topBar.insertBefore(newItem, topBar.childNodes[2]);
    topBar.removeChild(topBar.childNodes[4]); //Remove message btn
    topBar.removeChild(topBar.childNodes[5]); //Remove notif btn
    topBar.removeChild(topBar.childNodes[6]); //Remove shortcut btn
    topBar.removeChild(topBar.childNodes[7]); //Remove Portall btn
    
    var html = '<a class="nav-link" data-toggle="dropdown" href="#" aria-expanded="false">'
        +'<i class="fas fa-home"></i><p style="vertical-align:bottom;"> Return Home</p></a>';
    $('#homeBtn').html(html);
};