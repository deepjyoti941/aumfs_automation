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
		$sql = "INSERT INTO  amc_customer_details (customer_id,enquiry_date,start_date,end_date,enquiry_type,follow_up_type,total,billing_frequency,extra_inventory, customer_feedback,bill_date) VALUES (:customer_id, :enquiry_date, :start_date, :end_date, :enquiry_type, :follow_up_type, :total, :billing_frequency, :extra_inventory, :customer_feedback,:bill_date)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':customer_id' =>$data->customer_id,':enquiry_date'=>$data->enquiry_date,':start_date' =>$data->order_date,':end_date' =>$data->end_date,':enquiry_type'=>$data->enquiry_type,':follow_up_type'=>$data->follow_up_type,':total'=>$data->total,':billing_frequency'=>$data->billing_frequency, ':extra_inventory'=>$data->extra_inventory, ':customer_feedback'=>$data->customer_feedback,':bill_date'=>$data->order_date));
		//print_r($sth->errorInfo());

		if ($result == 1) {
			$data = array(
				"status" => true,
				"amc_order_id"=>$dbh->lastInsertId(),
				"follow_up_type"=>$data->follow_up_type
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
	}elseif ($data->method == 'get_amc_details_by_id') {
		$sql_amc_by_id = "SELECT * FROM amc_customer_details AS cd STRAIGHT_JOIN amc_service_details AS sd STRAIGHT_JOIN amc_service_type AS st STRAIGHT_JOIN customer_details AS cust WHERE cd.amc_order_id=sd.amc_order_id AND cd.customer_id= cust.customer_id AND sd.service_id=st.service_id AND cd.amc_order_id=$data->amc_order_id";
		$stmt = $dbh->query($sql_amc_by_id);
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);	
	}elseif ($data->method == 'update_amc_customer_details') {
	
		$sql = "UPDATE amc_customer_details SET enquiry_date=:enquiry_date, start_date=:start_date, end_date=:end_date, enquiry_type=:enquiry_type,follow_up_type=:follow_up_type,total=:total,billing_frequency=:billing_frequency,extra_inventory=:extra_inventory, customer_feedback=:customer_feedback,bill_date=:bill_date WHERE amc_order_id=:amc_order_id";
		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $result = $sth->execute(array(':enquiry_date'=>$data->enquiry_date, ':start_date'=>$data->start_date, ':end_date'=>$data->end_date, ':enquiry_type'=>$data->enquiry_type, ':follow_up_type'=>$data->follow_up_type,':total'=>$data->total,':billing_frequency'=>$data->billing_frequency,':extra_inventory'=>$data->extra_inventory,':customer_feedback'=>$data->customer_feedback,':bill_date'=>$data->bill_date,':amc_order_id'=>$data->amc_order_id));

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
	}elseif ($data->method == 'update_amc_service_details') {
		foreach ($data->details as $value) {
			$sql = "UPDATE amc_service_details SET service_id=:service_id, quantity=:quantity, qty_total=:qty_total WHERE amc_order_id=:amc_order_id AND service_id=:service_id";
			$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
	        $result = $sth->execute(array(':service_id'=>$value->service_id, ':quantity'=>$value->quantity, ':qty_total'=>$value->qty_total,':amc_order_id'=>$data->amc_order_id ,':service_id'=>$value->service_id));
		}
		$data = array(
			"status" => true
			);
		echo json_encode($data);
	}elseif ($data->method == 'update_amc_bill_date') {
		
		$sql = "UPDATE amc_customer_details SET bill_date=:bill_date,bill_status=0 WHERE amc_order_id=:amc_order_id";
		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $result = $sth->execute(array(':bill_date'=>$data->next_date,':amc_order_id'=>$data->amc_order_id));
	
	}
?>