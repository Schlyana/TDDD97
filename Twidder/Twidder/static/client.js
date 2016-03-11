displayView = function(state){
  if (state == "profile"){
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
    displayView("welcome");
}

function socketConnect(email, password){
  var connection = new WebSocket("ws://localhost:5000/check_session");

  connection.onopen = function () {
    jsonemail = JSON.stringify({ email: email });
    connection.send(jsonemail); // Send the message 'Ping' to the server
  };
  // Log errors
  connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
  };
  // Log messages from the server
  connection.onmessage = function (e) {
    var msg = JSON.parse(e.data);
    switch(msg.response.message){
      case "login":
        signIn(email,password);
        break;
      case "logout":
        if (msg.response.result == localStorage.getItem("Token")){
          localStorage.removeItem("Token");
          localStorage.removeItem("userEmail");
          localStorage.removeItem("tempEmail");
          localStorage.removeItem("messages");
          localStorage.removeItem("browseEmail");
          displayView("welcome")
          //logout();
          connection.close()
        }
        else if (localStorage.getItem("Token") == null){
          signIn(email,password);
        }
        break;
    }
    console.log('Server: ' + msg);
  };
}

function signIn(email, password){
  var xhttp = new XMLHttpRequest();
  var params = "email="+email+"&password="+password
  xhttp.open("POST", "login", true);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhttp.send(params);
  var submit;

  xhttp.onreadystatechange = function(){
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      result = xhttp.responseText;
      result = JSON.parse(result);
      if (result.response.success){
        token = result.response.result;
        localStorage.setItem("Token", token);
        localStorage.setItem("userEmail", email);
        localStorage.setItem("tempEmail", email);
        document.getElementById("errorsignin").innerHTML = result.response.message;
        displayView("profile");
      }
      else{
        document.getElementById("errorsignin").innerHTML = result.response.message;
      }
    }
  }
  //return submitFlag = submit;
}

function passwordCheck(pw, reppw){

  var xhttp = new XMLHttpRequest();
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

    xhttp.onreadystatechange = function(){
      if (xhttp.readyState == 4 && xhttp.status == 200) {
        result = xhttp.responseText;
        result = JSON.parse(result);
        document.getElementById("errorsignup").innerHTML = result.response.message;
      }
    }
    var params = "email="+data["email"]+"&password="+data["password"]+"&firstname="+data["firstname"]+"&familyname="+data["familyname"]+"&gender="+data["gender"]+"&city="+data["city"]+"&country="+data["country"];
    xhttp.open("POST", "signup", true);
    xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
    xhttp.send(params);
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
      getMessages(email,"home")
    }
    else{
      getMessages(email,"home")
      //document.getElementById('messages').innerHTML = "<h3>Message wall</h3>" + messages;
    }
  }
  else if (email != tempEmail) {
    getMessages(email,"home")
  }

  localStorage.setItem("tempEmail",email);

  personalInformation(email,"home");
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
  var xhttp = new XMLHttpRequest();
  localStorage.setItem("browseEmail",email)
  params = "email="+email+"&token="+localStorage.getItem("Token");
  xhttp.open('GET',"get_user_data_by_email?"+params,true);
  xhttp.send();

  xhttp.onreadystatechange = function(){
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      result = xhttp.responseText;
      result = JSON.parse(result);
      if (result.response.result !== undefined){
        personalInformation(email,"browse");
        getMessages(email,"browse");
        document.getElementById("errorbrowse").innerHTML = result.response.message;
      }
      else{
        document.getElementById("errorbrowse").innerHTML = result.response.message;
      }
    }
  }
  return submitFlag=false;
}

function changePassword(){
  var xhttp = new XMLHttpRequest();
  token = localStorage.getItem("Token");
  oldpassword = document.changepassword.oldpassword.value;
  newpassword = document.changepassword.newpassword.value;

  params = "token="+token+"&old_password="+oldpassword+"&new_password="+newpassword;
  xhttp.open("POST","change_password", true);
  xhttp.setRequestHeader("Content-Type","application/x-www-form-urlencoded");
  xhttp.send(params);

  xhttp.onreadystatechange = function(){
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      result = xhttp.responseText;
      result = JSON.parse(result);
      document.getElementById("errorchangepw").innerHTML = result.response.message;
      }
    }
  //Add response when password changed
  return submitFlag=false;
}

