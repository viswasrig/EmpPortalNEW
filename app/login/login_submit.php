<?php
include '../ChromePhp.php';
//ini_set('session.save_path', '/home/content/31/7042131/html/tmp');
//session.save_path = '/home/content/31/7042131/html/tmp';
session_start();
require_once '../config.php';
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $userId = $_POST['userid'];
    $pwd = $_POST['password'];
    $rememberMe = $_POST['remember'];
    //echo $fname,$mname,$lname, $dob, $ssn, $gender, $userid, $pwd, $email, $mobileNumber;
    //ChromePhp::log($_POST);
    ChromePhp::log($userId,$mname,$pwd, $rememberMe);
    $sqlQuery = "SELECT ID, FirstName, LastName, UserID, Password, AssociateType FROM Associate_Master WHERE UserID = ?";
    if($stmt = $mysqli->prepare($sqlQuery)){
        $stmt->bind_param("s", $userId);
        if($stmt->execute()){
            $stmt->store_result();
            $num_rows = $stmt->num_rows;
            if($num_rows == 1){
                $stmt->bind_result($AssociateID, $FirstName, $LastName, $uid, $db_password, $AssociateType);
                $stmt->fetch();
                if(strcmp($db_password, $password)==0){
                    $_SESSION['AssociateID'] = $AssociateID;
                    $_SESSION['AssociateType'] = $AssociateType;
                    $_SESSION['FirstName'] = $FirstName;
                    $_SESSION['LastName'] = $LastName;
                    header("location:menus.php");
                } else{
                    $password_err = 'The password you entered was not valid.';
                }
            }else{
                $username_err = 'No account found with that username.';
            }
        }else{
            echo "Oops! Something went wrong. Please try again later.";
        }
    }
    $stmt->close();
    $mysqli->close();
}
?>