<?php

// Start execution timer to measure script performance
$executionStartTime = microtime(true);

// Include database connection with mysqli compatibility
include("db_connect.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if the database connection failed
if (mysqli_connect_errno()) {

    // Prepare an error response
    $output['status']['code'] = "300"; // Error code for database failure
    $output['status']['name'] = "failure";
    $output['status']['description'] = "database unavailable";
    $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
    $output['data'] = [];

    // Close database connection
    mysqli_close($conn);

    // Return JSON response and stop 
    echo json_encode($output);
    exit;
}


$query = 'SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name AS departmentName, l.name AS locationName FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName, p.firstName, d.name, l.name';

// Execute the SQL query
$result = $conn->query($query);


if (!$result) {

    // Prepare an error response
    $output['status']['code'] = "400"; 
    $output['status']['name'] = "executed";
    $output['status']['description'] = "query failed";
    $output['data'] = [];

    // Close database connection
    mysqli_close($conn);

    // Return JSON response and stop script execution
    echo json_encode($output);
    exit;
}

// Initialize an empty array to store query results
$data = [];

// Fetch each row from the query result and add it to the array
while ($row = mysqli_fetch_assoc($result)) {
    array_push($data, $row);
}

// Prepare a successful response
$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

// Close database connection
mysqli_close($conn);

// Return JSON response to the client
echo json_encode($output);
