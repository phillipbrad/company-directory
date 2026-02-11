<?php

// Start execution timer to measure script performance
$executionStartTime = microtime(true);

// Include database connection with mysqli compatibility
include("db_connect.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if the database connection failed
if ($conn->connect_errno) {

    // Prepare an error response
    $output['status']['code'] = "300"; // Error code for database failure
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    // Close database connection
    $conn->close();

    // Return JSON response and stop 
    echo json_encode($output);
    exit;
}


$query = 'SELECT p.id, p.lastname AS "lastName", p.firstname AS "firstName", p.jobtitle AS "jobTitle", p.email, d.name AS "departmentName", l.name AS "locationName" FROM personnel p LEFT JOIN department d ON (d.id = p.departmentid) LEFT JOIN location l ON (l.id = d.locationid) ORDER BY p.lastname, p.firstname, d.name, l.name';

// Execute the SQL query
$result = $conn->query($query);


if (!$result) {

    // Prepare an error response
    $output['status']['code'] = "400"; 
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    // Close database connection
    $conn->close();

    // Return JSON response and stop script execution
    echo json_encode($output);
    exit;
}

// Initialize an empty array to store query results
$data = [];

// Fetch each row from the query result and add it to the array
while ($row = $result->fetch_assoc()) {
    array_push($data, $row);
}

// Prepare a successful response
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

// Close database connection
$conn->close();

// Return JSON response to the client
echo json_encode($output);
