
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
  
  $('#jobCollapseBtn').click(function(){
    var content = document.getElementById("tableSection");
    var symbol = document.getElementById("courseBtnSym");
  
        if (content.style.display === "block") {
            content.style.display = "none";
            symbol.className = "fa fa-angle-down";
        } else {
          content.style.display = "block";
          symbol.className = "fa fa-angle-up";
        }
  });