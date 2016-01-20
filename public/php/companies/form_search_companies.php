<?php

/************************************************************
DEPENDENCIES
************************************************************/

$path = $_SERVER['DOCUMENT_ROOT'];
$path .= 'settings.php';

require($path);

/************************************************************
FETCHING DATA FROM REQUEST
************************************************************/

$postdata = file_get_contents("php://input");
$dataobject = json_decode($postdata);

$company_name = $dataobject->companyName;
$manager_name = $dataobject->managerName;
$valid_contract = $dataobject->validContract;
$expired_contract = $dataobject->expiredContract;
$starting_date = $dataobject->startingDate;
$ending_date = $dataobject->endingDate;

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();

$pdo = $connection->connect();

/************************************************************
QUERY
************************************************************/



?>