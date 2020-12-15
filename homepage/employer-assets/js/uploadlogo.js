$(function(){
    
    //Add a listener to the photo uploader
    window.addEventListener('load', function() {
        document.querySelector('#uploadlogo').addEventListener('change', function() {
            if (this.files && this.files[0]) {

                //SET THE FILE PATH
                userfilepath = 'userpic-storage/'+uid+'/';
                
                //create a storage ref
                storageRef = firebase.storage().ref(userfilepath + '/profilepic');

                //upload file
                var task = storageRef.put(this.files[0]);

                task.on('state_changed',
                function progress(snapshot){//uploading process
                console.log(snapshot);
                },

                function error(err){ //if the user uploads a non-pdf file
                    console.log(err);
                },

                function complete(snap){ //succesful upload
                    alert("MyLogo uploaded! Updating interface now...");
                    console.log("MyLogo uploaded!");
                    location.reload();
                }
                );
            }
        });
    });
});

function loadPic(uid){
    //SET THE FILE PATH
    var userfilepath = 'userpic-storage/'+uid+'/';
    console.log(uid);
    //create a storage ref
    var storageRef = firebase.storage().ref(userfilepath);

    storageRef.child('profilepic').getDownloadURL().then(function(url) {
        //Download the current profile picture
        document.querySelector("#leftpanelprofpic").src = url;
        document.querySelector("#rightpanelprofpic").src = url;
        document.querySelector("#toprightprofpic").src = url;
        
    }).catch(function(error) {
        console.log(error);
    });
}