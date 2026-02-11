<?php

$executionStartTime = microtime(true);

include("db_connect.php");

header('Content-Type: application/json; charset=UTF-8');


if ($conn->connect_errno) {

	$output['status']['code'] = "300";
	$output['status']['name'] = "failure";
	$output['status']['description'] = "database unavailable";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	$conn->close();

	echo json_encode($output);

	exit;
}


// SQL statement for inserting personnel
$query = $conn->prepare('INSERT INTO personnel (firstName, lastName, jobTitle, email, departmentID) VALUES(?,?,?,?,?)');

// Bind parameters: "ssssi" - 4 strings and 1 integer
$query->bind_param(
	"ssssi",
	$_POST['firstName'],
	$_POST['lastName'],
	$_POST['jobTitle'],
	$_POST['email'],
	$_POST['departmentID']
);

$query->execute();

if (false === $query) {
	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";
	$output['data'] = [];

	$conn->close();
	echo json_encode($output);
	exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

$conn->close();

echo json_encode($output);
