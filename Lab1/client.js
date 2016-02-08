displayView = function(){
  if (localStorage.getItem("Token") != null){
    view = document.getElementById("profileview").innerHTML;
    viewer = document.getElementById("viewer");
    viewer.innerHTML = view;
    showHome();
  }
  else{
    view = document.getElementById("welcomeview").innerHTML;
    viewer = document.getElementById("viewer");
    viewer.innerHTML = view;
  }
}
window.onload = function(){
  //code that is executed as the page is loaded.
  //You shall put your own custom code here
  displayView();

}

function signIn(email, password){
  result = serverstub.signIn(email,password)

  if (result.success){
    token = result.data
    localStorage.setItem("Token", token);
    localStorage.setItem("email", email);
  }
  alert(result.message)
  return submitFlag=result.success;
}

function passwordCheck(pw, reppw){
  var passwordLength = 10;

  if (pw != reppw){
    alert("Password mismatch!")
    return submitFlag=false;
  }
  else if (pw.length < passwordLength) {
    alert("Password is to short")
    return submitFlag=false;
  }
  else {
    var data = {
      'email': document.signup.email.value,
      'password': document.signup.password.value,
      'firstname': document.signup.firstname.value,
      'familyname': document.signup.lastname.value,
      'gender': document.signup.dropdown.value,
      'city': document.signup.city.value,
      'country': document.signup.country.value
    };

    result = serverstub.signUp(data)
    alert(result.message)
    return submitFlag=result.success;
  }
}

function showHome(email){
  document.getElementById('home').style.display = "block";
  document.getElementById('browse').style.display = "none";
  document.getElementById('account').style.display = "none";

  if(email == null){
    result = serverstub.getUserDataByToken(localStorage.getItem("Token"));
    email = result.data.email;
    localStorage.setItem("browsemail",email);
  }

  pi = personalInformation(email);
  document.getElementById('infofields').innerHTML =  pi;
  document.getElementById("messages").innerHTML = printMessages(email);
}
function showBrowse(){
  document.getElementById("home").style.display = "none";
  document.getElementById("browse").style.display = "block";
  document.getElementById("account").style.display = "none";
}
function showAccount(){
  document.getElementById("home").style.display = "none";
  document.getElementById("browse").style.display = "none";
  document.getElementById("account").style.display = "block";
}

function changePassword(){
  token = localStorage.getItem("Token");
  oldpassword = document.changepassword.oldpassword.value;
  newpassword = document.changepassword.newpassword.value;

  result = serverstub.changePassword(token, oldpassword, newpassword);
  alert(result.message)
  return submitFlag=result.success;
}

function logout(){
  token = localStorage.getItem("Token");
  result = serverstub.signOut(token);
  alert(result.message)
  if (result.success){
    localStorage.removeItem("Token");
    localStorage.removeItem("email");
  }
  displayView();
}

function personalInformation(email){
  result = serverstub.getUserDataByEmail(localStorage.getItem("Token"),email)
  result = result.data.email + "<br>" + result.data.firstname + "<br>" + result.data.familyname
   + "<br>" + result.data.gender + "<br>" + result.data.city + "<br>" + result.data.country;
  return result;
}

function printMessages(email){
  msgs = serverstub.getUserMessagesByEmail(localStorage.getItem("Token"),email);
  msgLength = msgs.data.length;
  var messages = "";
  alert(msgs.message)

  if(msgLength > 0){
    for(i = 0; i<msgLength; i++){
      messages = messages + "<br>" + msgs.data[i].writer + ": " + msgs.data[i].content + "<br>";
    }
  }
  return "<h3>Message wall</h3>" + messages;
}

function postMessage(){
  token = localStorage.getItem("Token");
  email = localStorage.getItem("email");
  cont = document.getElementById("messagearea").value;

  result = serverstub.postMessage(token,cont,email)

  alert(result.message)
  return submitFlag = result.success;
}
