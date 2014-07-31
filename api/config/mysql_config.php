<?php
/*** mysql hostname ***/
$hostname = '127.0.0.1';

/*** mysql username ***/
//$username = 'admin_ggk';
$username = 'root';

/*** mysql password ***/
//$password = '&Eog38n4';
$password = '';

try {
    $dbh = new PDO("mysql:host=localhost;dbname=aumfs", $username, $password);
    //echo 'Connected to database';
    }
catch(PDOException $e) {
    echo $e->getMessage();
    }
?>