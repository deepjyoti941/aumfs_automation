<?php
	error_reporting(0); 
	if ($_SERVER[HTTP_HOST] == 'aumfs.dev') {

		$hostname = '127.0.0.1';
		$username = 'root';
		$password = '';
		try {
		    $dbh = new PDO("mysql:host=localhost;dbname=aumfs", $username, $password);
		    }
		catch(PDOException $e) {
		    echo $e->getMessage();
		    }
		}else{

		$hostname = '127.0.0.1';
		$username = 'root';
		$password = 'admin';
		try {
		    $dbh = new PDO("mysql:host=localhost;dbname=aumfs", $username, $password);
		    }
		catch(PDOException $e) {
		    echo $e->getMessage();
		    }
		}


?>