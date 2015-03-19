<?php
$servername = "localhost";
$username = "root3";
$password = "root";
$dbname = "opendata";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$requestDate = $_GET['Start_Date'];
$agencyName = $_GET['Agency_Name'];
$plannedType = $_GET['plannedType'];
$markType = $_GET['markType'];

$sql = "SELECT Completion_Date_B1, Planned_Project_Completion_Date_B2,
Project_Name, Lifecycle_Cost, Planned_Cost_M
 FROM cw1 c WHERE  c.Start_Date !=  '0000-00-00' AND c.Agency_Name ='" . $agencyName . "' and c.Start_Date = '" . $requestDate . "'";

switch ($plannedType) {
    case "compliant" :

        switch ($markType) {
            case "time":
                $sql = $sql . " and c.Completion_Date_B1 != '0000-00-00' and
                c.Planned_Project_Completion_Date_B2 != '0000-00-00' and c
                .Completion_Date_B1 <= c.Planned_Project_Completion_Date_B2";
                break;
            case "cost":

                $sql = $sql . " and c.Lifecycle_Cost != 0 and c.Planned_Cost_M != 0 and c.Lifecycle_Cost <= c.Planned_Cost_M";
                break;
            case "all":

                $sql = $sql . " and c.Lifecycle_Cost != 0 and c.Planned_Cost_M != 0 and c.Lifecycle_Cost <= c.Planned_Cost_M
                and c.Completion_Date_B1 != '0000-00-00' and c.Planned_Project_Completion_Date_B2 != '0000-00-00' and
                c.Completion_Date_B1 <= c.Planned_Project_Completion_Date_B2";

                break;
        }

        break;
    case  "more":

        switch ($markType) {
            case "time":
                $sql = $sql . " and c.Completion_Date_B1 != '0000-00-00' and
                c.Planned_Project_Completion_Date_B2 != '0000-00-00' and
                c.Completion_Date_B1 > c.Planned_Project_Completion_Date_B2";
                break;
            case "cost":

                $sql = $sql . " and c.Lifecycle_Cost != 0 and c.Planned_Cost_M != 0 and c.Lifecycle_Cost > c.Planned_Cost_M";
                break;
            case "all":

                $sql = $sql . " and c.Lifecycle_Cost != 0 and c.Planned_Cost_M != 0 and c.Lifecycle_Cost > c.Planned_Cost_M
                and c.Completion_Date_B1 != '0000-00-00' and c.Planned_Project_Completion_Date_B2 != '0000-00-00' and
                c.Completion_Date_B1 > c.Planned_Project_Completion_Date_B2";

                break;
        }
        break;
}

$result = $conn->query($sql);

$index = -1;
$array["data"] = array();

if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {
        $index = $index + 1;

        $array["data"][$index] = array();
        array_push($array["data"][$index], $row["Project_Name"]);
        array_push($array["data"][$index], checkMissingDate($row["Completion_Date_B1"]));
        array_push($array["data"][$index], checkMissingDate($row["Planned_Project_Completion_Date_B2"]));
        array_push($array["data"][$index], $row["Lifecycle_Cost"]);
        array_push($array["data"][$index], $row["Planned_Cost_M"]);
    }
}
function checkMissingDate($date)
{
    if ($date == '0000-00-00') {
        $date = 'missing value';
    }
    return $date;
}

$conn->close();

$json = json_encode($array);
print_r($json);