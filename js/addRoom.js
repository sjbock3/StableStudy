function addRoomForm(form) {

    var Request = new XMLHttpRequest();

	Request.open('POST', './api/index.php/addLocation', true);

	Request.setRequestHeader('Content-Type', "application/x-www-form-urlencoded");	
	
	var body = "latitude="+form.latitude.value+"&longitude="+forom.longitude.value+
						"&floor="+form.floor.value+"&buildingName="+form.buildingName.value+
						"&outdoor="+form.outdoor.value+"&open_space="+form.open_space.value+
						"&study_room="+form.study_room.value+"&chairs="+form.chairs.value+
						"&computers="form.computers.value+"&whiteboards="+form.whiteboards.value+
						"&printers="form.printers.value+"&projectors="+form.projectors.value+
						"&restricted="form.restricted.value+"&pictureurl="+NULL;

	Request.send(body);

}