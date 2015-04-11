function getOutput() {
	getRequest(
		'api/index.php',
		drawOutput,
		drawError
	);
	return false;
}

function drawError(){
	var container = document.getElementById('output');
	container.innerHTML = 'error';
}

function drawOutput () {
	var container = document.getElementById('output');
	container.innerHTML = responseText;
}

function loginUser(form) {

	
	/*var xmlhttprequest = new XMLHttpRequest();
	
	xmlhttprequest.open('POST', './api/index.php/loginUser', true);
	
	Request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");	
	
	var body = "email="+form.email.value+"&password="+form.password.value;
	
	xmlhttprequest.send(body);*/

     var status;
     var fName;
     var lName;
     var school;
     var username;
	
	$.post('./api/index.php/loginUser', {"email": form.email.value, "password": form.password.value}, function( data ) {
		alert('inside post function');
        console.log(data.username);
		console.log(data.school);
		status = data.status;
        fName = data.fName;
        lName = data.lName;
        school = data.school;
        username = data.username;

        setMultipleCookies();

	}, "json");


	//setCookie(status, fName, lName, school, username);

}

function setCookie(status, fName, lName, school, username) {
	document.cookie="status="+status+"; fname="+fname+"; lname="+lname+"; school="+school+"; username="+username;

	var c = document.cookie;
}


function setMultipleCookies(names,values){

    var counter;
    for(counter = 0;counter<names.length;counter++){
        setCookie(names[counter],values[counter],1);
    }

    //console.log(document.cookie);
}