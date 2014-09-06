<?php 
require_once 'config/config.php';

	$query="SELECT otj.otj_service_id,otj.service_name,otj.aum_price,otj.action_date,otj.order_status,otj.assigned_employee_id,otj.customer_feedback,cd.customer_address,cd.customer_phone,cd.black_listed,cd.customer_name
				FROM otj_customer_details AS otj
				STRAIGHT_JOIN customer_details AS cd
				WHERE otj.customer_id = cd.customer_id
				AND otj.customer_feedback <=> 'Cancel'
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