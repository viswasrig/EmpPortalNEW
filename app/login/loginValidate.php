<?php
include '../ChromePhp.php';
//ini_set('session.save_path', '/home/content/31/7042131/html/tmp');
//session.save_path = '/home/content/31/7042131/html/tmp';
session_start();
require_once '../config.php';
$username_err='';
$password_err='';
$errors = array(); //To store errors
$form_data = array();

if($_SERVER["REQUEST_METHOD"] == "POST"){
    $userId = $_POST['userid'];
    $pwd = $_POST['password'];
    $rememberMe = $_POST['remember'];
    ChromePhp::log($userId,$pwd, $rememberMe);
    $sqlQuery = "SELECT ID, FirstName, LastName, UserID, Password, AssociateType FROM Associate_Master WHERE UserID = ?";
    if($stmt = $mysqli->prepare($sqlQuery)){
        $stmt->bind_param("s", $userId);
        if($stmt->execute()){
            ChromePhp::log("Query Executed");
            $stmt->store_result();
            $num_rows = $stmt->num_rows;
            ChromePhp::log("Number of rows : "+$num_rows);
            if($num_rows == 1){
                $stmt->bind_result($AssociateID, $FirstName, $LastName, $uid, $db_password, $AssociateType);
                $stmt->fetch();
                ChromePhp::log("Fetch Results : ");
                ChromePhp::log($AssociateID, $FirstName, $LastName, $uid, $db_password, $AssociateType);
                if(strcmp($db_password, $pwd)==0){
                    ChromePhp::log("Password matched");
                    $_SESSION['AssociateID'] = $AssociateID;
                    $_SESSION['AssociateType'] = $AssociateType;
                    $_SESSION['FirstName'] = $FirstName;
                    $_SESSION['LastName'] = $LastName;
                    //header("location:../main/menu.php");
                } else{
                    ChromePhp::log("Password NOT matched");
                    $password_err = 'The password you entered was not valid.';
                    $errors['password'] = $password_err;
                }
            }else{
                ChromePhp::log("UserName not matched");
                $username_err = 'No account found with that username.';
                $errors['userid'] = $username_err;
            }
        }else{
            ChromePhp::log("UserName and PWD not matched");
           // echo "Oops! Something went wrong. Please try again later.";
        }
    }
    $stmt->close();
    $mysqli->close();
}

if (!empty($errors)) { //If errors in validation
    $form_data['success'] = false;
    $form_data['errors']  = $errors;
}
else { //If not, process the form, and return true on success
    $form_data['success'] = true;
    $form_data['posted'] = 'login was Succefully';
}
echo json_encode($form_data);
?>
