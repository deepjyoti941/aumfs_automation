<?php 
	require_once 'config/mysql_config.php';
	$data = json_decode(file_get_contents("php://input"));
	// $method = mysql_real_escape_string($data->method);
	// echo $method;
	// $upswd = mysql_real_escape_string($data->customer_name);
	// $uemail = mysql_real_escape_string($data->customer_phone);
	if ($data->method == 'save_new_employee') {

		$sql = "INSERT INTO employee_details (employee_name, employee_email, employee_mobile, employee_desc) VALUES (:employee_name,:employee_email,:employee_mobile,:employee_desc)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':employee_name' =>$data->name,':employee_email'=>$data->email,':employee_mobile'=>$data->phone,':employee_desc'=>$data->short_description));
		if ($result == 1) {
			$data = array(
				"status" => true,
				"employee_id" => $dbh->lastInsertId()
				);
			echo json_encode($data);
		} else {
			$data = array(
				"status" => false
				);
			echo json_encode($data);
		}

	}elseif ($_POST['method'] == 'upload_employee_image
') {
		
	}
?>