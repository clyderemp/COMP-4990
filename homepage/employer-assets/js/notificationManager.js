var refreshnotif;
$(function(){
   callinterval();
});

function getnotifinfo(doc){
    var datepost = get_time_diff(doc.data().dateposted);
    var message = doc.data().message;
    var html = '<a href="#"><div class="notif-icon notif-primary"> <i class="fa fa-briefcase"></i></div><div class="notif-content"><span class="block">'+
            message+'</span><span class="time">'+datepost+'</span></div></a>';

    $("#notificationPanel").append(html);
}
$("#notifDropdown").click(function(){
    if(document.getElementById("notifdroppanel").style.visibility == "hidden"){
        $("#notifDropdown").html('<i class="fa fa-bell"></i>');
        $("#notifdroppanel").show();
        callinterval();
    }else{
        $("#totalnotif").remove();
        clearInterval(refreshnotif);
        clearNotification();
    }

});

function callinterval(){
       
    refreshnotif = setInterval(function(){
    
        var totalnotif = 0;
        $("#notifDropdown").html('<i class="fa fa-bell"></i>');
        $("#notificationPanel").html('');
        var firestorePath = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection("employer").doc(uid).collection("notifications");  //Set the path for job posting on the database
        firestorePath.get().then(snapshot => {
            snapshot.forEach(doc => {
                totalnotif++;
                console.log(doc.id);
                if(totalnotif>0){
                                
                    $("#notifDropdown").append('<span class="notification" id="totalnotif">'+totalnotif+'</span>');

                   // $("#totalnotif").text(totalnotif);
                    if(totalnotif<=1)
                        $("#notificationmessage").text("You have "+totalnotif+" new notification");
                    else
                        $("#notificationmessage").text("You have "+totalnotif+" new notifications");
                    getnotifinfo(doc);
                }
                else
                    $("#notificationmessage").text("Notification center has been cleared!");

            });
        });
    }, 1000);
}

//Function that handles the comparison from the date it was posted and current
function get_time_diff( datetime )
{
    var datetime = typeof datetime !== 'undefined' ? datetime : "2020-01-01 01:02:03.123456";

    var datetime = new Date( datetime );
    var now = new Date(returnCurrentDateandTime());

    if( isNaN(datetime) )
    {
        return "";
    }
    
    //subtract the date posted from current
    if (datetime < now) {
        var milisec_diff = now - datetime;
    }else{
        var milisec_diff = datetime - now;
    }

    var date_diff = new Date( milisec_diff );

    //construct the sentence if its been over an hour
    if(date_diff.getMinutes() > 60)
        var sentence = "From a while ago";
    else
        var sentence = "From " + date_diff.getMinutes() + " minutes and " + date_diff.getSeconds() + " seconds ago";
    return sentence;
}

function clearNotification(){
    var firestorePath = firestoreDB.collection('myacadvisor-db').doc('myaccount-db').collection("employer").doc(uid).collection("notifications");  //Set the path for job posting on the database
        firestorePath.get().then(snapshot => {
            snapshot.forEach(doc => {
                firestorePath.doc(doc.id).delete();
            });
        });
}