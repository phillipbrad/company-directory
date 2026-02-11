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

$query = $conn->prepare('SELECT p.id, p.firstname AS "firstName", p.lastname AS "lastName", p.email, p.jobtitle AS "jobTitle", d.id as "departmentID", d.name AS "departmentName", l.id as "locationID", l.name AS "locationName" FROM personnel p LEFT JOIN department d ON (d.id = p.departmentid) LEFT JOIN location l ON (l.id = d.locationid) WHERE p.firstname LIKE ? OR p.lastname LIKE ? OR p.email LIKE ? OR p.jobtitle LIKE ? OR d.name LIKE ? OR l.name LIKE ? ORDER BY p.lastname, p.firstname, d.name, l.name');

$likeText = "%" . $_POST['txt'] . "%";

$query->bind_param("ssssss", $likeText, $likeText, $likeText, $likeText, $likeText, $likeText);

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

$result = $query->get_result();

$found = [];

while ($row = $result->fetch_assoc()) {

	array_push($found, $row);
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data']['found'] = $found;

$conn->close();

echo json_encode($output);
