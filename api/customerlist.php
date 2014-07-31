<?php 
require_once 'config/config.php';

$query="select distinct c.customer_id, c.customer_name, c.customer_address, c.customer_phone from customer_details c order by 1";
$result = $mysqli->query($query) or die($mysqli->error.__LINE__);

$arr = array();
if($result->num_rows > 0) {
	while($row = $result->fetch_assoc()) {
		$arr[] = $row;	
	}
}
# JSON-encode the response
echo $json_response = json_encode($arr);
?>