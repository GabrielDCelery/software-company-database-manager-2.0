# B2B mailing and contract manager

## Description

Database and mailing manager for a B2B company handling approximately 150 customers.

## Tools and languages used during the project

	* Front-end
		* Bootstrap
		* AngularJs
	* Back-end
		* PHP
		* MySQL

## Folder structure

	* public (finalized production for deployment)
		* css
		* js
		* php
		* templates (finalized views for the angular app)
		* index.html
		* settings.php (containing the database settings)
	* src (editable code that's managed by gulp)
		* js (controllers and factories)
		* less
		* php
			* companies (database manager files for the contracts)
			* mailing (database manager files for the companies)
			* login.php (backend codes for logging in)