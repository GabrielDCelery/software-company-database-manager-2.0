<?php

/************************************************************
DEPENDENCIES
************************************************************/

require '../../lib/autoload.php';
require '../../settings.php';

/************************************************************
FETCHING DATA FROM REQUEST
************************************************************/

$postdata = file_get_contents("php://input");
$dataobject = json_decode($postdata);

/************************************************************
FETCH DATA
************************************************************/

$company_name = $dataobject->company_name;
$manager_name = $dataobject->manager_name;
$manager_address = $dataobject->manager_address;
$company_phone = $dataobject->company_phone;
$company_email = $dataobject->company_email;
$starting_date = $dataobject->starting_date;
$ending_date = $dataobject->ending_date;
if(!is_null($starting_date)){
	$starting_date = strtotime($starting_date);
	$starting_date = date('Y-m-d', $starting_date);
}
if(!is_null($ending_date)){
	$ending_date = strtotime($ending_date);
	$ending_date = date('Y-m-d', $ending_date);
}
$postal_name = $dataobject->postal_name;
$postal_address = $dataobject->postal_address;
$document_holder = $dataobject->document_holder;
$document_holder_address = $dataobject->document_holder_address;

/*****************************************************************************
CREATING THE DOCUMENT TEMPLATE
*****************************************************************************/

$phpWord = new \PhpOffice\PhpWord\PhpWord();
$section = $phpWord->addSection();

/*****************************************************************************
FONTS
*****************************************************************************/

$baseFont = 'baseText';
$phpWord->addFontStyle(
    $baseFont,
    array('name' => 'Times New Roman', 'size' => 13, 'color' => '000000', 'bold' => false)
);
$titleFont = 'titleText';
$phpWord->addFontStyle(
    $titleFont,
    array('name' => 'Times New Roman', 'size' => 15, 'color' => '000000', 'bold' => true)
);

/*****************************************************************************
CONTENT OF COVER
*****************************************************************************/

$section->addText(
	htmlspecialchars(
		'ADATOK' .
		"\n" .
		"\n"
	),
	$titleFont
);
$section->addText(
	htmlspecialchars(
		'CÉG NEVE: ' . $company_name .
		"\n" .
		'VEZETŐ NEVE: ' . $manager_name .
		"\n" .
		'VEZETŐ CÍME: ' . $manager_address .
		"\n" .
		'TELEFON: ' . $company_phone .
		"\n" .
		'EMAIL: ' . $company_email .
		"\n" .
		'DÁTUM: ' . $starting_date . ' - ' . $ending_date .
		"\n" .
		'POSTANÉV: ' . $postal_name .
		"\n" .
		'POSTACÍM: ' . $postal_address .
		"\n" .
		"IRATŐRZŐ NEVE: " . $document_holder .
		"\n" .
		"IRATŐRZŐ CÍME: " . $document_holder_address
	),
	$baseFont
);

/*****************************************************************************
CREATING THE WORD DOCUMENT
*****************************************************************************/

$objWriter = \PhpOffice\PhpWord\IOFactory::createWriter($phpWord, 'Word2007');
$objWriter->save('../../cover.docx');


?>