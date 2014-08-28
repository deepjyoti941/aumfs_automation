<?php 
require_once 'config/config.php';

	$query = "SELECT c.customer_name, c.customer_address, c.customer_phone, cd.subscription_type, cd.aum_order_id
			FROM aum_customer_details AS cd
			STRAIGHT_JOIN customer_details c
			WHERE c.customer_id = cd.customer_id AND cd.order_date <= CURDATE() +  INTERVAL 1 DAY AND cd.total = 0;";
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