<?php 
require_once 'config/config.php';

	$query = "SELECT cd.customer_name,cd.customer_address, cd.customer_phone,
				ot.otj_service_id, ot.enquiry_type,
				ot.follow_up_type, ot.service_name, ot.action_date
				FROM otj_customer_details AS ot STRAIGHT_JOIN customer_details AS cd
				WHERE ot.customer_id= cd.customer_id
				AND ot.action_date <= CURDATE() + INTERVAL 1 DAY AND (ot.follow_up_type != 'Confirm' AND ot.follow_up_type != 'Cancel')";
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