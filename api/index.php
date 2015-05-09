<?php //completely written by 
    require 'vendor/autoload.php';
    $app = new \Slim\Slim();
    $server = "localhost";
    $user = "stableuser";
    $pass = "guestpass";
    $dbname = "stablestudy";
    $mysqli = new mysqli($server, $user, $pass, $dbname);
    if ($mysqli->connect_error)
        die("Connection failed: " . $mysqli->connect_error);

    
    $app->post('/loginUser', function(){
        session_start();
        global $mysqli;
        $email = $_POST['email'];
        $password = $_POST['password'];
        $result = $mysqli->query("SELECT * FROM users WHERE email = '$email' AND password = '$password'");
        
        
        
        $row = $result->fetch_assoc();
        if(($row === NULL)) {
            $jsonArray = array(
                'status' => 'Failure',
                'fName'=> NULL,
                'lName'=> NULL,
                'school'=> NULL,
                'username'=> NULL,
                'favorites'=>NULL);
            echo json_encode($jsonArray);
            return;

        }
        
        
        else {
            $username = $row['username'];
            $faves = $mysqli->query("SELECT favRoom FROM favorites WHERE username = '$username'");
            $faves = $faves->fetch_all(MYSQL_NUM);
            $len = count($faves);
            $favArr = array();
            for($i = 0; $i < $len; $i++){
                $favArr[$i] = getRoom($faves[$i][0]);
            }

            $jsonArray = array(
                'status' => 'Success',
                'fName'=> $row['fName'],
                'lName'=> $row['lName'],
                'school'=> $row['school'],
                'username'=> $username,
                'favorites'=>$favArr);
            
            echo json_encode($jsonArray);
            return;
        }
        
        
    });

    /*
     * if option == 1, send email
     * if option == 2, send username
     * if option == 3, send first and last name
     */

    $app->post('/getUser', function(){
        global $mysqli;
        $option = $_POST['option'];

        if ($option == 1){
            $email = $_POST['email'];
            echo json_encode(fromEmail($email));
        }

        else if ($option == 2){
            $username = $_POST['username'];
            echo json_encode(fromUsername($username));
        }

        else if ($option == 3){
            $first = $_POST['firstName'];
            $last = $_POST['lastName'];
            echo json_encode(fromName($first, $last));
        }

        else{
            echo json_encode(array());
        }

        return;
    });

    $app->post('/getFavorites', function(){
        global $mysqli;
        $username = $_POST['username'];
        $faves = $mysqli->query("SELECT favRoom FROM favorites WHERE username = '$username'");
        $faves = $faves->fetch_all(MYSQL_NUM);
        $len = count($faves);
        $favArr = array();
        for($i = 0; $i < $len; $i++){
            $favArr[$i] = getRoom($faves[$i][0]);
        }

        echo json_encode($favArr);
        return;

    });
    
    $app->post('/user', function(){
    
        session_start();
        global $mysqli;
        $fName = $_POST['fName'];
        $lName = $_POST['lName'];
        $school = $_POST['school'];
        $username = $_POST['username'];
        $email = $_POST['email'];
        $password = $_POST['password'];
        
        $doesUserExist = $mysqli->query("SELECT * FROM users WHERE username = '$username'");
        $doesEmailExist = $mysqli->query("SELECT * FROM users WHERE email = '$email'");
        
        //if username or email exists
        if($doesUserExist === NULL || $doesEmailExist === NULL)
        {
            $jsonArray = array( 'u_id' => -1);
            echo json_encode($jsonArray);
            return;
        }
        
        //else add in new user
        else
        {
            
            if($mysqli->query("INSERT INTO users(fName, lName, school, username, email, password) VALUES ('$fName', '$lName', '$school', '$username', '$email', '$password')")){
            }
            else {
                //return error
                    $jsonArray = array('u_id' => -2);
                    echo json_encode($jsonArray);
                    return;
               
            }
            $jsonArray = array('u_id' => 1);
            
            echo json_encode($jsonArray);
            return;
        }
        
        //return error
        $jsonArray = array('u_id' => -2);
        echo json_encode($jsonArray);
        return;
        
    });
    
    $app->get('/locations', function(){
        global $mysqli;
        $locationList = $mysqli->query("SELECT * FROM locations");
        echo json_encode($locationList->fetch_all(MYSQLI_ASSOC)); 
        return;
        
    });

    $app->get('/buildings', function(){
        global $mysqli;
        $buildingList = $mysqli->query("SELECT DISTINCT buildingName FROM locations");

        echo json_encode($buildingList->fetch_all(MYSQLI_ASSOC));


        return;
        
    });
    /* type 1 = classrooom,
     * type 2 = outdoor,
     * type 3 = open space,
     * type 4 = study room
     */
    $app->get('/locinfo', function(){
        global $mysqli;
        $result = $mysqli->query("SELECT * FROM locations");
        $locationList = $result->fetch_all(MYSQLI_ASSOC);
        $len = count($locationList);
        $all_loc = array();
        for ($i = 0; $i < $len; $i++){
            // Convert classroom type
            $roomType = NULL;
            $classroom = $locationList[$i]['classroom'];
            $study_room = $locationList[$i]['study_room'];
            $open_space = $locationList[$i]['open_space'];
            $outdoor = $locationList[$i]['outdoor'];
            if ($classroom == 1){
                $roomType = 'classroom';
            }
            if ($outdoor == 1){
                $roomType = 'outdoor';
            }
            if ($open_space == 1){
                $roomType = 'open_space';
            }
            if ($study_room == 1){
                $roomType = 'study_room';
            }
            //

            //get picture
            $roomid = $locationList[$i]['id'];
            $pictureList = NULL;

            $result = $mysqli->query("SELECT * FROM pictures WHERE room_id = '$roomid'");
            $pictureList =  $result->fetch_all(MYSQL_ASSOC);
            $pictureArr = array();
            $length = count($pictureList);
            for ($j = 0; $j < $length; $j++){

                $temp = array(
                    'upload_user'=> "",
                    'thumbnail_root' => "",
                    'modification_date' => NULL,
                    'url' => $pictureList[$j]['pictureurl'],
                    'upload_application'=>"",
                    'display_index'=> 0,
                    'height'=>NULL,
                    'width'=>NULL,
                    'creation_date'=>NULL,
                    'content-type'=>"",
                    'id'=>$pictureList[$j]['picture_id'],
                    'description'=>""
                );
                $pictureArr[$j]=($temp);
            }

            //
            $json = array(
                'capacity' => $locationList[$i]['chairs'],
                'name' => $locationList[$i]['buildingName']." ".$locationList[$i]['roomNumber'],
                'external_id' => NULL,
                'external_info' => NULL,
                'uri' => "",
                'available_hours' => NULL,
                'manager' => "",
                'last_modified' => NULL,
                'etag' => "",
                'type' => $roomType,
                'images' => $pictureArr,
                'organization' => "",
                'display_access_restrictions' => "",
                'id' => $roomid,
                'location' =>
                    array(
                    'floor' => $locationList[$i]['floor'],
                    'height_from_sea_level' => NULL,
                    'longitude' => $locationList[$i]['longitude'],
                    'latitude' => $locationList[$i]['latitude'],
                    'building_name' => $locationList[$i]['buildingName']
                    )


                );
            $all_loc[$i] = $json;
        }
        echo json_encode($all_loc);
        return;

    });

    $app->get('/getWeather', function(){
       $dallasLatitude = 32.7767;
       $dallasLongitude = -96.7970;
       $weatherInfo = file_get_contents("https://api.forecast.io/forecast/437b36f288ccf42bfab7b22ecd179110/32.7767,-96.7970");
       //echo $weatherInfo;
       $weatherJSON = json_decode($weatherInfo, true);
       $temperature = $weatherJSON['currently']['temperature'];
       $precipitation = $weatherJSON['currently']['precipProbability'];
       $windSpeed = $weatherJSON['currently']['windSpeed'];
       $storm = $weatherJSON['currently']['nearestStormDistance'];
       $sunny = $weatherJSON['currently']['cloudCover'];
       if ($storm < 8) {
        $storm = 'true';
       }
       else {
        $storm = 'false';
       }
       if($windSpeed > 20) {
        $windSpeed = 'true';
       }
       else {
        $windSpeed = 'false';
       }
       if ($precipitation > 0.2) {
        $precipitation = 'true';
       }
       else {
        $precipitation = 'false';
       }
       if ($sunny < .5) {
        $sunny = 'true';
       }
       else {
        $sunny = 'false';
       }

       $weatherArray = array('temperature' => $temperature,
        'precipitation' => $precipitation, 'windy' => $windSpeed, 'storm' => $storm, 'sunny' => $sunny);
       echo json_encode($weatherArray);
       

       return;
   });

    $app->post('/addLocation', function(){
       global $mysqli;
        $buildingName = $_POST['buildingName'];
        $roomNumber = $_POST['roomNumber'];
        $longitude = $_POST['longitude'];
        $latitude = $_POST['latitude'];
        $classroom = $_POST['classroom'];
        $outdoor = $_POST['outdoor'];
        $open_space = $_POST['open_space'];
        $study_room = $_POST['study_room'];
        $floor = $_POST['floor'];
        $chairs = $_POST['chairs'];
        $computers = $_POST['computers'];
        $whiteboards = $_POST['printers'];
        $projectors = $_POST['projectors'];
        $printers = $_POST['printers'];
        $restricted = $_POST['restricted'];
        
        $tempQuery = $mysqli->query("SELECT * FROM locations"); //used to generate picture file name
        $fileNumber = mysqli_num_rows($tempQuery) + 1;
        
        
        $target_file = $_FILES['pictureurl']['name'];
        $url = '/var/www/upload/'. $fileNumber.".jpg";
        $url2 = '/var/www/html/StableStudy/upload/'. $fileNumber.'.jpg';

        
        $pictureurl = $url;




        $existingRoom = $mysqli->query("SELECT * FROM locations WHERE buildingName = '$buildingName' AND roomNumber = '$roomNumber'");
        if($existingRoom->fetch_assoc() !== NULL){
            echo json_encode(array('status'=>'failed', 'problem'=>1));
            return;
        }
        else{
            $mysqli->query("INSERT INTO locations(latitude, longitude, floor, buildingName, roomNumber, classroom, outdoor, open_space, study_room, chairs, computers, whiteboards, printers, projectors, restricted)
                            VALUES('$latitude', '$longitude', '$floor', '$buildingName', '$roomNumber', '$classroom', '$outdoor', '$open_space', '$study_room', '$chairs', '$computers', '$whiteboards', '$printers', '$projectors', '$restricted')");
            $getRoomid = $mysqli->query("SELECT id FROM locations WHERE buildingName = '$buildingName' AND roomNumber = '$roomNumber'");
            $getRoomid = $getRoomid->fetch_assoc();
            $roomid = $getRoomid['id'];
            $mysqli->query("INSERT INTO pictures(room_id, pictureurl) VALUES('$roomid', '$pictureurl')");
            echo json_encode(array('status'=>'success', 'problem'=>0));
            move_uploaded_file($_FILES['pictureurl']['tmp_name'], $url2);
            return;
        }

    });
/*
 * problem id => 0 : no problems
 * problem id => 1 : room not in DB
 * problem id => 2 : host has another meeting at this time
 * problem id => 3 : room has another meeting at this time
 * problem id => 4 : other user doesn't exist in DB
 */
    $app->post('/createMeeting', function(){
        global $mysqli;
        $hostName = $_POST['hostName'];
        $buildingName = $_POST['buildingName'];
        $roomNumber = $_POST['roomNumber'];
        $otherUsers = $_POST['users'];  
        if(isset($_POST['meetingTime'])){
            $meetingTime = $_POST['meetingTime'];             
        }
        else if (isset($_POST['time']) && isset($_POST['date'])) {
            $time = $_POST['time'];
            $date = $_POST['date'];
            $meetingTime = $date." ".$time;

        }

        //get location id
        $getRoomID = $mysqli->query("SELECT id FROM locations WHERE buildingName= '$buildingName' AND roomNumber= '$roomNumber'");
        $roomArr = $getRoomID->fetch_assoc();

        if ($roomArr === NULL){

            echo json_encode(array('status' => 'failed', 'problem' => 1));
            return;
        }
        else {
            $roomID = $roomArr['id'];
        }

        //personal scheduling conflict
        $existingMeet = $mysqli->query("SELECT * FROM meetings WHERE hostName = '$hostName' AND meetingTime = '$meetingTime'");
        if ($existingMeet->fetch_assoc() != NULL){
            echo json_encode(array('status' => 'failed', 'problem' => 2));
            return;
        }
        //room scheduling conflict
        $existingMeet = $mysqli->query("SELECT * FROM meetings WHERE roomID = '$roomID' AND meetingTime = '$meetingTime'");
        if ($existingMeet->fetch_assoc() != NULL){
            echo json_encode(array('status' => 'failed', 'problem' => 3));
            return;
        }

        if($mysqli->query("INSERT INTO meetings(hostName, meetingTime, roomID) VALUES('$hostName', '$meetingTime', '$roomID')")){

        }
        else{
            echo 'db done goofed';
        }

        $getMeetingID = $mysqli->query("SELECT meetingID FROM meetings WHERE hostName = '$hostName' AND roomID = '$roomID' AND meetingTime = '$meetingTime'");
        $meetingIDarr = $getMeetingID->fetch_assoc();
        $meetingID = $meetingIDarr['meetingID'];

        $len = count($otherUsers);

        for ($i = 0; $i < $len; $i++){
            $username = $otherUsers[$i];
            if($mysqli->query("INSERT INTO meetingUsers(meeting_id, users) VALUES('$meetingID', '$username')")){
            }
            else{
                // other user might not exist in database
                echo json_encode(array('status'=>'failed', 'problem' => 4));
                //delete the meeting that was inserted

                $mysqli->query("DELETE FROM meetingUsers WHERE meeting_id = '$meetingID'");
                $mysqli->query("DELETE FROM meetings WHERE meetingID = '$meetingID'");

                return;
            }
        }

        echo json_encode(array('status'=>'success', 'problem' => 0));
        return;

    });

    $app->post('/getMeetings', function(){
        global $mysqli;
        $hostName = $_POST['hostName'];
        $host_list = $mysqli->query("SELECT meetingTime, buildingName, roomNumber FROM meetings INNER JOIN locations ON meetings.roomID = locations.id WHERE hostName = '$hostName'");
        $meeting_list = $mysqli->query("SELECT meetingTime, buildingName, roomNumber FROM meetings INNER JOIN meetingUsers ON meetings.meetingID = meetingUsers.meeting_id
                                        INNER JOIN locations ON meetings.roomID = locations.id WHERE users = '$hostName'");

        $meeting_list = $meeting_list->fetch_all(MYSQLI_ASSOC);
        $host_list = $host_list->fetch_all(MYSQLI_ASSOC);
        $result = array_merge($host_list, $meeting_list);
        echo json_encode($result);
        return;
    });

    $app->post('/filter', function(){
        global $mysqli;

		$chairs = $_GET['chairs'];
        $classroom = $_GET['classroom'];
        $outdoor = $_GET['outdoor'];
        $open_space = $_GET['open'];
        $study_room = $_GET['study_room'];
        $computers = 0;//$_POST['computers'];
        $whiteboards = 1;//$_POST['whiteboards'];
        $printers = 0;//$_POST['printers'];
        $projectors = 1;// $_POST['projectors'];
        $restricted = 0;//$_POST['restricted'];

        $finalArr = array();

        if ($classroom) {
            $result = $mysqli->query("SELECT id FROM locations WHERE classroom = 1 AND
              chairs >= '$chairs' AND computers >= '$computers' AND whiteboards >= '$whiteboards' AND
              printers >= '$printers' AND projectors >= '$projectors' AND restricted >= '$restricted'");

            $result = $result->fetch_all(MYSQL_NUM);
            $len = count($result);

            for($i = 0; $i < $len; $i++){
                array_push($finalArr, getRoom($result[$i][0]));
            }
        }

        if ($outdoor) {
            $result = $mysqli->query("SELECT id FROM locations WHERE outdoor = 1 AND
              chairs >= '$chairs' AND computers >= '$computers' AND whiteboards >= '$whiteboards' AND
              printers >= '$printers' AND projectors >= '$projectors' AND restricted >= '$restricted'");

            $result = $result->fetch_all(MYSQL_NUM);
            $len = count($result);

            for($i = 0; $i < $len; $i++){
                array_push($finalArr, getRoom($result[$i][0]));
            }
        }

        if ($open_space) {
            $result = $mysqli->query("SELECT id FROM locations WHERE open_space = 1 AND
              chairs >= '$chairs' AND computers >= '$computers' AND whiteboards >= '$whiteboards' AND
              printers >= '$printers' AND projectors >= '$projectors' AND restricted >= '$restricted'");

            $result = $result->fetch_all(MYSQL_NUM);
            $len = count($result);

            for($i = 0; $i < $len; $i++){
                array_push($finalArr, getRoom($result[$i][0]));
            }
        }

        if ($study_room) {
            $result = $mysqli->query("SELECT id FROM locations WHERE study_room = 1 AND
              chairs >= '$chairs' AND computers >= '$computers' AND whiteboards >= '$whiteboards' AND
              printers >= '$printers' AND projectors >= '$projectors' AND restricted >= '$restricted'");

            $result = $result->fetch_all(MYSQL_NUM);
            $len = count($result);

            for($i = 0; $i < $len; $i++){
                array_push($finalArr, getRoom($result[$i][0]));
            }
        }

        echo json_encode($finalArr);
        return;


    });

$app->get('/search', function(){
    global $mysqli;

    $query  = explode('&', $_SERVER['QUERY_STRING']);
    $params = array();
    foreach( $query as $param )
    {
        list($name, $value) = explode('=', $param);
        $params[urldecode($name)][] = urldecode($value);
    }

    $classroom = $params['classroom'][0];
    $outdoor = $params['outdoor'][0];
    $open_space = $params['open_space'][0];
    $study_room = $params['study_room'][0];
    $chairs = $params['chairs'][0];
    $computers = $params['computers'][0];
    $whiteboards = $params['whiteboards'][0];
    $printers = $params['printers'][0];
    $projectors = $params['projectors'][0];
    $restricted = $params['restricted'][0];
    $buidlings = array("building_name"=>"NOT NULL");
    $buildingquery = "";
    $query = "CREATE OR REPLACE VIEW search AS SELECT * FROM locations";
    if (isset($params['building_name'])){
        $buildings = $params['building_name'];
        $len = count($buildings);
        for($i = 0; $i < $len; $i++){
            $buildingquery = $buildingquery."buildingName = '$buildings[$i]' ";
            if ($i < $len-1)
                $buildingquery = $buildingquery."OR ";
        }
        //echo var_dump($buildings); //testing
        //echo $buildingquery; //testing
        $query = "CREATE OR REPLACE VIEW search AS SELECT * FROM locations WHERE ".$buildingquery;

    }
    //echo $query;

    $mysqli->query($query);

    $finalArr = array();

    if ($classroom == 0 && $outdoor == 0 && $open_space == 0 && $study_room == 0){
        $result = $mysqli->query("SELECT id FROM search WHERE
          chairs >= '$chairs' AND computers >= '$computers' AND whiteboards >= '$whiteboards' AND
          printers >= '$printers' AND projectors >= '$projectors' AND restricted >= '$restricted'");

        $result = $result->fetch_all(MYSQL_NUM);
        $len = count($result);

        for($i = 0; $i < $len; $i++){
            array_push($finalArr, getRoom($result[$i][0]));
        }
        echo json_encode($finalArr);
        return;
    }

    if ($classroom) {
        $result = $mysqli->query("SELECT id FROM search WHERE classroom = 1 AND
          chairs >= '$chairs' AND computers >= '$computers' AND whiteboards >= '$whiteboards' AND
          printers >= '$printers' AND projectors >= '$projectors' AND restricted >= '$restricted'");

        $result = $result->fetch_all(MYSQL_NUM);
        $len = count($result);

        for($i = 0; $i < $len; $i++){
            array_push($finalArr, getRoom($result[$i][0]));
        }
    }

    if ($outdoor) {
        $result = $mysqli->query("SELECT id FROM search WHERE outdoor = 1 AND
          chairs >= '$chairs' AND computers >= '$computers' AND whiteboards >= '$whiteboards' AND
          printers >= '$printers' AND projectors >= '$projectors' AND restricted >= '$restricted'");

        $result = $result->fetch_all(MYSQL_NUM);
        $len = count($result);

        for($i = 0; $i < $len; $i++){
            array_push($finalArr, getRoom($result[$i][0]));
        }
    }

    if ($open_space) {
        $result = $mysqli->query("SELECT id FROM search WHERE open_space = 1 AND
          chairs >= '$chairs' AND computers >= '$computers' AND whiteboards >= '$whiteboards' AND
          printers >= '$printers' AND projectors >= '$projectors' AND restricted >= '$restricted'");

        $result = $result->fetch_all(MYSQL_NUM);
        $len = count($result);

        for($i = 0; $i < $len; $i++){
            array_push($finalArr, getRoom($result[$i][0]));
        }
    }

    if ($study_room) {
        $result = $mysqli->query("SELECT id FROM search WHERE study_room = 1 AND
          chairs >= '$chairs' AND computers >= '$computers' AND whiteboards >= '$whiteboards' AND
          printers >= '$printers' AND projectors >= '$projectors' AND restricted >= '$restricted'");

        $result = $result->fetch_all(MYSQL_NUM);
        $len = count($result);

        for($i = 0; $i < $len; $i++){
            array_push($finalArr, getRoom($result[$i][0]));
        }
    }
    echo json_encode($finalArr);
    return;


    });

    $app->post('/share', function(){
        global $mysqli;
        $host = $_POST['hostName'];
        $buildingName = $_POST['buildingName'];
        $roomNumber = $_POST['roomNumber'];
        $other = $_POST['username'];

        $search = $mysqli->query("SELECT id FROM locations WHERE buildingName = '$buildingName' AND roomNumber = '$roomNumber'");
        $search = $search->fetch_assoc();
        $shared_room = $search['id'];

        echo $shared_room;
        $check = $mysqli->query("SELECT share_id FROM shares WHERE shared_room = '$shared_room' AND host = '$host' AND other = '$other'");
        if($check->fetch_assoc() !== NULL){
            echo json_encode(array("status"=>"failed"));
            return;
        }
        if($mysqli->query("INSERT INTO shares(shared_room, host, other) VALUES('$shared_room', '$host', '$other')")){
            echo json_encode(array("status"=>"success"));
        }

        else {
            echo json_encode(array("status"=>"failed"));
        }

        return;

    });

	$app->get('/getRoom', function(){
		$roomID = $_GET['id'];
		$json = getRoom($roomID);
		echo json_encode($json);
		return;
	});


    $app->post('/addFavorite', function(){
        global $mysqli;
        $username = $_POST['username'];
        $buildingName = $_POST['buildingName'];
        $roomNumber = $_POST['roomNumber'];

        $getID = $mysqli->query("SELECT id FROM locations WHERE buildingName = '$buildingName' AND roomNumber = '$roomNumber'");
        $roomID = $getID->fetch_assoc();

        // room doesn't exist
        if($roomID === NULL){
            echo json_encode(array('status'=>'failed'));
            return;
        }
        else{

            $checkExisting = $mysqli->query("SELECT * FROM favorites WHERE username = '$username' AND roomID = '$roomID'");
            // if user already has that room as favorite
            if ($checkExisting->fetch_assoc() === NULL){
                echo json_encode(array('status'=>'failed'));
                return;
            }

            $mysqli->query("INSERT INTO favorites(username, favRoom) VALUES('$username', '$roomID')");
            echo json_encode(array('status'=>'success'));
            return;
        }
    });

    $app->post('/seeFavorites', function(){
        global $mysqli;
        $username = $_POST['username'];
        $favorite_arr = $mysqli->query("SELECT latitude, longitude, floor, buildingName, roomNumber, chairs, computers, whiteboards, printers, projectors, restricted
            FROM favorites INNER JOIN locations on favorites.favRoom = locations.id WHERE username = '$username'");
        $faves = $favorite_arr->fetch_all(MYSQLI_ASSOC);
        echo json_encode($faves);
        return;

    });

    $app->post('/getReviews', function(){
        global $mysqli;
        $buildingName = $_POST['building'];
        $roomNumber = $_POST['roomNumber'];

        $search = $mysqli->query("SELECT id FROM locations WHERE buildingName = '$buildingName' AND $roomNumber = '$roomNumber'");
        $search = $search->fetch_assoc();
        $room = $search['id'];
        $reviewList = $mysqli->query("SELECT writer, comment FROM reviews WHERE room ='$room'");
        $reviews = $reviewList->fetch_all(MYSQLI_ASSOC);
        echo json_encode($reviews);
        return;
    });

    $app->post('/writeReview', function(){
       global $mysqli;
        $review = $_POST['review'];
        $writer = $_POST['username'];
        $buildingName = $_POST['building'];
        $roomNumber = $_POST['roomNumber'];

        $search = $mysqli->query("SELECT id FROM locations WHERE buildingName = '$buildingName' AND $roomNumber = '$roomNumber'");
        $search = $search->fetch_assoc();
        $roomID = $search['id'];

        $mysqli->query("INSERT INTO reviews(room, writer, comment) VALUES('$roomID', '$writer', '$review')");
    });
    $app->run();

    function getRoom($roomID){
        global $mysqli;
        $room = $mysqli->query("SELECT * FROM locations WHERE id = '$roomID'");
        $room = $room->fetch_assoc();

        $classroom = $room['classroom'];
        $study_room = $room['study_room'];
        $outdoor = $room['outdoor'];
        $open_space = $room['open_space'];
        $roomType = NULL;
        if ($classroom == 1){
            $roomType = 'classroom';
        }
        if ($outdoor == 1){
            $roomType = 'outdoor';
        }
        if ($open_space == 1){
            $roomType = 'open_space';
        }
        if ($study_room == 1) {
            $roomType = 'study_room';
        }

        //get picture
        $pictureList = NULL;

        $result = $mysqli->query("SELECT * FROM pictures WHERE room_id = '$roomID'");
        $pictureList =  $result->fetch_all(MYSQL_ASSOC);
        $pictureArr = array();
        $length = count($pictureList);

        for ($j = 0; $j < $length; $j++){

            $temp = array(
                'upload_user'=> "",
                'thumbnail_root' => "",
                'modification_date' => NULL,
                'url' => $pictureList[$j]['pictureurl'],
                'upload_application'=>"",
                'display_index'=> 0,
                'height'=>NULL,
                'width'=>NULL,
                'creation_date'=>NULL,
                'content-type'=>"",
                'id'=>$pictureList[$j]['picture_id'],
                'description'=>""
            );
            $pictureArr[$j]=($temp);
        }

        $json = array(
            'capacity' => $room['chairs'],
            'name' => $room['buildingName']." ".$room['roomNumber'],
            'external_id' => NULL,
            'external_info' => NULL,
            'uri' => "",
            'available_hours' => NULL,
            'manager' => "",
            'last_modified' => NULL,
            'etag' => "",
            'type' => $roomType,
            'images' => $pictureArr,
            'organization' => "",
            'display_access_restrictions' => "",
            'id' => $roomID,
            'location' =>
                array(
                    'floor' => $room['floor'],
                    'height_from_sea_level' => NULL,
                    'longitude' => $room['longitude'],
                    'latitude' => $room['latitude'],
                    'building_name' => $room['buildingName']
                )
        );

        return $json;
    }

    function fromEmail($email){
        global $mysqli;
        $result = $mysqli->query("SELECT * FROM users WHERE email = '$email'");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    function fromUsername($username){
        global $mysqli;
        $result = $mysqli->query("SELECT * FROM users WHERE username = '$username'");
        return $result->fetch_all(MYSQLI_ASSOC);
    }

    function fromName($first, $last){
        global $mysqli;
        $result = $mysqli->query("SELECT * FROM users WHERE fName = '$first' AND lName = '$last'");
        return $result->fetch_all(MYSQLI_ASSOC);
    }
?>
