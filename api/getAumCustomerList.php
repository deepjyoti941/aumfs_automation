<?php 
require_once 'config/config.php';

	$query="SELECT aum.aum_order_id,aum.order_date,aum.order_status,aum.total,cd.customer_name,cd.customer_address,cd.customer_phone,cd.customer_id,cd.black_listed 
				FROM aum_customer_details AS aum STRAIGHT_JOIN customer_details AS cd  
				WHERE aum.customer_id=cd.customer_id
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