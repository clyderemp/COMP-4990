//HANDLES WHERE THE USER IS GOING TO BE SENT TO ONCE LOGGED IN
function sentToHomePage(usertype){
    
  if(usertype=='employer'){
      location.href = "../../homepage/user/employer.html";
  }
  else if(usertype=='student'){
      location.href = "../../homepage/user/index.html";
  }
}