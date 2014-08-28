<?php 
require_once 'config/config.php';

	$query = "SELECT c.customer_name, c.customer_address, c.customer_phone, cd.aum_order_id, st.service_name,
				ADDDATE(cd.start_date, INTERVAL st.service_frequency DAY) AS service_date
				FROM aum_customer_details AS cd
				STRAIGHT_JOIN customer_details c
				STRAIGHT_JOIN aum_service_type st
				STRAIGHT_JOIN aum_service_details sd
				WHERE st.service_id = sd.service_id AND sd.aum_order_id = cd.aum_order_id
				AND c.customer_id = cd.customer_id

				AND ADDDATE(cd.start_date, INTERVAL st.service_frequency DAY) <= CURDATE() +  INTERVAL 1 DAY AND st.service_frequency !=0 AND sd.quantity !=0  AND
((ADDDATE(cd.start_date, INTERVAL st.service_frequency DAY)) BETWEEN cd.start_date AND cd.end_date) AND ADDDATE(cd.start_date, INTERVAL st.service_frequency DAY) = CURDATE();";
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