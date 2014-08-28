<?php 
	//error_reporting(E_ALL);
	error_reporting(0); 
	if ($_SERVER[HTTP_HOST] == 'aumfs.dev') {
		$DB_HOST = '127.0.0.1';
		$DB_USER = 'root';
		$DB_PASS = '';
		$DB_NAME = 'aumfs';
		$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);	
	}else {
		$DB_HOST = '127.0.0.1';
		$DB_USER = 'root';
		$DB_PASS = 'admin';
		$DB_NAME = 'aumfs';
		$mysqli = new mysqli($DB_HOST, $DB_USER, $DB_PASS, $DB_NAME);
	}

?>
