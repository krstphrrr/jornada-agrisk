<!DOCTYPE HTML>  
<html>
<head>
<link rel="stylesheet" type="text/css" href="//fonts.googleapis.com/css?family=Poppins:400|Poppins:300|Poppins:500|Poppins:600|Poppins:700|Poppins:800">
<link rel="stylesheet" type="text/css" href="css/swch-rma-map-survey.css">
</head>
<body>  

<?php
  
session_start();  
  
function testInput($data) {
    if (strlen($data) > 2000) {
        $data = "";
    }
    else {
        $data = trim($data);
        $data = stripslashes($data);
        $data = str_replace("<", "", $data);
        $data = str_replace("/>", "", $data);
        $data = str_replace(">", "", $data);
    }
    return $data;
}

$servername = "mysql";
$dbname = "rma";
$username = "rma";
$password = "<jer>~<401>";
 

// Define variables and set to empty values
$name = $affiliation = $referral = $comment = "";
$nameError = $affiliationError = $referralError = $commentError = $timeError = $errorMessage = $submitMessage = "";

if ($_SERVER["REQUEST_METHOD"] == "POST") { 
    if (!isset($_SESSION["last_submit"])) {
        $_SESSION["last_submit"] = time();
    }
    else if (time()-$_SESSION["last_submit"] < 15) {
        $timeError = "Post limit exceeded. Please wait at least 15 seconds before submitting another survey.";
    }
    else {
        $_SESSION["last_submit"] = time();
    }

    if (empty($_POST["name"])) {
        $nameError = "Please enter your name before submitting";
    }
    else {
        $name = testInput($_POST["name"]);
        
        // Check that only letters and whitespace are used
        if (!preg_match("/^[a-zA-Z ]*$/", $name)) {
            $nameError = "Only letters and white space are allowed";
        }
    }
  
    if (!empty($_POST["affiliation"])) {
        $affiliation = testInput($_POST["affiliation"]);
    }
    
    if (!empty($_POST["referral"])) {
        $referral = testInput($_POST["referral"]);
    }
    
    if (empty($_POST["comment"])) {
        $commentError = "Please enter a comment before submitting";
    }
    else {
        $comment = testInput($_POST["comment"]);
    }
    
    if ($name != "" && $comment != "" && $nameError == "" && $affiliationError == "" && $referralError == "" && $commentError == "" && $timeError == "") {  
        // Create connection
        $conn = new mysqli($servername, $username, $password, $dbname);
        // Check connection
        if ($conn->connect_error) {
            die("Connection failed: " . $conn->connect_error);
        }

        $conn->query("SET NAMES 'utf8'");
        
        $insertSql = "INSERT INTO user_comment
                      (COMMENT_DATE, USER_NAME, USER_AFFILIATION, REFERRAL, COMMENT)
                      VALUES (NOW(),?,?,?,?)";

        $stmt = $conn->prepare($insertSql);
        $stmt->bind_param("ssss", $name, $affiliation, $referral, $comment);

        if ($stmt->execute() !== TRUE) {
            $errorMessage = "There was an error processing your survey.";
        }
        else {
            $submitMessage = "Your survey was successfully submitted.<br>Thank you for helping us improve this tool.";
            
            $email = "julian.reyes@ars.usda.gov";
            $header = "From: RMA Date Viewer <messages-noreply@swclimatehub.info>";

            $msg = "A new RMA Data Viewer user survey was completed on " . date("F jS, Y h:i:s A") . ".

PLEASE IMMEDIATELY DISCARD THIS EMAIL IF IT WAS SENT TO YOU IN ERROR.";

            //$sent = mail($email, "User survey", $msg, $header);
        }
        $stmt->close();
        $conn->close();
    }
}

?>

<?php if($submitMessage != ""): ?> 
  <div id="survey-response-container">
    <div id="survey-response-content">
      <div id="survey-checkmark"></div>
      <p id="survey-response"><?php echo $submitMessage; ?></p>
      <p><a id="survey-reset" href="user-survey.php">New form</a></p>
    </div>
  </div>
<?php elseif($errorMessage != ""): ?> 
  <div id="survey-response-container">
    <div id="survey-response-content">
      <p id="survey-response-title">Oops</p>
      <p id="survey-response"><?php echo $errorMessage; ?></p>
      <p><a id="survey-reset" href="user-survey.php">New form</a></p>
    </div>
  </div>
<?php else: ?>  
  <form id="survey-form" method="post" action="user-survey.php"> 
    <br>
    <p id="survey-message">Please answer the following questions to help us improve this tool</p>
    <br>
    <label for="name-input">What is your full name?</label>
    <input id="name-input" type="text" name="name" maxlength="100" value="<?php echo $name; ?>" placeholder="Your answer">
    <br>
<?php if($nameError != ""): ?>
    <p class="survey-form-error-msg"><?php echo $nameError; ?></p>
<?php endif; ?>
    <br><br>
    <label for="affiliation-input">What is your professional affiliation, if applicable?</label>
    <input id="affiliation-input" type="text" name="affiliation" maxlength="255" value="<?php echo $affiliation; ?>" placeholder="Your answer">
    <br>
<?php if($affiliationError != ""): ?>
    <p class="survey-form-error-msg"><?php echo $affiliationError; ?></p>
<?php endif; ?>
    <br><br>
    <label for="referral-input">What brought you to the RMA Data Viewer?</label>
    <textarea id="referral-input" name="referral" rows="3" maxlength="500" placeholder="Your answer"><?php echo $referral; ?></textarea>
    <br>
<?php if($referralError != ""): ?>
    <p class="survey-form-error-msg"><?php echo $referralError; ?></p>
<?php endif; ?>
    <br><br>
    <label for="comment-input">What questions, concerns, or ideas for improvement (e.g., additional variables or analysis options) would you like to share?</label>
    <textarea id="comment-input" name="comment" rows="8" maxlength="2000" placeholder="Your answer"><?php echo $comment; ?></textarea>
    <br>
<?php if($commentError != ""): ?>
    <p class="survey-form-error-msg"><?php echo $commentError; ?></p>
<?php endif; ?>
    <br>
<?php if($timeError != ""): ?>
    <p class="survey-form-error-msg"><?php echo $timeError; ?></p>
<?php endif; ?>
    <br>
    <input type="submit" name="submit" value="Submit"> 
  </form>
<?php endif; ?>

</body>
</html>