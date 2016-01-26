displayView = function(){
  view = document.getElementById("welcomeview").innerHTML;
  viewer = document.getElementById("viewer");
  viewer.innerHTML = view;
}
window.onload = function(){
  //code that is executed as the page is loaded.
  //You shall put your own custom code here
  displayView();

}

function passwordCheck(pw, reppw){
  var passwordLength = 10;

  if (pw != reppw){
    alert("Password mismatch")
    return submitFlag=false;
  }
  else if (pw.length < passwordLength) {
    alert("Password is to short")
    return submitFlag=false;
  }
  else {
    alert("Password accepted")
    return submitFlag=true;
  }
}
