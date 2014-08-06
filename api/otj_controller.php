<?php 
	require_once 'config/mysql_config.php';
	$data = json_decode(file_get_contents("php://input"));

	if ($data->method == 'save_otj_service') {
		$sql = "INSERT INTO otj_service_type (service_name,service_frequency) VALUES (:service_name,:service_frequency)";

		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
		$result = $sth->execute(array(':service_name' =>$data->service_name,':service_frequency'=>$data->service_frequency));
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
	}
?>