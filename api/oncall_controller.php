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
			$sql = "UPDATE employee_details SET is_engaged = 1 WHERE employee_id = :employee_id";
			$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$result = $sth->execute(array(':employee_id' => $data->assign_employee_id));
			if ($result == 1) {
	 			$data = array(
		            "status" => true
		        );
		        echo json_encode($data);
				
			}
		} else {
			$data = array(
				"status" => false
				);
			echo json_encode($data);
		}
	}elseif ($data->method == 'get_service_by_id') { 
		$sql_service_list = "SELECT oc.oncall_service_id, oc.customer_id, oc.service_name, DATE_FORMAT(oc.order_date_time,'%h:%i %p') AS order_date_time_all, DATE_FORMAT(oc.act_time,'%h:%i %p') AS act_time, DATE_FORMAT(oc.order_date_time,'%Y-%m-%d') AS order_date_time, DATE_FORMAT(oc.order_date_time,'%T') AS order_time, ed.employee_name, ed.is_engaged,cd.customer_address,cd.customer_phone,cd.customer_name
				FROM oncall_customer_details AS oc
				STRAIGHT_JOIN employee_details AS ed
				STRAIGHT_JOIN customer_details AS cd
				WHERE oc.customer_id = cd.customer_id
				AND oc.assigned_employee_id = ed.employee_id AND oc.oncall_service_id=$data->oncall_service_id
				ORDER BY cd.customer_name ASC";
		$stmt = $dbh->query($sql_service_list);
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);
	}

?>