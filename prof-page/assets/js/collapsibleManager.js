//THIS IS FOR THE FIRST TAB
$('#currentSem').click(function(){
    var content = document.getElementById("currentSem-content");

        if (content.style.display === "block") {
            content.style.display = "none";
            document.getElementById("courseContent").style.display = "none";
        } else {
            document.getElementById("noneBtn").disabled = false;
            document.getElementById("courseDrop").value = "none";
            document.getElementById("load").style.display = "block";
            setTimeout(function(){
                document.getElementById("load").style.display = "none";
                content.style.display = "block";
            }, 1500);
        }
});