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

$forwarding_date = $dataobjects->forwardingDate;
if(!is_null($forwarding_date)){
	$forwarding_date = strtotime($forwarding_date);
	$forwarding_date = date('Y-m-d', $forwarding_date);
}
$forwarding_method = $dataobjects->forwardingMethod;
$id_list = $dataobjects->id;
foreach($id_list as $id){
	$q = 'UPDATE mailing SET ';
	$q .= 'forwarding_date = "' . $forwarding_date . '", ';
	$q .= 'forwarding_method = "' . $forwarding_method . '"';
	$q .= ' WHERE id = ';
	$q .= $id;
	$pdo->query($q);
}

echo true;

?>