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
		$sql = "INSERT INTO  aum_customer_details (customer_id,order_date,start_date,end_date,total,subscription_type,customer_feedback) VALUES (:customer_id,:order_date,:start_date,:end_date,:total,:subscription_type,:customer_feedback)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':customer_id' =>$data->customer_id,':order_date' =>$data->enquiry_date,':start_date' =>$data->start_date,':end_date' =>$data->end_date,':total'=>$data->total,':subscription_type'=>$data->subscription_type,':customer_feedback'=>$data->customer_feedback));
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
			$sql = "INSERT INTO  aum_service_details (aum_order_id,service_id,quantity,qty_total) VALUES (:aum_order_id,:service_id,:quantity,:qty_total)";
			$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$result = $sth->execute(array(':aum_order_id' =>$data->aum_order_id,':service_id' =>$value->service_id,':quantity'=>$value->quantity, ':qty_total'=>$value->qty_total));
		}
		$data = array(
			"status" => true
			);
		echo json_encode($data);
	}elseif ($data->method == 'get_aum_details_by_id') {
		$sql_aum_by_id = "SELECT * FROM aum_customer_details AS cd STRAIGHT_JOIN aum_service_details AS sd STRAIGHT_JOIN aum_service_type AS st STRAIGHT_JOIN customer_details AS cust WHERE cd.aum_order_id=sd.aum_order_id AND cd.customer_id= cust.customer_id AND sd.service_id=st.service_id AND cd.aum_order_id=$data->aum_order_id";
		$stmt = $dbh->query($sql_aum_by_id);
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);	
	}elseif ($data->method == 'update_aum_customer_details') {
	
		$sql = "UPDATE aum_customer_details SET order_date=:order_date, start_date=:start_date, end_date=:end_date, total=:total,subscription_type=:subscription_type, customer_feedback=:customer_feedback WHERE aum_order_id=:aum_order_id";
		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $result = $sth->execute(array(':order_date'=>$data->enquiry_date, ':start_date'=>$data->start_date, ':end_date'=>$data->end_date, ':total'=>$data->total,':subscription_type'=>$data->subscription_type,':customer_feedback'=>$data->customer_feedback,':aum_order_id'=>$data->aum_order_id));

	    if ($result == 1) {
	        $data = array(
	            "status" => true
	        );
	        echo json_encode($data);
	    } else {
	        $data = array(
	        	"status" => false
	        );
	          echo json_encode($data);
	    }
	    $dbh = null;	
	}elseif ($data->method == 'update_aum_service_details') {
		foreach ($data->details as $value) {
			$sql = "UPDATE aum_service_details SET service_id=:service_id, quantity=:quantity, qty_total=:qty_total WHERE aum_order_id=:aum_order_id AND service_id=:service_id";
			$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
	        $result = $sth->execute(array(':service_id'=>$value->service_id, ':quantity'=>$value->quantity, ':qty_total'=>$value->qty_total,':aum_order_id'=>$data->aum_order_id ,':service_id'=>$value->service_id));
		}
		$data = array(
			"status" => true
			);
		echo json_encode($data);
	}elseif ($data->method == 'update_aum_employee_notification') {
		$sql = "UPDATE aum_service_details SET status = 1 WHERE aum_order_id=:aum_order_id";
		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $result = $sth->execute(array(':aum_order_id'=>$data->aum_order_id));
	
	}
?>