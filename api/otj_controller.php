<?php 
	require_once 'config/mysql_config.php';
	$data = json_decode(file_get_contents("php://input"));

	if ($data->method == 'save_otj_service') {
		$sql = "INSERT INTO otj_service_type (service_name) VALUES (:service_name)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':service_name' =>$data->service_name));
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
		$sql_service_list = "SELECT * FROM otj_service_type";
		$stmt = $dbh->query($sql_service_list);
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);
	}elseif ($data->method == 'delete_service_by_id') {
		$sql = "DELETE FROM otj_service_type WHERE service_id=:service_id";
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
	}elseif ($data->method == 'save_otj_customer') {
		$sql = "INSERT INTO otj_customer_details (customer_id, enquiry_type, follow_up_type, assigned_employee_id, service_name, action_date,start_date,end_date, aum_price, short_desc, customer_feedback) VALUES (:customer_id, :enquiry_type, :follow_up_type, :assigned_employee_id, :service_name, :action_date, :start_date, :end_date, :aum_price, :short_desc, :customer_feedback)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':customer_id' =>$data->customer_id,':enquiry_type'=>$data->enquiry_type,':follow_up_type'=>$data->follow_up_type, ':assigned_employee_id'=>$data->assigned_employee_id, ':service_name'=>$data->service_name,':action_date'=>$data->enquiry_date,':start_date'=>$data->start_date,':end_date'=>$data->end_date, ':aum_price'=>$data->price, ':short_desc'=>$data->short_description, ':customer_feedback' =>$data->customer_feedback));
		//print_r($sth->errorInfo());
		if ($result == 1) {
			if ($data->assigned_employee_id != '0') {
			$sql = "UPDATE employee_details SET is_engaged = 1 WHERE employee_id = :employee_id";
			$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$result = $sth->execute(array(':employee_id' => $data->assigned_employee_id));
			if ($result == 1) {
				$sql_employee = "INSERT INTO employee_assigned_service_details(employee_id,customer_id,assigned_date, assigned_service, job_type) VALUES (:employee_id,:customer_id, :assigned_date, :assigned_service ,:job_type)";
				$sth = $dbh->prepare($sql_employee, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
				$result = $sth->execute(array(':employee_id' =>$data->assigned_employee_id, ':customer_id' =>$data->customer_id,':assigned_date'=>$data->start_date,':assigned_service'=>$data->service_name, ':job_type'=>'otj'));
					//print_r($sth->errorInfo());

			} else {
				}			
		}
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


	}elseif ($data->method == 'get_otj_details_by_id') {
		$sql_otj_by_id = "SELECT * FROM otj_customer_details AS cd STRAIGHT_JOIN customer_details AS cust WHERE cd.customer_id= cust.customer_id AND cd.otj_service_id=$data->otj_service_id";
		$stmt = $dbh->query($sql_otj_by_id);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($row);	
	}elseif ($data->method == 'update_otj_customer') {
		$sql = "UPDATE otj_customer_details SET enquiry_type=:enquiry_type, follow_up_type=:follow_up_type, assigned_employee_id=:assigned_employee_id, service_name=:service_name, action_date=:action_date, start_date=:start_date, end_date=:end_date,aum_price=:aum_price, short_desc=:short_desc, customer_feedback=:customer_feedback WHERE otj_service_id=:otj_service_id";
		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $result = $sth->execute(array(':enquiry_type'=>$data->enquiry_type, ':follow_up_type'=>$data->follow_up_type, ':assigned_employee_id'=>$data->assigned_employee_id, ':service_name'=>$data->service_name, ':action_date'=>$data->action_date, ':start_date'=>$data->start_date, ':end_date'=>$data->end_date,':aum_price'=>$data->aum_price,':short_desc'=>$data->short_desc, ':customer_feedback'=>$data->customer_feedback,':otj_service_id'=>$data->otj_service_id));
	    
        if ($data->customer_feedback) {
        	$sql_update_employee = "UPDATE employee_details SET is_engaged = 0 WHERE employee_id=:employee_id";
			$sth = $dbh->prepare($sql_update_employee, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        	$result = $sth->execute(array(':employee_id'=>$data->assigned_employee_id));

	        $sql_delete = "DELETE FROM employee_assigned_service_details WHERE employee_id=:employee_id AND customer_id=:customer_id AND job_type='otj'";
			$sth_delete = $dbh->prepare($sql_delete, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
	        $result_delete = $sth_delete->execute(array(':employee_id'=>$data->assigned_employee_id,':customer_id'=>$data->customer_id));
        }


	    if ($result == 1) {
			if ($data->assigned_employee_id != '0') {
				$sql = "UPDATE employee_details SET is_engaged = 1 WHERE employee_id = :employee_id";
				$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
				$result = $sth->execute(array(':employee_id' => $data->assigned_employee_id));
				if ($result == 1) {
					$sql_employee = "INSERT INTO employee_assigned_service_details(employee_id,customer_id,assigned_date, assigned_service) VALUES (:employee_id,:customer_id, :assigned_date, :assigned_service )";
					$sth = $dbh->prepare($sql_employee, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
					$result = $sth->execute(array(':employee_id' =>$data->assigned_employee_id, ':customer_id' =>$data->customer_id,':assigned_date'=>$data->start_date,':assigned_service'=>$data->service_name));
				} else {
					}			
			}
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
	}
?>