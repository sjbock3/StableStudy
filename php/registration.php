<html><body><?php

$servername = "localhost";
$serverUsername = "root";
$serverPassword = "rootpass";
$dbName = "stablestudy"

$con = mysqli_connect($servername, $serverUsername, $serverPassword, $dbName);

if (!$con)
{
	die('Could not connect: ' . mysql_error());
}
or die("Unable to select database:" . mysql_error());

$query = "INSERT INTO user (fName, lName, school, username, email, password) VALUES ('" ;

$query = $query . $_POST['fName'] . "', '" . $_POST['lName'] . "', '" . $_POST['school'] . "', '" . $_POST['username'] . "', '" . $_POST['email'] . "', '" . $_POST['password'] . "')'";

mysqli_query($con, $query);

// if (mysql_num_rows($result) == 0)

// 	header ('Location: http://localhost/error.html');

// else

// 	header ('Location: http://localhost/success.html');

mysqli_close($con);

?></body></html>
