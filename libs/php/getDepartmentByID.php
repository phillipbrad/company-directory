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


$query = $conn->prepare('SELECT id, name, locationID FROM department WHERE id =  ?');

$query->bind_param("i", $_GET['id']);

$query->execute();

if (false === $query) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";
	$output['data'] = [];

	echo json_encode($output);

	$conn->close();
	exit;
}

$result = $query->get_result();

$data = [];

while ($row = $result->fetch_assoc()) {

	array_push($data, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

echo json_encode($output);

$conn->close();
