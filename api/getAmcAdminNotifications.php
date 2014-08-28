<?php 
require_once 'config/config.php';

	$query = "SELECT c.customer_name, c.customer_address, c.customer_phone, cd.amc_order_id, ADDDATE(cd.bill_date, INTERVAL cd.billing_frequency DAY) AS billdate FROM amc_customer_details AS cd STRAIGHT_JOIN customer_details c STRAIGHT_JOIN amc_service_type st STRAIGHT_JOIN amc_service_details sd WHERE st.service_id = sd.service_id AND sd.amc_order_id = cd.amc_order_id AND c.customer_id = cd.customer_id AND ADDDATE(cd.bill_date, INTERVAL cd.billing_frequency DAY) <= CURDATE() + INTERVAL 1 DAY AND st.service_frequency !=0 AND sd.quantity !=0 AND ((ADDDATE(cd.bill_date, INTERVAL cd.billing_frequency DAY)) BETWEEN cd.start_date AND cd.end_date) AND ADDDATE(cd.bill_date, INTERVAL cd.billing_frequency DAY) = CURDATE()";
	
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