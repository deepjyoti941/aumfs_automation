<?php 
	//error_reporting(E_ALL);
	//error_reporting(1);
	require_once 'config/mysql_config.php';
	$data = json_decode(file_get_contents("php://input"));
	if ($data->method == 'get_customer_count') {
		$sql = "SELECT count(*) FROM customer_details"; 
		$result = $dbh->prepare($sql); 
		$result->execute(); 
		$number_of_rows = $result->fetchColumn(); 
		$sql_total_income= "SELECT SUM( t.total ) AS total_income
								FROM (
								SELECT total
								FROM amc_customer_details
								UNION ALL
								SELECT total
								FROM aum_customer_details
								UNION ALL
								SELECT billing_price
								FROM oncall_customer_details AS total
								UNION ALL
								SELECT aum_price
								FROM otj_customer_details AS total
							)t";
		$result_total = $dbh->prepare($sql_total_income); 
		$result_total->execute(); 
		$income_total = $result_total->fetchColumn(); 
		$data = array(
	            "customer_count" => $number_of_rows,
	            "total_income"=>$income_total
	    );
	    echo json_encode($data);
	}



?>
