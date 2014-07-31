<?php 
	require_once 'config/mysql_config.php';
	$data = json_decode(file_get_contents("php://input"));
	// $method = mysql_real_escape_string($data->method);
	// echo $method;
	// $upswd = mysql_real_escape_string($data->customer_name);
	// $uemail = mysql_real_escape_string($data->customer_phone);
	if ($data->method == 'save_new_customer') {

		$sql = "INSERT INTO customer_details (customer_name,customer_address,customer_phone) VALUES (:customer_name,:customer_address,:customer_phone)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':customer_name' =>$data->method,':customer_address'=>$data->customer_name,':customer_phone'=>$data->customer_phone));
		if ($result == 1) {
			$data = array(
				"status" => true,
				"customer_id" => $dbh->lastInsertId()
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