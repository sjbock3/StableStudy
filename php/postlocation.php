<?php


	$servername = "localhost";
	$username = "root";
	$password = "rootpass";
	$dbname = "insertdbnamehere";


	$conn = mysqli_connect($servername, $username, $password, $dbname);

	if(!$conn) {
		die("Connection failed: " . mysqli_connect_error());
	}


	/*
	


	Variable Names here



	$var1 = $_POST['var'];



	*/









	$sql = "INSERT INTO rooms(/* fields    */) VALUES (/*'$var1', '$var2', ....*/)";

	if (mysqli_query($conn, $sql)) {
		echo "<h2>Room Added</h2>";
	}
	else {
		echo "Error: " . $sql . "<br>" . mysqli_error($conn);
	}

	mysqli_close($conn);










?>