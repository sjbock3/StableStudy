USE stablestudy;

INSERT INTO users(username, email, fName, lName, password, school) VALUES
	('danhn', 'danhn@smu.edu', 'Danh', 'Nguyen', 'Password1', 'SMU'),
	('afulsom', 'afulsom@smu.edu', 'Drew', 'Fulsom', 'password', 'SMU');

INSERT INTO locations(latitude, longitude, floor, buildingName, roomNumber, classroom, outdoor, open_space, study_room,chairs, computers, whiteboards, printers, projectors, restricted, pictureurl) VALUES
	(32.845576, -96.786349, 1, 'Florence', '106', 1, 0, 0, 0, 50, 0, 1, 0, 1, FALSE, NULL),
	(32.845576, -96.786360, 1, 'Florence', '107', 1, 0, 0, 0, 50, 0, 1, 0, 1, FALSE, NULL),
	(32.845569, -96.786333, 3, 'Florence', '308', 1, 0, 0, 0, 15, 0, 1, 0, 1, FALSE, NULL),
	(32.845576, -96.786349, 3, 'Florence', '307', 1, 0, 0, 0, 25, 0, 1, 0, 1, FALSE, NULL),
	(32.845553, -96.785869, 3, 'Florence', '305', 1, 0, 0, 0, 20, 0, 1, 0, 1, FALSE, NULL),
	(32.845576, -96.786349, 3, 'Florence', '306', 1, 0, 0, 0, 25, 0, 1, 0, 1, FALSE, NULL),
	(32.845996, -96.785861, 3, 'Florence', '304', 1, 0, 0, 0, 45, 0, 1, 0, 1, FALSE, NULL),
	(32.845591, -96.785826, 3, 'Florence', '302', 1, 0, 0, 0, 35, 0, 1, 0, 1, FALSE, NULL),
	(32.845589, -96.785799, 2, 'Florence', '201', 1, 0, 0, 0, 55, 0, 1, 0, 1, FALSE, NULL),
	(32.845576, -96.786360, 2, 'Florence', '207', 1, 0, 0, 0, 75, 0, 1, 0, 1, FALSE, NULL),
	(32.845549, -96.785799, 1, 'Florence', '100', 1, 0, 0, 0, 55, 0, 1, 0, 1, FALSE, NULL),
	(32.845589, -96.785799, 1, 'Florence', '101', 1, 0, 0, 0, 35, 0, 1, 0, 1, FALSE, NULL);