<?php 
	//error_reporting(E_ALL);
	//error_reporting(1);
	require_once 'config/mysql_config.php';
	require_once 'classes/class.upload.php';
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
	}elseif ($_POST['method'] == 'update_admin_image') {
	   	$admin_img = new Upload($_FILES['file']);
		if ($admin_img->uploaded) {
		  $img_name_original = $_FILES['file']['name'];
		  $img_name = explode('.', $img_name_original);
		  $admin_img->file_new_name_body = $img_name[0];
		  $admin_img->image_resize = true;
		  $admin_img->image_x = 170;
		  $admin_img->image_y = 170;
		  $admin_img->Process('../images/uploads/'.$_POST['admin_id']);
		  $admin_image_original = '/images/uploads/'.$_POST['admin_id'].'/'.$img_name_original;
		}
		if ($admin_img->processed) {
			$sql = "UPDATE admin_settings SET admin_image =:admin_image WHERE id = :id";
			$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
			$result = $sth->execute(array(':admin_image'=>$admin_image_original ,':id' => $_POST['admin_id']));

	       if ($result == 1) {
	          $data = array(
	          	"admin_image"=> $admin_image_original,
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

	}elseif ($data->method == 'update_admin_data') {
		$sql = "UPDATE admin_settings SET name=:name, email=:email, password=:password, short_desc=:short_desc WHERE id=:id";
		$sth = $dbh->prepare($sql, array(PDO::ATTR_CURSOR => PDO::CURSOR_FWDONLY));
        $result = $sth->execute(array(':name'=>$data->admin_name, ':email'=>$data->email, ':password'=>$data->new_password, ':short_desc'=>$data->short_desc, ':id'=>$data->admin_id));

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
	}
?>

