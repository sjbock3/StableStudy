
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for(var i=0; i<ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1);
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}


function meetingForm(form) {
	var users = document.forms.meeting;
	console.log(users);
        var Request = new XMLHttpRequest();

	Request.open('POST', './api/index.php/createMeeting', true);

	Request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");	


	Request.onreadystatechange = function () {
	  if (this.readyState === 4) {
    		console.log('Status:', this.status);
    		console.log('Headers:', this.getAllResponseHeaders());
    		console.log('Body:', this.responseText);

		//window.location.href = "index.html";
  	  }
	};
	/*var users; //= "[";
	for (i = 0; i < counter; i++){
	users += form.users.value;
	users += ","; 
	}
	users += "]"*/
	var body = "hostName="+"afulsom"+"&buildingName="+form.buildingName.value+"&roomNumber="+form.roomNumber.value+"&meetingTime="+form.date.value + " " +form.time.value+"&users="+form.elements['users[]'].value;
	console.log(body);

	Request.send(body);

	}

var counter = 1;
var limit = 25;
function addInput(divName){
     if (counter == limit)  {
          alert("You have reached the limit of adding " + limit + " users");
     }
     else {
	  var tableRef = document.getElementById('formTable').getElementsByTagName('tbody')[0];
	  var newRow = tableRef.insertRow(tableRef.rows.length);
	  var newCell1  = newRow.insertCell(0);
	  var newCell2  = newRow.insertCell(1);
          newCell1.innerHTML = "<tr><td><h4>User to invite #" + (counter + 1) + ": </td><td>";
	  newCell2.innerHTML = "<input type=\"text\" name=\"users[" + counter + "]\" form=\"meeting\"></td></tr>";
          counter++;
     }
}


