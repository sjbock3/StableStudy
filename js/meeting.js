function meetingForm(form) {

    var re = /^([0-9]|1[0-2]):[0-5][0-9]$/;
    if(!re.test(form.time.value))
    {
	alert("Please enter a valid time.");
	return false;
    }
   
        var Request = new XMLHttpRequest();

	Request.open('POST', './api/index.php/createMeeting', true);

	Request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");	


	Request.onreadystatechange = function () {
	  if (this.readyState === 4) {
    		console.log('Status:', this.status);
    		console.log('Headers:', this.getAllResponseHeaders());
    		console.log('Body:', this.responseText);
		window.location.href = "index.html";
  	  }
	};
	var users = "[";
	for (i = 0; i < counter; i++){
	users += users[i];
	users += ","; 
	}
	users += "]"
	var body = "hostName="+"afulsom"+"&buildingName="+form.buildingName.value+"&roomNumber="+form.roomNumber.value+"&meetingTime="+form.date.value + " " +form.time.value+"&users="+users;


	Request.send(body);

}

var counter = 1;
var limit = 5;
function addInput(divName){
     if (counter == limit)  {
          alert("You have reached the limit of adding " + limi + " users");
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
