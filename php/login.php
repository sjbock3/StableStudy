<html><body><?php

$con = mysql_connect("localhost", "root", "rootpass");

if (!$con)

{

	die('Could not connect: ' . mysql_error());

}

mysql_select_db("stablestudy", $con)

or die("Unable to select database:" . mysql_error());

$query = "select * from users where email = '" ;

$query = $query . $_POST['email'] . "' and password = '" . $_POST['password'] ."'";

$result = mysql_query($query);

// if (mysql_num_rows($result) == 0)

// 	header ('Location: http://localhost/error.html');

// else

// 	header ('Location: http://localhost/success.html');

mysql_close($con);

?></body></html>