<?php

/************************************************************
DEPENDENCIES
************************************************************/

require '../settings.php';

/************************************************************
AJAX REQUEST
************************************************************/

$postdata = file_get_contents("php://input");
$dataobject = json_decode($postdata);

$login_username = $dataobject->username;
$login_password = $dataobject->password;

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();

$pdo = $connection->connect();

$querystring = 'SELECT password FROM users WHERE username = :login_username';
$preparedstatement = $pdo->prepare($querystring);
$preparedstatement->execute(array("login_username" => $login_username));
$results = $preparedstatement->fetchAll(PDO::FETCH_ASSOC);

/************************************************************
CHECK PASSWORD VALIDITY
************************************************************/

if($results != null){

	if($results[0]['password'] === $login_password){
		echo json_encode(array('data' => true));
	} else {
		echo json_encode(array('data' => false));
	}

} else {
	echo json_encode(array('data' => false));
}

?>