<?php //completely written by 
    require 'vendor/autoload.php';
    $app = new \Slim\Slim();

    $server = "localhost";
    $user = "root";
    $pass = "rootpass";
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
        
        
        
        
        if(($result === NULL)) {
            $jsonArray = array(
                'status' => 'Failure',
                'fName'=> NULL,
                'lName'=> NULL,
                'school'=> NULL,
                'username'=> NULL);
                
            echo json_encode($jsonArray);
            return;
        
        
        
            
        }
        
        
        else {
            $row = $result->fetch_assoc();
            $jsonArray = array(
                'status' => 'Success',
                'fName'=> $row['fName'],
                'lName'=> $row['lName'],
                'school'=> $row['school'],
                'username'=> $row['username']);
            
            echo json_encode($jsonArray);
            return;
        }
        
        
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
        
        //add in new user
        else
        {
            
            if($mysqli->query("INSERT INTO users(fName, lName, school, username, email, password) VALUES ('$fName', '$lName', '$school', '$username', '$email', '$password')")){

            }
            else {
                echo "db done goofed ";
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
        #echo var_dump($locationList->fetch_all());
	    echo "\n";
        #echo json_encode($locationList->fetch_assoc());
        echo json_encode($locationList->fetch_all(MYSQLI_ASSOC)); 
        return;
        
    });
    
    $app->run();

?>
