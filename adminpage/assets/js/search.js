/**
 * USED THIS TO LOOK FOR PROFESSORS
 */
function searchProf(){
    document.getElementById("viewAccount2").style.display="none"; //hide the prof account panel
    document.getElementById("coursesResult").innerHTML = "";    //reset the course table
    document.getElementById("addCoursesTable").innerHTML = "";  //resets the add ourse btn
    var usertype = "staff";
    var userEmail = (document.getElementById("emailProf").value).toLowerCase();
    document.getElementById("load2").style.display = "block";
    document.getElementById("resultsContent2").style.display = "block"; //makes sure that panels is visible to show the loading animation
    document.getElementById("searchTable2").style.display = "none";
    document.getElementById("resultsfor2").textContent = "";
            
    setTimeout(function(){
    document.getElementById("load2").style.display = "none";

    if(userEmail!="" && usertype!="none"){
        document.getElementById("emailProf").style.borderColor = "grey";
        var splitEmail = userEmail.split("@");
        var splitDomain = splitEmail[1].split(".");
        var email = splitEmail[0];
        var school = splitDomain[0];
        $("#table2").remove(); //RESET THE TABLE
        grabProfResults(email, school, userEmail, usertype);
    }
    else{
        document.getElementById("emailProf").style.borderColor = "red";
    }
    }, 1000);
}

function grabProfResults(username, school, userEmail, usertype){
    var db = firebase.firestore();
        //document.getElementById("resultsContent2").style.display="block"; //SHOW THE TABLE THAT WILL HAVE THE RESULTS FOR PROF SEARCH
        
        var docRef = db.collection('myacadvisor-db').doc('myaccount-db').collection(usertype).doc("post-secondary").collection(school).doc(username); //Sets the doc reference
    
               
    docRef.get().then(function(doc) { //Gets the document reference and checks for the document
          
      if (doc.exists){ //if the document exists then output the fullname
        document.getElementById("searchTable2").style.display = "block";
        document.getElementById("resultsfor2").textContent = 'Results for "'+userEmail+'"';

          $("#resultTable2").append(
            '<tr id="table2"><th scope="row"></th>'
            +'<td class="tm-product-name">'+doc.data().fname+" "+doc.data().lname+'</td>'
            +'<td class="text-center">'+doc.data().school+'</td>'
            +'<td class="text-center" id=userEmail>'+userEmail+'</td>'
            +'<td class="text-center">'+doc.data().id_num+'</td>'
            +'<td><button onclick=loadProfAcc()>OPEN</td></tr>'
        );
      }
      else { //else report an database error --> USER IS AUTHORIZED BUT HAS NO USER FILE ON DATABASE
        document.getElementById("resultsfor2").textContent = 'No results for "'+userEmail+'"';
      }

      }).catch(function(error) { //Catch any retrieval error
             console.log("Error getting document:", error);
      });
}

function searchStudent(){
    
    var usertype = document.getElementById("user-drop").value;
    var userEmail = (document.getElementById("email").value).toLowerCase();
    document.getElementById("load").style.display = "block";
    document.getElementById("resultsContent").style.display = "block";
    document.getElementById("searchTable").style.display = "none";
    document.getElementById("resultsfor").textContent = "";
            
    setTimeout(function(){
        document.getElementById("load").style.display = "none";
        
        if(userEmail!="" && usertype!="none"){
            document.getElementById("email").style.borderColor = "grey";
            document.getElementById("user-drop").style.borderColor = "grey";

            var splitEmail = userEmail.split("@");
            var splitDomain = splitEmail[1].split(".");
            var email = splitEmail[0];
            var school = splitDomain[0];

            $("#table").remove();
            grabResults(email, school, userEmail, usertype);
        }
        else{
            document.getElementById("email").style.borderColor = "red";
            document.getElementById("user-drop").style.borderColor = "red";
        }
    }, 1000);
}

