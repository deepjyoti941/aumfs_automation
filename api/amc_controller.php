<?php 
	//error_reporting(E_ALL);
	//error_reporting(1);
	require_once 'config/mysql_config.php';
	$data = json_decode(file_get_contents("php://input"));

	if ($data->method == 'save_amc_service') {
		$sql = "INSERT INTO  amc_service_type (service_name,service_price,service_frequency) VALUES (:service_name,:service_price,:service_frequency)";

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
		$sql_service_list = "SELECT * FROM amc_service_type";
		$stmt = $dbh->query($sql_service_list);
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);
	}elseif ($data->method == 'delete_service_by_id') {
		$sql = "DELETE FROM amc_service_type WHERE service_id=:service_id";
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
	}elseif ($data->method == 'save_amc_customer_details') { 
		$sql = "INSERT INTO  amc_customer_details (customer_id,enquiry_date,start_date,end_date,enquiry_type,follow_up_type,total,subscription_type,extra_inventory) VALUES (:customer_id, :enquiry_date, :start_date, :end_date, :enquiry_type, :follow_up_type, :total, :subscription_type, :extra_inventory)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':customer_id' =>$data->customer_id,':enquiry_date'=>$data->enquiry_date,':start_date' =>$data->order_date,':end_date' =>$data->end_date,':enquiry_type'=>$data->enquiry_type,':follow_up_type'=>$data->follow_up_type,':total'=>$data->total,':subscription_type'=>$data->subscription_type, ':extra_inventory'=>$data->extra_inventory));
		//print_r($sth->errorInfo());
		if ($result == 1) {
			$data = array(
				"status" => true,
				"amc_order_id"=>$dbh->lastInsertId()
				);
			echo json_encode($data);
		} else {
			$data = array(
				"status" => false
				);
			echo json_encode($data);
		}
	}elseif ($data->method == 'save_amc_service_details') {
		foreach ($data->details as $value) {
			//print_r($value->service_id);
			$sql = "INSERT INTO  amc_service_details (amc_order_id,service_id,quantity,qty_total) VALUES (:amc_order_id,:service_id,:quantity,:qty_total)";
			$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$result = $sth->execute(array(':amc_order_id' =>$data->amc_order_id,':service_id' =>$value->service_id,':quantity'=>$value->quantity, ':qty_total'=>$value->qty_total));
		}
		$data = array(
			"status" => true
			);
		echo json_encode($data);
	}
?>