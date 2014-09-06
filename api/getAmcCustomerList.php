<?php 
require_once 'config/config.php';

	$query="SELECT amc.amc_order_id,amc.enquiry_date,amc.total,amc.follow_up_type,amc.customer_feedback, cd.customer_name,cd.customer_address,cd.customer_phone,cd.customer_id,cd.black_listed 
				FROM amc_customer_details AS amc STRAIGHT_JOIN customer_details AS cd  
				WHERE amc.customer_id=cd.customer_id
				AND amc.follow_up_type !='Cancel'
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