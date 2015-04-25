
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

$( document ).ready(function() {
  $.post('http://localhost/StableStudy/api/index.php/getMeetings', {"hostName": "afulsom"}, function(json, textStatus) {
	/*var json = [
{"meetingTime" : '2015-05-01 12:35:00',
"buildingName": "caruth",
"roomNumber": 150,
"username": "drew"},
{"meetingTime" : '2015-04-28 03:30:00',
"buildingName": "junkins",
"roomNumber": 160,
"username": "andrew"}
];*/
	json = JSON.parse(json);
            $('#meetingTable').DataTable({
		info: false,
		scrollY: 400,
		scrollCollapse: true,
		paging: false,
		searching: false,
		"data": json,
		"columns": [{"title":"Meeting Date and Time", "data": "meetingTime"},{"title":"Building and Room Number", "data": "buildingName" , "orderable": false ,"render": function(data, type, row, meta){return '<a href="index.html">'+data + ' '+ row["roomNumber"] +'</a>';}, "targets": 0},{"title":"Room Number", "data": "roomNumber", "visible": false, "orderable": false},{"title":"Host", "data": "users", "orderable": false}]});
});
  $.post('http://localhost/StableStudy/api/index.php/seeFavorites', {"username": "afulsom"}, function(json, textStatus) {

	/*json = [{"buildingName":"Caruth",
		"roomNumber":145},
		{"buildingName":"Junkins",
		"roomNumber":101}];*/
	json = JSON.parse(json);
	$('#favoritesTable').DataTable({
		info: false,
		scrollY: 400,
		scrollCollapse: true,
		paging: false,
		searching: false,
		"data": json,
		"columnDefs": [{"data": "buildingName", "render": function(data, type, row, meta){return '<a href="index.html">'+data + ' '+ row["roomNumber"] +'</a>';}, "targets": 0}, {"title":"Room Number", "data": "roomNumber", "visible":false, "targets": [1]}]});
});
        //});
});