function grabResults(username, school, userEmail, usertype){
    var db = firebase.firestore();
        document.getElementById("resultsContent").style.display="block";
    if(usertype!="admin"){
        var docRef = db.collection(usertype).doc("post-secondary").collection(school).doc(username); //Sets the doc reference
    }
    else   
        var docRef = db.collection('myacadvisor-db').doc('myaccount-db').collection(usertype).doc("post-secondary").collection(school).doc(username); //Sets the doc reference
    
               
    docRef.get().then(function(doc) { //Gets the document reference and checks for the document
          
      if (doc.exists){ //if the document exists then output the fullname
        document.getElementById("searchTable").style.display = "block";
        document.getElementById("resultsfor").textContent = 'Results for "'+userEmail+'"';

          $("#resultTable").append(
            '<tr id="table"><th scope="row"></th>'
            +'<td class="tm-product-name">'+doc.data().fname+" "+doc.data().lname+'</td>'
            +'<td class="text-center">'+doc.data().school+'</td>'
            +'<td class="text-center">'+userEmail+'</td>'
            +'<td class="text-center">'+doc.data().id_num+'</td>'
            +'<td><button>OPEN</td></tr>'
        );
      }
      else { //else report an database error --> USER IS AUTHORIZED BUT HAS NO USER FILE ON DATABASE
        document.getElementById("resultsfor").textContent = 'No results for "'+userEmail+'"';
      }

      }).catch(function(error) { //Catch any retrieval error
             console.log("Error getting document:", error);
      });
}

function showForm(value){

    document.getElementById("formPanel").style.display = "inline-flex";

    switch(value){
        case "student":
            document.getElementById("fnameForm").style.display = "inline-flex";
            document.getElementById("lnameForm").style.display = "inline-flex";
            document.getElementById("studentIdForm").style.display = "inline-flex";
            document.getElementById("schooldropForm").style.display = "inline-flex";
            document.getElementById("staffIdForm").style.display = "none";
            document.getElementById("emailForm").style.display = "inline-flex";
            document.getElementById("passwordForm").style.display = "inline-flex";
            document.getElementById("createBtn").style.display = "block";
            break;
        case "parent":
            document.getElementById("fnameForm").style.display = "inline-flex";
            document.getElementById("lnameForm").style.display = "inline-flex";
            document.getElementById("studentIdForm").style.display = "none";
            document.getElementById("schooldropForm").style.display = "none";
            document.getElementById("staffIdForm").style.display = "none";
            document.getElementById("emailForm").style.display = "inline-flex";
            document.getElementById("passwordForm").style.display = "inline-flex";
            document.getElementById("createBtn").style.display = "block";
            break;
        case "staff":
            document.getElementById("fnameForm").style.display = "inline-flex";
            document.getElementById("lnameForm").style.display = "inline-flex";
            document.getElementById("studentIdForm").style.display = "none";
            document.getElementById("schooldropForm").style.display = "inline-flex";
            document.getElementById("staffIdForm").style.display = "inline-flex";
            document.getElementById("emailForm").style.display = "inline-flex";
            document.getElementById("passwordForm").style.display = "inline-flex";
            document.getElementById("createBtn").style.display = "block";
            break;
        case "admin":
            document.getElementById("fnameForm").style.display = "inline-flex";
            document.getElementById("lnameForm").style.display = "inline-flex";
            document.getElementById("studentIdForm").style.display = "none";
            document.getElementById("schooldropForm").style.display = "none";
            document.getElementById("staffIdForm").style.display = "none";
            document.getElementById("emailForm").style.display = "inline-flex";
            document.getElementById("passwordForm").style.display = "inline-flex";
            document.getElementById("createBtn").style.display = "block";
            break;
        default:
            document.getElementById("fnameForm").style.display = "none";
            document.getElementById("lnameForm").style.display = "none";
            document.getElementById("studentIdForm").style.display = "none";
            document.getElementById("schooldropForm").style.display = "none";
            document.getElementById("staffIdForm").style.display = "none";
            document.getElementById("emailForm").style.display = "none";
            document.getElementById("passwordForm").style.display = "none";
            document.getElementById("createBtn").style.display = "none";
            break;
    }
}