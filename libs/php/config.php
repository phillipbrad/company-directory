<?php

// Connection details for MySQL database from environment variables
$cd_host = getenv('DB_HOST') ?: 'localhost';
$cd_port = getenv('DB_PORT') ?: 3306;
$cd_socket = "";

// Database name, username and password from environment variables
$cd_dbname = getenv('DB_NAME') ?: 'companydirectory';
$cd_user = getenv('DB_USER') ?: 'root';
$cd_password = getenv('DB_PASSWORD') ?: '';
