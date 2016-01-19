<?php

date_default_timezone_set("Europe/Paris");

class dbConnect {

	private $host = 'localhost';
	private $db_name = 'company_management';
	private $admin = 'root';
	private $password = null;
	private $table_name = '';

	public function connect(){
		$pdo = new PDO('mysql:dbname=' . $this->db_name . ';host=' . $this->host, $this->admin, $this->password, array(PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8"));
		return $pdo;
	}

}


?>