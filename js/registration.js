function registrationForm(form) {

    var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    if(!re.test(form.email.value))
    {
	alert("Please enter a valid email address.");
	return false;
    }

    re = /^\w+$/;
    if(!re.test(form.username.value))
    {
	alert("Username must contain only alphanumeric characters and underscores.");
	return false;
    }

    if(form.password.value == form.verifyPassword.value)
    {
	re = /[0-9]/;
	if(!re.test(form.password.value))
	{
	    alert("Password must contain at least one number.");
	    return false;
	}

	re = /[a-z]/;
	if(!re.test(form.password.value))
	{
	    alert("Password must contain at least one lowercase letter.");
	    return false;
	}

	re = /[A-Z]/;
	if(!re.test(form.password.value))
	{
	    alert("Password must contain at least one uppercase letter.");
	    return false;
	}

    }
    else
    {
	alert("Please verify that your passwords match.");
	return false;
    }

        var Request = new XMLHttpRequest();

	Request.open('POST', './api/index.php/user', true);

	Request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");	


	Request.onreadystatechange = function () {
	  if (this.readyState === 4) {
            console.log('I finished');
    		console.log('Status:', this.status);
    		console.log('Headers:', this.getAllResponseHeaders());
    		console.log('Body:', this.responseText);

          //setting the cookies
          var names = ["fName","lName","school","username"];
          var values = [form.firstname.value, form.lastname.value, form.school.value, form.username.value];
          console.log('starting names');
          console.log(names);
          console.log(values);
          setMultipleCookies(names,values);
          console.log(document.cookie);
          window.location.href = 'index.html';
		//window.location.href = "registrationPage.html";
  	  }
	};
	
	var body = "fName="+form.firstname.value+"&lName="+form.lastname.value+"&school="+form.school.value+"&username="+form.username.value+"&email="+form.email.value+"&password="+form.password.value;


	Request.send(body);

/*    //need to set the cookies
    var names = ["fName","lName","school","username"];
    var values = [form.firstname.value, form.lastname.value, form.school.value, form.username.value];
    setMultipleCookies(names,values);
    console.log(document.cookie);
    window.location.href = '/index.html';*/



}

function setMultipleCookies(names,values){

    var counter;
    for(counter = 0;counter<names.length;counter++){
        setCookie(names[counter],values[counter],1);
    }

    //console.log(document.cookie);
}

function setCookie(cname,cvalue,exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires=" + d.toGMTString();
    document.cookie = cname+"="+cvalue+"; "+expires;
}
