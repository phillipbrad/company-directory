<?php

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

// Check if required parameters are present
if (!isset($_POST['id']) || !isset($_POST['type'])) {
  $output['status']['code'] = "400";
  $output['status']['name'] = "error";
  $output['status']['description'] = "Missing required parameters";
  $output['data'] = [];
  echo json_encode($output);
  exit;
}

// Get parameters
$id = $_POST['id'];
$type = $_POST['type'];

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
  $output['status']['code'] = "300";
  $output['status']['name'] = "failure";
  $output['status']['description'] = "database unavailable";
  $output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
  $output['data'] = [];
  mysqli_close($conn);
  echo json_encode($output);
  exit;
}

$data = [];

if ($type === "department") {
  // Get department name and employee count in one query
  $query = $conn->prepare("
      SELECT d.name, COUNT(p.id) as count
      FROM department d
      LEFT JOIN personnel p ON d.id = p.departmentID
      WHERE d.id = ?
      GROUP BY d.id
  ");
  $query->bind_param("i", $id);
  $query->execute();
  $result = $query->get_result();
  $data = $result->fetch_assoc();
} else if ($type === "location") {
  // Get location name and department count in one query
  $query = $conn->prepare("
      SELECT l.name, COUNT(d.id) as count
      FROM location l
      LEFT JOIN department d ON l.id = d.locationID
      WHERE l.id = ?
      GROUP BY l.id
  ");
  $query->bind_param("i", $id);
  $query->execute();
  $result = $query->get_result();
  $data = $result->fetch_assoc();
} else {
  $output['status']['code'] = "400";
  $output['status']['name'] = "error";
  $output['status']['description'] = "Invalid type parameter";
  $output['data'] = [];
  echo json_encode($output);
  exit;
}

$output['status']['code'] = "200";
$output['status']['name'] = "ok";
$output['status']['description'] = "success";
$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
$output['data'] = $data;

echo json_encode($output);
mysqli_close($conn);
