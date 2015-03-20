<?php //completely written by Nick Roberts
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
        $query = "SELECT * from users where email = '" ;

        $query = $query . $email . "' and password = '" . $password ."'";

        $result = $mysqli->query($query);
        
        
        
        
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
        
        $usernameChecker = "SELECT * FROM user WHERE username = '" ;
        $usernameChecker = $usernameChecker . $username . "'";
        $emailChecker = "SELECT * FROM user WHERE email = '";
        $emailChecker = $emailChecker . $email . "'";
        
        $doesUserExist = $mysqli->query($usernameChecker);
        $doesEmailExist = $mysqli->query($emailChecker);
        
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
            $query = "INSERT INTO user (fName, lName, school, username, email, password) VALUES ('" ;
            $query = $query . $fName . "', '" . $lName . "', '" . $school . "', '" . $username . "', '" . $email . "', '" . $password . "')'";
            $mysqli->query($query);
            $jsonArray = array('u_id' => 1);
            
            echo json_encode($jsonArray);
            return;
        }
        
        //return error
        $jsonArray = array('u_id' => -2);
        echo json_encode($jsonArray);
        return;
        
    });
    
    $app->run();

?>