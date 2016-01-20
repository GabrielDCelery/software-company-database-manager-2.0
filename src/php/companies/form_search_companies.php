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

$company_name = $dataobject->companyName;
$manager_name = $dataobject->managerName;
$valid_contract = $dataobject->validContract;
$expired_contract = $dataobject->expiredContract;
$starting_date = $dataobject->startingDate;
$ending_date = $dataobject->endingDate;
$last_contract_only = $dataobject->lastContractOnly;

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();

$pdo = $connection->connect();

/************************************************************
QUERY
************************************************************/

/* Filter by last contract */

$subquery_by_last_contract = '(';
$subquery_by_last_contract .= 'SELECT companies.id AS id, company_name, contract_status, ';

if($last_contract_only == true){
	$subquery_by_last_contract .= 'MAX(ending_date) AS ending_date ';
} else {
	$subquery_by_last_contract .= 'ending_date ';
}

$subquery_by_last_contract .= 'FROM companies INNER JOIN companies_detailed ON companies.id = companies_detailed.company_id ';

if($last_contract_only == true){
	$subquery_by_last_contract .= 'GROUP BY company_name';
}

$subquery_by_last_contract .= ') ';

/* Filter by company name */

if($company_name != "" || $company_name != null){
	$subquery_by_company_name = '(';
	$subquery_by_company_name .= 'SELECT * FROM ' . $subquery_by_last_contract . ' AS filtered_by_last_contract ';
	$subquery_by_company_name .= ' WHERE company_name = "' . $company_name . '"';
	$subquery_by_company_name .= ')';
} else {
	$subquery_by_company_name = $subquery_by_last_contract;
}

/* Filter by contracts status */

$subquery_by_contract_status = '(';
$subquery_by_contract_status .= 'SELECT * FROM ' . $subquery_by_company_name . ' AS filtered_company_name ';

if ($valid_contract == true && $expired_contract == true){
	$subquery_by_contract_status .= ' WHERE contract_status = true OR contract_status = false';
} elseif ($valid_contract == true && $expired_contract == false){
	$subquery_by_contract_status .= ' WHERE contract_status = true ';
} elseif ($valid_contract == false && $expired_contract == true){
	$subquery_by_contract_status .= ' WHERE contract_status = false ';	
} else {
	$subquery_by_contract_status .= ' AND contract_status = true AND contract_status = false';	
}

$subquery_by_contract_status .= ') ';

/* Joining tables */

$subquery_jointables = '(';
$subquery_jointables .= 'SELECT 
	companies_detailed.id AS id, 
	company_name, 
	manager_name, 
	contract_status, 
	company_email, 
	company_phone, 
	starting_date, 
	companies_detailed.ending_date AS ending_date, 
	postal_number 
	FROM ' . $subquery_by_contract_status . ' AS filtered_contract_status ' .
	'INNER JOIN companies_detailed ON 
	filtered_contract_status.id = companies_detailed.company_id AND
	filtered_contract_status.ending_date = companies_detailed.ending_date';
$subquery_jointables .= ') ';	

/* Filter by manager name */

if($manager_name != "" || $manager_name != null){
	$subquery_by_manager_name = '(';
	$subquery_by_manager_name .= 'SELECT * FROM ' . $subquery_jointables . ' AS joined_tables';
	$subquery_by_manager_name .= ' WHERE manager_name = "' . $manager_name . '"';
	$subquery_by_manager_name .= ')';
} else {
	$subquery_by_manager_name = $subquery_jointables;
}

/* Filtering by date interval */

$subquery_by_date_interval = '(';
$subquery_by_date_interval .= 'SELECT * FROM ' . $subquery_by_manager_name . ' AS filtered_by_date_interval ';
$subquery_by_date_interval .= ' WHERE 1';
if ($starting_date != null){
	$subquery_by_date_interval .= ' AND ending_date >= "' . $starting_date . '" ';
}
if ($ending_date != null){
	$subquery_by_date_interval .= ' AND ending_date <= "' . $ending_date . '" ';
}

$subquery_by_date_interval .= ') ';

$mainquery = $subquery_by_date_interval;

$preparedstatement = $pdo->prepare($mainquery);
$preparedstatement->execute();
$results = $preparedstatement->fetchAll(PDO::FETCH_ASSOC);

echo(json_encode($results));

?>