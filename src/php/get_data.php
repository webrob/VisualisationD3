<?php
$servername = "localhost";
$username = "root3";
$password = "root";
$dbname = "opendata";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}


$plannedType = $_GET['plannedType'];
$markType = $_GET['markType'];

$sql = "SELECT Agency_Name, Start_Date, Completion_Date_B1, Planned_Project_Completion_Date_B2,
Projected_Actual_Project_Completion_Date_B2, Lifecycle_Cost, Planned_Cost_M
 FROM cw1 c WHERE  c.Start_Date !=  '0000-00-00' ";

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


$sql = $sql . " ORDER BY c.Agency_Name";

$result = $conn->query($sql);
$agencyName = "";
$index = -1;
$array = array();
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {

        $newAgencyName = $row["Agency_Name"];
        if ($newAgencyName != $agencyName)
        {

            $index = $index + 1;
            $newArray["name"] = $newAgencyName;
            $newArray["dates"] = array();

            $newArray["Completion_Date_B1"] = array();
            $newArray["Planned_Project_Completion_Date_B2"] = array();
            $newArray["Lifecycle_Cost"] = array();
            $newArray["Planned_Cost_M"] = array();

            array_push($array, $newArray);

        }

        array_push($array[$index]["dates"] , $row["Start_Date"]);
        array_push($array[$index]["Completion_Date_B1"] , $row["Completion_Date_B1"]);
        array_push($array[$index]["Planned_Project_Completion_Date_B2"] , $row["Planned_Project_Completion_Date_B2"]);
        array_push($array[$index]["Lifecycle_Cost"] , $row["Lifecycle_Cost"]);
        array_push($array[$index]["Planned_Cost_M"] , $row["Planned_Cost_M"]);

        $agencyName = $newAgencyName;
    }
}

$conn->close();

$json = json_encode($array);
print_r($json);