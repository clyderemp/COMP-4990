
    window.onscroll = function() {myFunction()};
        
    var header = document.getElementById("myHeader");
    var btn = document.getElementById("topRight");
    var content = document.getElementById("maincontent");
    var sticky = header.offsetTop;
    
    function myFunction() {
      if (window.pageYOffset > sticky) {
        header.classList.add("sticky");
        btn.classList.add("stickybtn");
        btn.style.display = 'inline-block';
        content.removeAttribute('data-aos');
        content.removeAttribute('data-aos-anchor-placement');
        content.removeAttribute('data-aos-duration');
        header
      } else {
        header.classList.remove("sticky");
        btn.classList.remove("stickybtn");
        btn.style.display = 'none';

      }
    }