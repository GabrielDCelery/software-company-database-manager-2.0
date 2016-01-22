<?php

/************************************************************
DEPENDENCIES
************************************************************/

require '../../settings.php';

/************************************************************
FETCHING DATA FROM REQUEST
************************************************************/

$postdata = file_get_contents("php://input");
$dataobject = json_decode($postdata);

$mail_id_list = $dataobject;

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();
$pdo = $connection->connect();

/************************************************************
QUERY
************************************************************/

foreach($mail_id_list as $mail_id){
	$q = 'DELETE FROM mailing WHERE id = ';
	$q .= $mail_id;
	$pdo->query($q);
}

echo true;

?>