<?php
$data   = urldecode(file_get_contents("php://input"));
$_POST  = json_decode($data, true);
date_default_timezone_set('America/Chicago');
//ini_set('session.save_path', '/home/content/31/7042131/html/tmp');
session_start();
require_once '../config.php';
$associateName = $percentage ="";
$associateName_err = $percentage_err = "";
$dateOfExp = date_create()->format('Y-m-d H:i:s');
$form_data = array();
$resultData = array(); 
$associateID = "";
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $input_associateName = trim($_POST["AssociativeID"]);
    if(empty($input_associateName)){
        $associateName_err = "Associate ID is required";
    } else {
        $associateID = (int)trim($_POST["AssociativeID"]);
    }
    $form_data['error']=$associateName_err;
    if( empty($associateName_err) ){
    $sql = "SELECT Prctg from Associate_Compensation WHERE AssociateID=?";
    if($stmt = $mysqli->prepare($sql)){
        $stmt->bind_param("i", $param_ID);
        $param_ID = (int)$associateID;
        if($stmt->execute()){
            $stmt->store_result();
            $form_data['number of rows'] = $stmt->num_rows;
            if($stmt->num_rows == 1){
                $stmt->bind_result($Prctg);
                $stmt->fetch();
                $percentage = $Prctg;
                $form_data['success'] = true;
                if($percentage == null){
                    $form_data['success'] = false;
                    $form_data['response'] = "Percentage is not found for corresponding Associate: " .$associateID . " Whose Name is " .$associateName. " . Please insert percentage Record.";
                }
            } else{
                $form_data['success'] = false;
                $form_data['response'] = "Percentage is not found for corresponding Associate: " .$associateID . " Whose Name is " .$associateName. " . Please insert percentage Record.";
            }
    }else{
        $form_data['success'] = false;
        $form_data['msg'] = "URL doesn't contain valid id parameter. Redirect to error page" .$mysqli->error;
    }
    $stmt->close();
    }else{
        $form_data['success'] = false;
        $form_data['success'] = "AssociateID is not found" .$mysqli->error;
    }
    }else{
        $form_data['success'] = false;
        $form_data['success'] = "AssociateID is not found";
    }
    if($form_data['success']){
        $receivedDate = $_POST["ReceivedDate"] ==null?null:convertDate(trim($_POST["ReceivedDate"]));
        $InvoiceID = trim($_POST["ID"]);
        $amount = trim($_POST["TotalAmount"]);
        $employeeShare = ($amount * $percentage)/100;
        $reference=null;
        $sql = "INSERT INTO Associate_Income 
        (AssociateID,InvoiceID,ReceivedDate,EmployerAmount, Percentage,EmployeeShare,Reference) 
        VALUES (?,?,?,?,?,?,?)";
        if($stmt = $mysqli->prepare($sql)){
            $stmt->bind_param("sssssss", $associateID,$InvoiceID, $receivedDate, $amount, $percentage, $employeeShare, $reference);
           if($stmt->execute()){
                $form_data['success'] = true;
                $form_data['response']= "Income Assigned successfully.";
            } else{
                $form_data['success'] = false;
                $form_data['response']= "Something went wrong. Please try again later.";
            } 
        $stmt->close();
        }else{ 
            $form_data['success'] = false;
            $form_data['response']= "Something went wrong. Please try again later.";
        }
    }
    $mysqli->close();
}
echo json_encode($form_data);
function convertDate($originalDate){
    $convertedDate = date("Y-m-d", strtotime($originalDate));
    return $convertedDate;
}
?>