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

$query = $pdo->query('SELECT sender_name, sender_address FROM mail_addresses');
$results = $query->fetchAll(PDO::FETCH_ASSOC);
echo(json_encode($results));

?>