function logout(){
  var xhttp = new XMLHttpRequest();
  token = localStorage.getItem("Token");
  params = "token="+token

  xhttp.open("POST", "sign_out", true);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhttp.send(params);

  xhttp.onreadystatechange = function(){
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      result = xhttp.responseText;
      result = JSON.parse(result);
      if (result.response.success){
        localStorage.removeItem("Token");
        localStorage.removeItem("userEmail");
        localStorage.removeItem("tempEmail");
        localStorage.removeItem("messages");
        localStorage.removeItem("browseEmail");
      }
      displayView("welcome");
    }
  }
}

function personalInformation(mail,state){
  var xhttp = new XMLHttpRequest();
  params = "email="+mail+"&token="+localStorage.getItem("Token");
  xhttp.open('GET',"get_user_data_by_email?"+params,true);
  xhttp.send();
  var result;

  xhttp.onreadystatechange = function(){
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      res = xhttp.responseText;
      res = JSON.parse(res);
      user = res.response.result;
      result = user[0].email + "<br>" + user[0].firstname + "<br>" + user[0].familyname + "<br>" + user[0].gender + "<br>" + user[0].city + "<br>" + user[0].country;
      if (state == "home"){
        document.getElementById('infofields').innerHTML =  result;
      }
      else if (state == "browse") {
        document.getElementById("browseinfofields").innerHTML = result;
      }
    }
    else{
      result = "error"
    }
  }
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

function getMessages(email,state){
  var xhttp = new XMLHttpRequest();
  var messages;
  params = "email="+email+"&token="+localStorage.getItem("Token");
  xhttp.open('GET',"get_user_data_by_email?"+params, true);
  xhttp.send();

  xhttp.onreadystatechange = function(){
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      result = xhttp.responseText;
      result = JSON.parse(result);

      msgs = result.response.result[0].messages;
      msgLength = msgs.length;
      var messages = ""

      if(msgLength > 0){
        for(i=0; i<msgLength; i++){
          temp = JSON.parse(msgs[i][0])
          messages = messages + "<br>" + temp.writer + ": " + temp.content + "<br>";
        }
      }
      if (state == "home"){
        document.getElementById("messages").innerHTML = "<h3>Message wall</h3>" + messages;
        localStorage.setItem("messages", messages);
        document.getElementById("errorupdate").innerHTML = "Updated"
      }
      else if (state == "browse") {
        document.getElementById("browsemessages").innerHTML = "<h3>Message wall</h3>" + messages;
        localStorage.setItem("messages", messages);
        document.getElementById("errorbrowseupdate").innerHTML = "Updated"
      }
    }
  }
}

function postHome(){
  token = localStorage.getItem("Token");
  email = localStorage.getItem("tempEmail");
  cont = document.getElementById("messagearea").value;

  var xhttp = new XMLHttpRequest();
  params = "token="+token+"&message="+cont+"&email="+email;
  xhttp.open('POST',"post_message", true);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhttp.send(params);

  xhttp.onreadystatechange = function(){
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      result = xhttp.responseText;
      result = JSON.parse(result);
      document.getElementById("errorpost").innerHTML = result.response.message
    }
  }
  return submitFlag = false;
}

function postBrowse(){
  token = localStorage.getItem("Token");
  email = localStorage.getItem("browseEmail");
  cont = document.getElementById("browsemessagearea").value;

  var xhttp = new XMLHttpRequest();
  params = "token="+token+"&message="+cont+"&email="+email;
  xhttp.open('POST',"post_message", true);
  xhttp.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
  xhttp.send(params);

  xhttp.onreadystatechange = function(){
    if (xhttp.readyState == 4 && xhttp.status == 200) {
      result = xhttp.responseText;
      result = JSON.parse(result);
      document.getElementById("errorbrowsepost").innerHTML = result.response.message
    }
  }
  return submitFlag = false;
}
