<?php
$servername = "localhost";
$username = "root3";
$password = "root";
$dbname = "opendata";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$year = $_GET['year'];
$agencyName = $_GET['agencyName'];


/*
$year = '2002';
$agencyName = 'Department of Agriculture';
*/


$sql = "SELECT
  c.Investment_Title investmentTitle,
  c.Project_Name projectName,
  c.Lifecycle_Cost   lifecycleCost,
  c.Project_Description projectDescription
FROM cw1 c
WHERE substr(c.Start_Date, 1, 4) = '" . $year . "'" . "
         AND c.Agency_Name = '" . $agencyName . "'" . " ORDER BY lifecycleCost DESC";


$result = $conn->query($sql);
$agencyName = "";
$array = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rowArray = [
            "investmentTitle" => $row["investmentTitle"],
            "projectName" => $row["projectName"],
            "lifecycleCost" => $row["lifecycleCost"],
            "projectDescription" => $row["projectDescription"],
        ];

        array_push($array, $rowArray);
    }
}

$conn->close();

$json = json_encode($array);
print_r($json);