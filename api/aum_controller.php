<?php 
	require_once 'config/mysql_config.php';
	$data = json_decode(file_get_contents("php://input"));

	if ($data->method == 'save_aum_service') {
		$sql = "INSERT INTO  aum_service_type (service_name,service_price,service_frequency) VALUES (:service_name,:service_price,:service_frequency)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':service_name' =>$data->service_name,':service_price' =>$data->service_price,':service_frequency'=>$data->service_frequency));
		//print_r($sth->errorInfo());
		if ($result == 1) {
			$data = array(
				"status" => true,
				);
			echo json_encode($data);
		} else {
			$data = array(
				"status" => false
				);
			echo json_encode($data);
		}		
	}elseif ($data->method == 'get_service_list') {
		$sql_service_list = "SELECT * FROM aum_service_type";
		$stmt = $dbh->query($sql_service_list);
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);
	}elseif ($data->method == 'delete_service_by_id') {
		$sql = "DELETE FROM aum_service_type WHERE service_id=:service_id";
		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':service_id'=>$data->service_id));
		//print_r($sth->errorInfo());
		if ($result == 1) {
			$data = array(
				"status" => true,
				);
			echo json_encode($data);
		} else {
			$data = array(
				"status" => false
				);
			echo json_encode($data);
		}			
	}elseif ($data->method == 'save_aum_customer_details') { 
		$sql = "INSERT INTO  aum_customer_details (customer_id,order_date,total) VALUES (:customer_id,:order_date,:total)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':customer_id' =>$data->customer_id,':order_date' =>$data->order_date,':total'=>$data->total));
		//print_r($sth->errorInfo());
		if ($result == 1) {
			$data = array(
				"status" => true,
				"aum_order_id"=>$dbh->lastInsertId()
				);
			echo json_encode($data);
		} else {
			$data = array(
				"status" => false
				);
			echo json_encode($data);
		}
	}elseif ($data->method == 'save_aum_service_details') {
		//print_r($data);
		foreach ($data->details as $value) {
			//print_r($value->service_id);
			$sql = "INSERT INTO  aum_service_details (aum_order_id,service_id,quantity) VALUES (:aum_order_id,:service_id,:quantity)";
			$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$result = $sth->execute(array(':aum_order_id' =>$data->aum_order_id,':service_id' =>$value->service_id,':quantity'=>$value->quantity));
		}
		$data = array(
			"status" => true
			);
		echo json_encode($data);
	}
?>