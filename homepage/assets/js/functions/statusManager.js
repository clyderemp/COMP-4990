function changeStatus(status){
    var avatar = document.getElementById("statusIndicator");
    if(status=="online"){
        avatar.className = "avatar avatar-online";
    }
    else if(status=="offline"){
        avatar.className = "avatar avatar-offline";
    }
}

$('#onlineBtn').click(function(e) {
    swal("Status: ONLINE", "You are now online to public!", {
        icon : "success",
        buttons: {        			
            confirm: {
                className : 'btn btn-success'
            }
        },
    })

    var avatar = document.getElementById("statusIndicator");
    var online = document.getElementById("onlineTxt");
    var offline = document.getElementById("offlineTxt");
    var away = document.getElementById("awayTxt");
  
            avatar.className = "avatar avatar-online";
            online.style.fontSize = "20px";
            offline.style.fontSize = "16px";
            away.style.fontSize = "16px";

            online.style.color = "#31CE36"; //green
            offline.style.color = "grey";
            away.style.color = "grey";
});
$('#offlineBtn').click(function(e) {
    swal("Status: OFFLINE", "You are now offline to public!", {
        icon : "success",
        buttons: {        			
            confirm: {
                className : 'btn btn-success'
            }
        },
    })
    var avatar = document.getElementById("statusIndicator");
    var online = document.getElementById("onlineTxt");
    var offline = document.getElementById("offlineTxt");
    var away = document.getElementById("awayTxt");
  
            avatar.className = "avatar avatar-offline";

            online.style.fontSize = "16px";
            offline.style.fontSize = "20px";
            away.style.fontSize = "16px";

            online.style.color = "grey";
            offline.style.color = "black";
            away.style.color = "grey";
});
$('#awayBtn').click(function(e) {
    swal("Status: AWAY", "You are now away from public!", {
        icon : "success",
        buttons: {        			
            confirm: {
                className : 'btn btn-success'
            }
        },
    })
    var avatar = document.getElementById("statusIndicator");
    var online = document.getElementById("onlineTxt");
    var offline = document.getElementById("offlineTxt");
    var away = document.getElementById("awayTxt");

            avatar.className = "avatar avatar-away";
            online.style.fontSize = "16px";
            offline.style.fontSize = "16px";
            away.style.fontSize = "20px";

            online.style.color = "grey";
            offline.style.color = "grey";
            away.style.color = "#ffcd24"; //yellow

});