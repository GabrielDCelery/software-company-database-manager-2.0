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

/************************************************************
DATABASE CONNECTION
************************************************************/

$connection = new dbConnect();

$pdo = $connection->connect();

/************************************************************
QUERY
************************************************************/

for($i = 0; $i < count($dataobject); $i++){

	$company_id = $dataobject[$i]->company_id;
	$company_name = $dataobject[$i]->company_name;
	$contract_status = $dataobject[$i]->contract_status;
	$id = $dataobject[$i]->id;

	$querystring = 'UPDATE companies_detailed SET ';

	foreach($dataobject[$i] as $key => $value){
		if($key != "id" && $key != "company_id" && $key != "company_name" && $key != "contract_status" && $key != "css_color"){
			$querystring .= $key . ' = ' . '"' . $value . '"' . ', ';
		}
	}

	$querystring = substr($querystring, 0, -2);
	$querystring .= ' WHERE companies_detailed.id = ';
	$querystring .= $id;

	$preparedstatement = $pdo->prepare($querystring);
	$preparedstatement->execute();

}

echo true;

?>