<?php 
	error_reporting(0);    
	//error_reporting(E_ALL ^ E_NOTICE);
    //error_reporting(E_ALL^ E_WARNING);
	require_once 'config/mysql_config.php';
	require_once 'classes/class.upload.php';

	$data = json_decode(file_get_contents("php://input"));
	// $method = mysql_real_escape_string($data->method);
	// echo $method;
	// $upswd = mysql_real_escape_string($data->customer_name);
	// $uemail = mysql_real_escape_string($data->customer_phone);
	if ($data->method == 'save_new_employee') {

		$sql = "INSERT INTO employee_details (employee_name, employee_email, employee_mobile, employee_desc) VALUES (:employee_name,:employee_email,:employee_mobile,:employee_desc)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':employee_name' =>$data->name,':employee_email'=>$data->email,':employee_mobile'=>$data->phone,':employee_desc'=>$data->short_description));
		if ($result == 1) {
			$data = array(
				"status" => true,
				"employee_id" => $dbh->lastInsertId()
				);
			echo json_encode($data);
		} else {
			$data = array(
				"status" => false
				);
			echo json_encode($data);
		}

	}elseif ($_POST['method'] == 'upload_employee_image') {
	   	$employee_img = new Upload($_FILES['file']);
		if ($employee_img->uploaded) {
		  $img_name_original = $_FILES['file']['name'];
		  $img_name = explode('.', $img_name_original);
		  $employee_img->file_new_name_body = $img_name[0];
		  $employee_img->image_resize = true;
		  $employee_img->image_x = 170;
		  $employee_img->image_y = 170;
		  $employee_img->Process('../images/uploads/'.$_POST['employee_id']);
		  $employee_image_original = '/images/uploads/'.$_POST['employee_id'].'/'.$img_name_original;
		}
		if ($employee_img->processed) {
			$sql = "UPDATE employee_details SET employee_photo =:employee_photo WHERE employee_id = :employee_id";
			$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$result = $sth->execute(array(':employee_photo'=>$employee_image_original ,':employee_id' => $_POST['employee_id']));

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


		} else {
			echo "not processed";
		}

	} elseif ($data->method == 'get_free_employee_list') {

		$sql_employee = "SELECT DISTINCT ed.employee_id, ed.employee_name FROM employee_details as ed STRAIGHT_JOIN employee_assigned_service_details as ead WHERE ed.employee_id = ead.employee_id AND ead.assigned_date != CURDATE()";
		$stmt = $dbh->query($sql_employee);
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);

	}elseif ($data->method == 'get_employee_list') {

		$sql_employee = "SELECT * FROM employee_details";
		$stmt = $dbh->query($sql_employee);
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);

	}elseif ($data->method == 'get_employee_services_by_id') {

		$sql_employee = "SELECT * FROM employee_assigned_service_details WHERE employee_id=$data->employee_id";
		$stmt = $dbh->query($sql_employee);
		$row = $stmt->fetchAll(PDO::FETCH_ASSOC);
		echo json_encode($row);

	}elseif ($data->method == 'get_employee_by_id') {

		$sql_employee = "SELECT * FROM employee_details WHERE employee_id=$data->employee_id";
		$stmt = $dbh->query($sql_employee);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($row);

	}elseif ($data->method == 'update_employee') {
		$sql = "UPDATE employee_details SET employee_name=:employee_name, employee_email=:employee_email, employee_mobile=:employee_mobile, employee_desc=:employee_desc WHERE employee_id=:employee_id";
		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $result = $sth->execute(array(':employee_name'=>$data->employee_name, ':employee_email'=>$data->employee_email, ':employee_mobile'=>$data->employee_mobile, ':employee_desc'=>$data->employee_desc, ':employee_id'=>$data->employee_id));

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

	}elseif ($_POST['method'] == 'update_employee_image') {
	   	$employee_img = new Upload($_FILES['file']);
		if ($employee_img->uploaded) {
		  $img_name_original = $_FILES['file']['name'];
		  $img_name = explode('.', $img_name_original);
		  $employee_img->file_new_name_body = $img_name[0];
		  $employee_img->image_resize = true;
		  $employee_img->image_x = 170;
		  $employee_img->image_y = 170;
		  $employee_img->Process('../images/uploads/'.$_POST['employee_id']);
		  $employee_image_original = '/images/uploads/'.$_POST['employee_id'].'/'.$img_name_original;
		}
		if ($employee_img->processed) {
			$sql = "UPDATE employee_details SET employee_photo =:employee_photo WHERE employee_id = :employee_id";
			$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$result = $sth->execute(array(':employee_photo'=>$employee_image_original ,':employee_id' => $_POST['employee_id']));

	       if ($result == 1) {
	          $data = array(
	          	"emoloyee_image"=> $employee_image_original,
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


		} else {
			echo "not processed";
		}

	}elseif ($data->method == 'delete_employee') {
		$sql = "DELETE FROM employee_details WHERE employee_id=:employee_id";
		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $result = $sth->execute(array(':employee_id'=>$data->employee_id));

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

	}elseif ($data->method == 'get_employee_count') {
		$sql = "SELECT count(*) FROM employee_details"; 
		$result = $dbh->prepare($sql); 
		$result->execute(); 
		$number_of_rows = $result->fetchColumn(); 
		echo $number_of_rows;
	}
?>