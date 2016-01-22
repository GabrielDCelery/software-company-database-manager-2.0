<?php

/************************************************************
DEPENDENCIES
************************************************************/

require '../../settings.php';

/************************************************************
FETCHING DATA FROM REQUEST
************************************************************/

$postdata = file_get_contents("php://input");
$dataobjects = json_decode($postdata);

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();

$pdo = $connection->connect();

/************************************************************
QUERY
************************************************************/

foreach($dataobjects as $dataobject){
	$mail_id = $dataobject->mail_id;
	$sender_name = $dataobject->sender_name;
	$sender_address = $dataobject->sender_address;
	$receiving_date = $dataobject->receiving_date;
	$forwarding_date = $dataobject->forwarding_date;
	$forwarding_method = $dataobject->forwarding_method;
	if(!is_null($receiving_date)){
		$receiving_date = strtotime($receiving_date);
		$receiving_date = date('Y-m-d', $receiving_date);
	}
	if(!is_null($forwarding_date)){
		$forwarding_date = strtotime($forwarding_date);
		$forwarding_date = date('Y-m-d', $forwarding_date);
	}
	$q = 'UPDATE mailing SET ';
	$q .= 'sender_name = "' . $sender_name . '", ';
	$q .= 'sender_address = "' . $sender_address . '", ';
	$q .= 'receiving_date = "' . $receiving_date . '", ';
	$q .= 'forwarding_date = "' . $forwarding_date . '", ';
	$q .= 'forwarding_method = "' . $forwarding_method . '"';
	$q .= ' WHERE mailing.id = ';
	$q .= $mail_id;
	$pdo->query($q);
}
echo true;

?>