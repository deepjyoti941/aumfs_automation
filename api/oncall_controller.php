<?php 
	require_once 'config/mysql_config.php';
	$data = json_decode(file_get_contents("php://input"));
	if ($data->method == 'get_service_list') {

		$sql_service_list = "SELECT * FROM service_type";
		$stmt = $dbh->query($sql_service_list);
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);
	} elseif ($data->method == 'save_oncall_details') {

		$sql = "INSERT INTO oncall_customer_details (customer_id,service_name,assigned_employee_id) VALUES (:customer_id,:service_name,:assigned_employee_id)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':customer_id' =>$data->customer_id,':service_name'=>$data->service_type,':assigned_employee_id'=>$data->assign_employee_id));
		//print_r($sth->errorInfo());
		if ($result == 1) {
 			$data = array(
	            "status" => true
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