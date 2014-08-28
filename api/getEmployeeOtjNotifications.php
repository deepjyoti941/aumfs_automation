<?php 
require_once 'config/config.php';

	$query = "SELECT cd.customer_name,cd.customer_address, cd.customer_phone,
				ot.otj_service_id, ot.service_name, ot.start_date, em.employee_name
				FROM otj_customer_details AS ot STRAIGHT_JOIN customer_details AS cd
				STRAIGHT_JOIN employee_details AS em
				WHERE ot.customer_id= cd.customer_id AND ot.assigned_employee_id = em.employee_id
				AND ot.start_date <= CURDATE() + INTERVAL 1 DAY AND ot.aum_price = 0;";
	$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

	//print_r($result);
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