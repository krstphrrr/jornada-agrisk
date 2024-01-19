<?php   

// This script is used to fetch available drought stories in geoJSON format
if (isset($_SERVER["HTTP_REFERER"])) {
    $address = "https://swclimatehub.info/rma";
    if (strpos($_SERVER["HTTP_REFERER"], $address) !== 0) {
        exit("");
    }
} 
else {
    exit("");
}

function testInput ($data) {
    if (empty($data)) {
        $data = "";
    }
    else {
        $data = trim($data);
        $data = clearTags($data);
    }
    return $data;
}

function clearTags ($data) {
    if ($data !== NULL && $data != "") {
        $len = strlen($data);
        $data = strip_tags($data);
        $newLen = strlen($data);
        
        if ($newLen < $len) {
            clearTags($data);
        }
    }
    return $data;
}

// Create a database connection
$servername = "jornada-vdbmy";
$dbname = "drought_resilience";
$username = "dr_public";
$password = "<SwPb4dr>";
 
// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);
// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

$conn->query("SET NAMES 'utf8'");

// Query the database            
$sql = "SELECT StoryID, PlaceName, Latitude, Longitude, LandType, ImpactDate,
        Impact, Story, ResilienceActions, WebLink, Source
        FROM stories
        ORDER BY ImpactDate";
        
$result = $conn->query($sql);
$data = $features = array();
  
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $lat = $row["Latitude"];
        $lon = $row["Longitude"];
        
        $coords = array($lon, $lat);
        
        $geometry = array(
            "type" => "Point",
            "coordinates" => $coords
        );

        $features[] = array(
            "type" => "Feature",
            "geometry" => $geometry,
            "properties" => $row
        );     
    }     
}
 
// Create a geoJSON object
$data["type"] = "FeatureCollection";
$data["features"] = $features;
$conn->close();

header('Content-Type: application/json');
echo json_encode($data, JSON_NUMERIC_CHECK);

?>