<?php

/************************************************************
DEPENDENCIES
************************************************************/

require '../../settings.php';

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();

$pdo = $connection->connect();

$querystring = 'SELECT DISTINCT manager_name FROM companies_detailed';
$preparedstatement = $pdo->prepare($querystring);
$preparedstatement->execute();
$results = $preparedstatement->fetchAll(PDO::FETCH_ASSOC);

/************************************************************
FORMAT DATA
************************************************************/

$array = array();

for($i = 0; $i < count($results); $i++){

	array_push($array, $results[$i]['manager_name']);

}

echo(json_encode($array));

?>