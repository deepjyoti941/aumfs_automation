<?php 
require_once 'config/config.php';

	$query="SELECT oc.bill_number, oc.oncall_service_id, oc.service_name, oc.order_date_time, ed.employee_name, ed.is_engaged,cd.customer_address,cd.customer_phone,cd.black_listed,cd.customer_name
				FROM oncall_customer_details AS oc
				STRAIGHT_JOIN employee_details AS ed
				STRAIGHT_JOIN customer_details AS cd
				WHERE oc.customer_id = cd.customer_id
				AND oc.assigned_employee_id = ed.employee_id
				ORDER BY cd.customer_name ASC";
	$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

	$arr = array();
	if($result->num_rows > 0) {
		while($row = $result->fetch_assoc()) {
			$arr[] = $row;	
		}
	}
	# JSON-encode the response
	$json_response = json_encode($arr);

	// # Return the response
	echo $json_response;
?>