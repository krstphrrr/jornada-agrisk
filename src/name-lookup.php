<?php   
// This script is used to fetch a lookup table of state, county, commodity, or cause of loss names
if (isset($_SERVER["HTTP_REFERER"])) {
    // $address = "https://swclimatehub.info/rma/";
    $address = "http://localhost:5007/";
    if (strpos($_SERVER["HTTP_REFERER"], $address) !== 0) {
        exit("");
    }
} 
else {
    exit("");
}

function testInput ($data) {
    $data = trim($data);
    $data = stripslashes($data);
    return $data;
}

// Default parameter values
$type = "";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET["type"])) $type = testInput($_GET["type"]);
}

$servername = "agmysql";
$dbname = "rma";
$username = "rma";
$password = "<jer>~<401>";
  
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->query("SET NAMES 'utf8'");

if ($type != "state" && $type != "county" && $type != "commodity" && $type != "cause") {
    $conn->close();
    exit("");
}

$lookup = array();

if ($type == "state") {
    $sql = "SELECT STATEFP, NAME
            FROM state
            ORDER BY STATEFP";   
            
    $result = $conn->query($sql);
      
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {     
            $lookup[$row["STATEFP"]] = $row["NAME"];
        }
    }
}
else if ($type == "county") {     
    $sql = "SELECT STATEFP, COUNTYFP, NAME
            FROM county
            ORDER BY STATEFP, COUNTYFP";        
    
    $result = $conn->query($sql);
      
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) {   
            $countyCode = $row["STATEFP"] . $row["COUNTYFP"];
            $lookup[$countyCode] = $row["NAME"];
        }
    }
}
else if ($type == "commodity") {     
    $sql = "SELECT COMMODITY_CODE, COMMODITY
            FROM rma_payment
            GROUP BY COMMODITY_CODE, COMMODITY
            ORDER BY COMMODITY_CODE, COMMODITY";
            
    $result = $conn->query($sql);
      
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) { 
            $lookup[$row["COMMODITY_CODE"]] = ucwords(strtolower($row["COMMODITY"]));
        }
    }
}
else if ($type == "cause") {     
    $sql = "SELECT CAUSE_CODE, CAUSE_OF_LOSS
            FROM rma_payment
            GROUP BY CAUSE_CODE, CAUSE_OF_LOSS
            ORDER BY CAUSE_CODE, CAUSE_OF_LOSS";
            
    $result = $conn->query($sql);
      
    if ($result->num_rows > 0) {
        while($row = $result->fetch_assoc()) { 
            $lookup[$row["CAUSE_CODE"]] = $row["CAUSE_OF_LOSS"];
        }
    }
}

echo json_encode($lookup);

$conn->close();
?>