//THIS IS FOR THE FIRST TAB
$('#myintelbutton').click(function(){
    var content = document.getElementById("othercontent");

        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
          content.style.display = "block";
        }
});

//THIS IS FOR THE FIRST CONTENT IN THE MYPROFILE
$('#myprogressbutton').click(function(){
    var content = document.getElementById("progresscontent");

        if (content.style.display === "block") {
            content.style.display = "none";
        } else {
          content.style.display = "block";
        }
});

//THIS IS FOR THE PANEL THAT SHOWS ALL THE SEMESTER COURSE AND GRADES
$('#sembtn').click(function(){
  var content = document.getElementById("semestercontent");

      if (content.style.display === "block") {
          content.style.display = "none";
      } else {
        content.style.display = "block";
      }
});

//THIS IS FOR THE PANEL THAT SHOWS ALL THE SEMESTER COURSE AND GRADES
$('#calcmyaverage-btn').click(function(){
  var content = document.getElementById("calcmyaverage-content");

      if (content.style.display === "block") {
          content.style.display = "none";
      } else {
        content.style.display = "block";
      }
});