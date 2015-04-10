function meetingForm(form) {

    var re = /^([0-9]|1[0-2]):[0-5][0-9]$/;
    if(!re.test(form.time.value))
    {
	alert("Please enter a valid time.");
	return false;
    }
   /*
        var Request = new XMLHttpRequest();

	Request.open('POST', './api/index.php/user', true);

	Request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");	


	Request.onreadystatechange = function () {
	  if (this.readyState === 4) {
    		console.log('Status:', this.status);
    		console.log('Headers:', this.getAllResponseHeaders());
    		console.log('Body:', this.responseText);
		window.location.href = "registrationPage.html";
  	  }
	};
	
	var body = "fName="+form.firstname.value+"&lName="+form.lastname.value+"&school="+form.school.value+"&username="+form.username.value+"&email="+form.email.value+"&password="+form.password.value;


	Request.send(body);*/

}

var counter = 1;
var limit = 5;
function addInput(divName){
     if (counter == limit)  {
          alert("You have reached the limit of adding " + counter + " users");
     }
     else {
	  var tableRef = document.getElementById('formTable').getElementsByTagName('tbody')[0];
	  var newRow = tableRef.insertRow(tableRef.rows.length);
	  var newCell1  = newRow.insertCell(0);
	  var newCell2  = newRow.insertCell(1);
          newCell1.innerHTML = "<p>User to invite #" + (counter + 1) + ": </p>";
	  newCell2.innerHTML = "<input type='text' name='users[]'>";
          counter++;
     }
}
