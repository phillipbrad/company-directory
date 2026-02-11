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


$query = 'SELECT 
  d.id, 
  d.name AS "departmentName", 
  l.name AS "locationName" 
FROM department d
LEFT JOIN location l ON d.locationid = l.id
ORDER BY d.name, l.name
';

$result = $conn->query($query);

if (!$result) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";
	$output['data'] = [];

	$conn->close();

	echo json_encode($output);

	exit;
}

$data = [];

while ($row = $result->fetch_assoc()) {

	array_push($data, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

$conn->close();

echo json_encode($output);
