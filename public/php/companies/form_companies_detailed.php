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

$company_id_list = $dataobject->id;

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();

$pdo = $connection->connect();

/************************************************************
QUERY
************************************************************/

if(count($company_id_list) > 0){
	
	$querystring = 'SELECT * FROM companies INNER JOIN companies_detailed ON companies.id = companies_detailed.company_id WHERE companies_detailed.id = "' . $company_id_list[0] . '"';
	
	if(count($company_id_list) > 1){
		$i = 1;
		do {
			$querystring .= ' OR companies_detailed.id = "' . $company_id_list[$i] . '"';
			$i ++;
		} while ($i < count($company_id_list));
	}

	$preparedstatement = $pdo->prepare($querystring);
	$preparedstatement->execute();
	$results = $preparedstatement->fetchAll(PDO::FETCH_ASSOC);
	echo(json_encode($results));
}


?>