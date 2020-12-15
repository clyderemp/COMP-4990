
$(function(){
  document.getElementById("tableSection").style.display = "none";
  document.getElementById("courseTableSection").style.display = "none";
  setTimeout(function(){
    $('body').addClass('loaded');
  },2000);
  
});

$('#collapseTable').click(function(){
  var content = document.getElementById("tableSection");
  var symbol = document.getElementById("tableSectionBtn");

      if (content.style.display === "block") {
          content.style.display = "none";
          symbol.className = "fa fa-angle-down";
      } else {
        content.style.display = "block";
        symbol.className = "fa fa-angle-up";
      }
});

$('#courseCollapseBtn').click(function(){
  var content = document.getElementById("courseTableSection");
  var symbol = document.getElementById("courseBtnSym");

      if (content.style.display === "block") {
          content.style.display = "none";
          symbol.className = "fa fa-angle-down";
      } else {
        content.style.display = "block";
        symbol.className = "fa fa-angle-up";
      }
});

$('#refreshBtn').click(function(){
  var content = document.getElementById("tableSection");

  content.style.display = "none";
  
  setTimeout(function(){ 
      content.style.display = "block";
  },2900);
});
//REFRESH THE GOAL CALCULATOR
$('#refreshCalc').click(function(){
    document.getElementById("goalCumulative").value = "";
    document.getElementById("goalMajor").value = "";
    document.getElementById("registeredCourses").value = "1";
});

$('#schedulerBtn').click(function(){
  var content = document.getElementById("includecontent");
  var symbol = document.getElementById("schedulerBtnSym");

      if (content.style.display == "block") {
          content.style.display = "none";
          symbol.className = "fa fa-angle-down";
      } else {
        content.style.display = "block";
        symbol.className = "fa fa-angle-up";
      }
});