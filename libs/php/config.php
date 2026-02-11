<?php

// Connection details from environment variables (supports both MySQL and PostgreSQL)
$cd_host = getenv('DB_HOST') ?: 'localhost';
$cd_port = getenv('DB_PORT') ?: 5432;
$cd_socket = "";

// Database name, username and password from environment variables
$cd_dbname = getenv('DB_NAME') ?: 'companydirectory';
$cd_user = getenv('DB_USER') ?: 'postgres';
$cd_password = getenv('DB_PASSWORD') ?: '';

// Determine database type (pgsql or mysql)
$cd_db_type = getenv('DB_TYPE') ?: 'pgsql';
