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

$company_id_list = $dataobject;

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();

$pdo = $connection->connect();

/************************************************************
QUERY
************************************************************/

$query_companies_statuses = 'SELECT companies.id AS id,
	contract_status
	FROM companies
	INNER JOIN companies_detailed
	ON companies.id = companies_detailed.company_id
	WHERE companies_detailed.id = ';

$query_companies_statuses .= $company_id_list[0];

if(count($company_id_list) > 1){
	for($i = 1; $i < count($company_id_list); $i++){
		$query_companies_statuses .= ' OR companies_detailed.id = ';
		$query_companies_statuses .= $company_id_list[$i];
	}
}

$query_companies_statuses .= ' GROUP BY id';

$preparedstatement = $pdo->prepare($query_companies_statuses);
$preparedstatement->execute();
$result_of_company_statuses = $preparedstatement->fetchAll(PDO::FETCH_ASSOC);

for($i = 0; $i < count($result_of_company_statuses); $i++){

	$query_update_status = 'UPDATE companies SET contract_status = ';

	if($result_of_company_statuses[$i]['contract_status'] == 1){
		$query_update_status .= 0;
	} else {
		$query_update_status .= 1;
	}

	$query_update_status .= ' WHERE id = ';
	$query_update_status .= $result_of_company_statuses[$i]['id'];

	$preparedstatement = $pdo->prepare($query_update_status);
	$preparedstatement->execute();
}

echo(true);


?>