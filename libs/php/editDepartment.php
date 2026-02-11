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

	mysqli_close($conn);

	echo json_encode($output);

	exit;
}


$query = $conn->prepare('
    UPDATE department 
    SET name = ?, locationID = ?
    WHERE id = ?
    ');

//si is for string and integer, these are the params held by the placeholders above???
$query->bind_param(
	"sii",
	$_POST['name'],
	$_POST['locationID'],
	$_POST['id'],


);

$query->execute();

if (false === $query) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = [];

mysqli_close($conn);

echo json_encode($output);
