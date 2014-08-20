<?php 
	//error_reporting(E_ALL);
	//error_reporting(1);
	//require_once 'config/mysql_config.php';
	$user=json_decode(file_get_contents('php://input'));  //get user from 
	//check for user in db first

	if($user->mail=='elgaliamine@gmail.com' && $user->pass=='1234') {
		session_start();
		$_SESSION['uid']=uniqid('ang_');
		print $_SESSION['uid'];	
	}


?>
