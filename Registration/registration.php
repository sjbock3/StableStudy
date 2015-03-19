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

$query = "insert into user(first, last, username, school, email, password) values('" ;

$query = $query . $_POST['first'] . "', '" . $_POST['last'] . "', '" . $_POST['username'] . "', '" . $_POST['school'] . "', '" . $_POST['email'] . "', '" . $_POST['password'] . "')'";

mysqli_query($con, $query);

// if (mysql_num_rows($result) == 0)

// 	header ('Location: http://localhost/error.html');

// else

// 	header ('Location: http://localhost/success.html');

mysqli_close($con);

?></body></html>
