displayView = function(){
  if (localStorage.getItem("Token") != null){
    view = document.getElementById("profileview").innerHTML;
    viewer = document.getElementById("viewer");
    viewer.innerHTML = view;
    showHome(localStorage.getItem("tempEmail"));
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
    localStorage.setItem("userEmail", email);
    localStorage.setItem("tempEmail", email);
  }
  //alert(result.message)
  document.getElementById("errorsignin").innerHTML = result.message;
  return submitFlag=result.success;
}

function passwordCheck(pw, reppw){
  var passwordLength = 10;

  if (pw != reppw){
    document.getElementById("errormsg").innerHTML = "Password mismatch!";
    return submitFlag=false;
  }
  else if (pw.length < passwordLength) {
    document.getElementById("errormsg").innerHTML = "Password is to short";
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
    document.getElementById("errorsignup").innerHTML = result.message;
    return submitFlag=false;
  }
}

function showHome(email){
  document.getElementById('home').style.display = "block";
  document.getElementById('browse').style.display = "none";
  document.getElementById('account').style.display = "none";
  document.getElementById("homeTab").style.backgroundColor = "gray";
  document.getElementById("accountTab").style.backgroundColor = "white";
  document.getElementById("browseTab").style.backgroundColor = "white";
  tempEmail = localStorage.getItem("tempEmail");
  messages = localStorage.getItem("messages");

  if(email == tempEmail){
    if(messages == null){
      printHome(email)
    }
    else{
      document.getElementById('messages').innerHTML = "<h3>Message wall</h3>" + messages;
    }
  }
  else if (email != tempEmail) {
    printHome(email)
  }

  localStorage.setItem("tempEmail",email);

  pi = personalInformation(email);
  document.getElementById('infofields').innerHTML =  pi;
}
function showBrowse(){
  document.getElementById("home").style.display = "none";
  document.getElementById("browse").style.display = "block";
  document.getElementById("account").style.display = "none";
  document.getElementById("homeTab").style.backgroundColor = "white";
  document.getElementById("accountTab").style.backgroundColor = "white";
  document.getElementById("browseTab").style.backgroundColor = "gray";
}
function showAccount(){
  document.getElementById("home").style.display = "none";
  document.getElementById("browse").style.display = "none";
  document.getElementById("account").style.display = "block";
  document.getElementById("homeTab").style.backgroundColor = "white";
  document.getElementById("accountTab").style.backgroundColor = "gray";
  document.getElementById("browseTab").style.backgroundColor = "white";
}

function findUser(email){
  result = serverstub.getUserDataByEmail(localStorage.getItem("Token"),email)
  if (result.data !== undefined){
    pi = personalInformation(email);
    document.getElementById("browseinfofields").innerHTML = pi;
    printBrowse(email);
    return submitFlag=false;
  }
  else{
    document.getElementById("errorbrowse").innerHTML = result.message;
    return submitFlag=false;
  }
}

function changePassword(){
  token = localStorage.getItem("Token");
  oldpassword = document.changepassword.oldpassword.value;
  newpassword = document.changepassword.newpassword.value;

  result = serverstub.changePassword(token, oldpassword, newpassword);
  //Add reponse when password changed
  document.getElementById("errorchangepw").innerHTML = result.message;
  return submitFlag=false;
}

function logout(){
  token = localStorage.getItem("Token");
  result = serverstub.signOut(token);
  if (result.success){
    localStorage.removeItem("Token");
    localStorage.removeItem("userEmail");
    localStorage.removeItem("tempEmail");
    localStorage.removeItem("messages");
  }
  displayView();
}

function personalInformation(mail){
  result = serverstub.getUserDataByEmail(localStorage.getItem("Token"),mail)
  //alert(result.message)
  result = result.data.email + "<br>" + result.data.firstname + "<br>" + result.data.familyname
   + "<br>" + result.data.gender + "<br>" + result.data.city + "<br>" + result.data.country;
  return result;
}

function printHome(email){
  messages = getMessages(email)
  document.getElementById("messages").innerHTML = "<h3>Message wall</h3>" + messages;
  localStorage.setItem("messages", messages);
  document.getElementById("errorupdate").innerHTML = "Updated"
}

function printBrowse(email){
  messages = getMessages(email)
  document.getElementById("browsemessages").innerHTML = "<h3>Message wall</h3>" + messages;
  localStorage.setItem("messages", messages);
  document.getElementById("errorbrowseupdate").innerHTML = "Updated"
}

function getMessages(email){
  msgs = serverstub.getUserMessagesByEmail(localStorage.getItem("Token"),email);
  msgLength = msgs.data.length;
  var messages = "";
  //alert(msgs.message)

  if(msgLength > 0){
    for(i = 0; i<msgLength; i++){
      messages = messages + "<br>" + msgs.data[i].writer + ": " + msgs.data[i].content + "<br>";
    }
  }
  return messages;
}

function postHome(){
  token = localStorage.getItem("Token");
  email = localStorage.getItem("tempEmail");
  cont = document.getElementById("messagearea").value;

  result = serverstub.postMessage(token,cont,email)
  document.getElementById("errorpost").innerHTML = result.message
  return submitFlag = false;
}

function postBrowse(){
  token = localStorage.getItem("Token");
  email = localStorage.getItem("tempEmail");
  cont = document.getElementById("browsemessagearea").value;

  result = serverstub.postMessage(token,cont,email);
  document.getElementById("errorbrowsepost").innerHTML = result.message;
  return submitFlag = false;
}
