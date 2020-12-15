var docRef = db.collection("postsecondary").doc("SF");

docRef.get().then(function(doc) {
    if (doc.exists) {
        document.getElementById("school").innerHTML = "Document data:"+ doc.data();
    } else {
    }
}).catch(function(error) {
    console.log("Error getting document:", error);
});