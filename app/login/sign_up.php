<?php
include '../ChromePhp.php';
//ini_set('session.save_path', '/home/content/31/7042131/html/tmp');
//session.save_path = '/home/content/31/7042131/html/tmp';
session_start();
require_once '../config.php';
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $fname = $_POST['fname'];
    $mname = $_POST['mname'];
    $lname = $_POST['lname'];
    $dob = $_POST['dob']?convertDate($_POST['dob']):null;
    $ssn = $_POST['ssn'];
    $gender = $_POST['gender'];
    $userid = $_POST['userid'];
    $pwd = $_POST['pwd'];
    $email = $_POST['email'];
    $mobileNumber = $_POST['mobileNumber'];
    //echo $fname,$mname,$lname, $dob, $ssn, $gender, $userid, $pwd, $email, $mobileNumber;
    //ChromePhp::log($_POST);
    ChromePhp::log($fname,$mname,$lname, $dob, $ssn, $gender, $userid, $pwd, $email, $mobileNumber);
    $sqlQuery = "INSERT INTO Associate_Master (FirstName, LastName, MiddleName,Gender, DateOfBirth, SSN, EmployerID, UserID, Password) VALUES(?,?,?,?,?,?,?,?,?)";
    if($stmt = $mysqli->prepare($sqlQuery)){
        $empId= 1;
        $stmt->bind_param("sssssssss", $fname,$lname,$mname,$gender,$dob,$ssn,$empId,$userid,$pwd);
        $stmt->execute();
        echo "New record created successfully";
        $stmt->close();
        $stmt = $mysqli->prepare("SELECT Id FROM Associate_Master WHERE UserID=? and Password=?");
        $stmt->bind_param("ss",$userid,$pwd);
        $isEx = $stmt->execute();
        ChromePhp::log($isEx);
        $stmt->bind_result($AssociateID);
        $stmt->fetch();
        ChromePhp::log($AssociateID);
        $num_rows = $stmt->num_rows;
        $stmt->free_result();
        ChromePhp::log($num_rows);
        if($isEx){ 
            $stmt->close(); 
            ChromePhp::log($AssociateID);
            $stmt = $mysqli->prepare("INSERT INTO ElectronicComm (Type,Value,EntityID,EntityType,CommType) values(?,?,?,?,?)");
            $EmailKEY = "Email";
            $CLIENT = "client";
            $CURRENT = "current";
            $stmt->bind_param("sssss",$EmailKEY,$email,$AssociateID,$CLIENT,$CURRENT);
            $stmt->execute();
            $stmt->free_result();
            ChromePhp::log("---------------- 1. Executed ----------"); 
            $MobileKEY = "Mobile";
            $stmt->bind_param("sssss",$MobileKEY,$mobileNumber,$AssociateID,$CLIENT,$CURRENT);
            $stmt->execute();
            $stmt->free_result();
            ChromePhp::log("---------------- 2. Executed ----------");
        }
        
    }
    $stmt->close();
    $mysqli->close();
}

function convertDate($originalDate){
    $convertedDate = date("Y-m-d", strtotime($originalDate));
   // ChromePhp::log($convertedDate);
    return $convertedDate;
}

?>