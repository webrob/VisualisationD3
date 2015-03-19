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
$fromMonth = $_GET['fromMonth'];
$toMonth = $_GET['toMonth'];

$sql = "SELECT
  c.Start_Date startDate,
  c.Completion_Date_B1 completionDate,
  c.Investment_Title investmentTitle,
  c.Project_Name projectName,
  c.Lifecycle_Cost   lifecycleCost,
  c.Project_Description projectDescription
FROM cw1 c
WHERE substr(c.Start_Date, 1, 4) = '" . $year . "'" . "
         AND c.Agency_Name = '" . $agencyName . "'" . "
         AND substr(c.Start_Date, 6, 2) BETWEEN  '" . $fromMonth . "'" . "
         AND '" . $toMonth . "'" .
    " ORDER BY lifecycleCost DESC";


$result = $conn->query($sql);
$agencyName = "";
$array = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $rowArray = array(
            "startDate" => $row["startDate"],
            "completionDate" => checkMissingDate($row["completionDate"]),
            "investmentTitle" => $row["investmentTitle"],
            "projectName" => $row["projectName"],
            "lifecycleCost" => $row["lifecycleCost"],
            "projectDescription" => $row["projectDescription"],
        );
        array_push($array, $rowArray);
    }
}

$conn->close();

$json = json_encode($array);
print_r($json);

function checkMissingDate($date)
{
    if ($date == '0000-00-00') {
        $date = 'missing value';
    }
    return $date;
}