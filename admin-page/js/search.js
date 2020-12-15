function searchStudent(){
    
    var usertype = document.getElementById("user-drop").value;
    var userEmail = document.getElementById("email").value;

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
}

function grabResults(username, school, userEmail, usertype){
    var db = firebase.firestore();
        document.getElementById("results").style.display="block";
    if(usertype!="admin"){
        var docRef = db.collection(usertype).doc("post-secondary").collection(school).doc(username); //Sets the doc reference
    }
    else   
    var docRef = db.collection(usertype).doc(school).collection(username).doc("user"); //Sets the doc reference
    
               
    docRef.get().then(function(doc) { //Gets the document reference and checks for the document
          
      if (doc.exists){ //if the document exists then output the fullname

        document.getElementById("resultsfor").textContent = 'Results for "'+userEmail+'"';

          $("#resultTable").append(
            '<tr id="table"><th scope="row"><input type="checkbox" id="check" value='+userEmail+' aria-label="Checkbox"></th>'
            +'<td class="tm-product-name">'+doc.data().fname+" "+doc.data().lname+'</td>'
            +'<td class="text-center">'+doc.data().school+'</td>'
            +'<td class="text-center">'+userEmail+'</td>'
            +'<td class="text-center">'+doc.data().id_num+'</td></tr>'
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