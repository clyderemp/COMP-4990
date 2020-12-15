function logout(){
    firebase.auth().signOut().then(function() {
      window.location.href = "../../authorizepage/login.html"
          // Sign-out successful.
    }).catch(function(error) {
        window.alert("ERROR: " + error.message);
      })
}