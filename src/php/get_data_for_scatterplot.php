<?php
$servername = "localhost";
$username = "root3";
$password = "root";
$dbname = "opendata";

$conn = new mysqli($servername, $username, $password, $dbname);
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$sql = "SELECT
  c.Agency_Name                                     agencyName,
  substr(c.Start_Date, 1, 4)                        startYear,
  sum(c.Lifecycle_Cost)                             lifecycleSum,
  count(*)                                          projectsCount,
  sum(datediff(c.Completion_Date_B1, c.Start_Date)) daysAmount
FROM cw1 c
WHERE
  datediff(c.Completion_Date_B1, c.Start_Date) > 0
GROUP BY c.Agency_Name, substr(c.Start_Date, 1, 4)
ORDER BY c.Agency_Name, c.Start_Date";


$result = $conn->query($sql);
$agencyName = "";
$index = -1;
$array = array();
if ($result->num_rows > 0) {
    while ($row = $result->fetch_assoc()) {

        $newAgencyName = $row["agencyName"];
        if ($newAgencyName != $agencyName) {

            $index = $index + 1;

            $newArray["name"] = $newAgencyName;
            $newArray["lifecycleSum"] = array();
            $newArray["projectsCount"] = array();
            $newArray["daysAmount"] = array();

            array_push($array, $newArray);

        }

        $startYear = $row["startYear"];

        $yearWithLifecycleSum = array($startYear, $row["lifecycleSum"]);
        array_push($array[$index]["lifecycleSum"], $yearWithLifecycleSum);

        $yearWithProjectsCount = array($startYear, $row["projectsCount"]);
        array_push($array[$index]["projectsCount"], $yearWithProjectsCount);

        $yearWithDaysAmount = array($startYear, $row["daysAmount"]);
        array_push($array[$index]["daysAmount"], $yearWithDaysAmount);

        $agencyName = $newAgencyName;
    }
}
$conn->close();

$json = json_encode($array);
print_r($json);