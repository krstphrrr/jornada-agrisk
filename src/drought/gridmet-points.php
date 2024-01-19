<?php   

// This script is used to fetch available drought stories in geoJSON format
if (isset($_SERVER["HTTP_REFERER"])) {
    $address = "https://jornada-webapp/metquery";
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

$w = $e = $n = $s = "";

if ($_SERVER["REQUEST_METHOD"] == "GET") {
    if (isset($_GET["west"])) $w = testInput($_GET["west"]);
    if (isset($_GET["east"])) $e = testInput($_GET["east"]);
    if (isset($_GET["north"])) $n = testInput($_GET["north"]);
    if (isset($_GET["south"])) $s = testInput($_GET["south"]);
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

$data = $features = array();

if ($w != "" and $n != "" and $e != "" and $s != "") {
    $w = Float($w);
    $e = Float($e);
    $n = Float($n);
    $s = Float($s);
        
    if ($w >= -180 and $w <= 180 and $e >= -180 and $e <= 180 and $n >= 0 and $n <= 90 and $s >= 0 and $s <= 90) {
        // Query the database            
        $sql = "SELECT * FROM 
                gridmet_points 
                WHERE longitude >= ? 
                AND longitude <= ? 
                AND latitude <= ? 
                AND latitude >= ?";
                
        $stmt = $conn->prepare($sql);
        $stmt->bind_param("dddd", $w, $e, $n, $s);          
        $stmt->execute();
        $result = $stmt->get_result();
        
        while($row = $result->fetch_assoc()) {
            coords = array($row["longitude"], $row["latitude"]);
            
            geometry = array(
                "type" => "Point",
                "coordinates" => coords
            );
            
            properties = array(
                "serialID" => $row["serial_id"],
                "longitudeID" => $row["longitude_id"],
                "latitudeID" => $row["latitude_id"],
                "elev" => $row["elevation"],
                "selected" => 0
            );
            
            feature = array(
                "type" => "Feature",
                "geometry" => geometry,
                "properties" => properties
            );
            
            features[] = feature;
        }
        $stmt->close();
    }
}
 
// Create a geoJSON object
$data["type"] = "FeatureCollection";
$data["features"] = $features;
$conn->close();

header('Content-Type: application/json');
echo json_encode($data, JSON_NUMERIC_CHECK);

?>