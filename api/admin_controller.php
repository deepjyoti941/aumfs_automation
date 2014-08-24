<?php 
	//error_reporting(E_ALL);
	//error_reporting(1);
	require_once 'config/mysql_config.php';
	$data = json_decode(file_get_contents("php://input"));
	if ($data->method == 'get_admin_details') {
		$sql = "SELECT * FROM admin_settings";
		$stmt = $dbh->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($row);
	}elseif ($data->method == 'get_admin_details_by_id') {
		$sql = "SELECT * FROM admin_settings  WHERE id = $data->id";
		$stmt = $dbh->query($sql);
		$row = $stmt->fetch(PDO::FETCH_ASSOC);
		echo json_encode($row);
	}
?>

