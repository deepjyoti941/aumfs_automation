<?php 
	//error_reporting(E_ALL);
	//error_reporting(1);
	require_once 'config/mysql_config.php';
	$user=json_decode(file_get_contents('php://input'));  //get user from 

	if($user->method=='login') {
		$sql= "SELECT * FROM admin_settings";
		$stmt = $dbh->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		if ($row['email'] == $user->mail && $row['password'] == $user->pass) {
			session_start();
			$_SESSION['uid']=uniqid('ang_');
			print $_SESSION['uid'];
		}
	
	}elseif ($user->method=='forgotpassword' && $user->code != '') {
		$sql= "SELECT * FROM admin_settings";
		$stmt = $dbh->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		// echo json_encode($row);
		//echo $row['secret_code'];
		$code = $user->code;
		if ($row['secret_code'] == $code ) {
			$data = array(
				"status" => true,
				"results"=>$row
				);
			echo json_encode($data);
		} else {
			$data = array(
				"status" => false
				);
			echo json_encode($data);
		}	
	}elseif ($user->method=='forgotpassword' && $user->code == '') {
		$sql= "SELECT * FROM admin_settings";
		$stmt = $dbh->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		// echo json_encode($row);
		//echo $row['secret_code'];
		$email = $user->email;
		if ($row['email'] == $email ) {
		   // Set headers
		    $headers  = 'MIME-Version: 1.0' . "\r\n";
		    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
		    // More headers
		    $headers .= 'From: avirajsaikia@gmail.com' . "\r\n";
			  // $headers .= 'From: <golaghatgymkhana@gmail.com>' . "\r\n";
			  $headers .= 'Cc: avirajsaikia@gmail.com' . "\r\n";
			  $password = $row['password'];
		    // Format message
		    $contactMessage =  
		    "<div>
		    <p>Password Details:<br />
		    <strong>E-mail:</strong> $user->email <br />
		    <p><strong>Password:</strong> $password </p>    
		    </div>";

		    // Send and check the message status
		    $response = (mail($user->email, 'AUMFS Support', $contactMessage, $headers) ) ? "success" : "failure" ;
		    $output = json_encode(array("response" => $response));

		    header('content-type: application/json; charset=utf-8');
		    // echo($output);			
			$data = array(
				"status" => true,
				"mail_output"=>$output
				);
			echo json_encode($data);
		} else {
			$data = array(
				"status" => false
				);
			echo json_encode($data);
		}
	}



?>
