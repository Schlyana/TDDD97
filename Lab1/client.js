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

function signIn(email, password){
  alert(email)
  alert(password)
  result = serverstub.signIn(email,password)

  if (result.success){
    alert(result.message)
    token = result.data
    return submitFlag=true;
  }
  else {
    alert(result.message)
    return submitFlag=false;
  }
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
      'gender': document.signup.gender.value, /*<---- FEL*/
      'city': document.signup.city.value,
      'country': document.signup.country.value
    };

    result = serverstub.signUp(data)
    if (result.success){
      alert(result.message)
      return submitFlag=true;
    }
    else if (!result.success) {
      alert(result.message)
      return submitFlag=false;
    }
    else {
      alert("Something went wrong!")
    }
  }
}
