<?php 
require_once 'config/config.php';

	$query="SELECT oc.oncall_service_id,oc.service_name,oc.act_date, DATE_FORMAT(oc.act_time,'%h:%i %p') AS action_time, cd.customer_name,cd.customer_address,cd.customer_phone,ed.employee_name From oncall_customer_details AS oc STRAIGHT_JOIN customer_details AS cd STRAIGHT_JOIN employee_details AS ed WHERE oc.customer_id = cd.customer_id AND oc.assigned_employee_id=ed.employee_id AND oc.billing_price = '' IN (SELECT oncall_service_id FROM oncall_customer_details WHERE act_date <= CURDATE() + INTERVAL 1 DAY)";
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