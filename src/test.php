<?php
   $servername = "agmysql";
   $dbname = "rma";
   $username = "rma";
   $password = "<jer>~<401>";
   $port = 3306;
   // Create connection
   $conn = mysqli($servername, $username, $password, $dbname, $port);
   if (!$conn) {
      die("Connection failed: " . mysqli_connect_error());
   }
   $sql = 'SELECT COUNT(*) FROM rma';
   $result = $mysqli_query($conn, $sql);
   if (!$result) {
      printf("false");
   }
   printf("Selected returned %d rows. \n", mysqli_num_rows($result));
?>