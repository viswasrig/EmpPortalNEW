<?php
date_default_timezone_set('America/Chicago');
// Include config file
//ini_set('session.save_path', '/home/content/31/7042131/html/tmp');
session_start();
require_once '../config.php';
// Processing form data when form is submitted
$formData = array();
// Processing form data when form is submitted
$data   = urldecode(file_get_contents("php://input"));
$_POST  = json_decode($data, true);
if(isset($_POST["ID"]) && !empty($_POST["ID"])){
    // Validate Amount
    $ID = $_POST["ID"];

    $receivedDate = $_POST["receivedDate"] != null && trim($_POST["receivedDate"]).length>0 ? convertDate(trim($_POST["receivedDate"])):trim($_POST["receivedDate"]);
    $receivedAmount = trim($_POST["receivedAmount"])?floatval(trim($_POST["receivedAmount"])):trim($_POST["receivedAmount"]);
    $paymentMethod = trim($_POST["paymentMethod"]);
    $paymentRef = trim($_POST["paymentRef"]);
    $orginalAmount = trim($_POST["orginalAmount"])?floatval(trim($_POST["orginalAmount"])):trim($_POST["orginalAmount"]);
    $comments = trim($_POST["comments"]);
    $RecStatus = $receivedAmount === $orginalAmount? 'P': 'I';
    $formData['modifiedValues']="receivedAmount: " .$receivedAmount ."orginalAmount: " .$orginalAmount;
        // Prepare an update statement PaymentMethod='" .$paymentMethod ."', PaymentRef='" .$paymentRef ."'
        $sql = "UPDATE Invoice_Master SET  ReceivedDate='" .$receivedDate ."', ReceivedAmount=" .$receivedAmount 
        .", RecStatus='" .$RecStatus ."', Comments='" .$comments ."' WHERE ID =" .$ID; 

        if($result = $mysqli->query($sql)){
            
            $formData['success'] = true;
            $formData['response'] = "Updated Successfully";

        } else{
            $formData['success'] = false;
            $formData['response'] = "Something went wrong. Please try again later." .$mysqli->error;
        }
    
    // Close connection
    $mysqli->close();
}else if(isset($_GET["ID"]) && !empty(trim($_GET["ID"]))){
    
    // Prepare a select statement
    $sql = "SELECT IM.ID, IM.AltID, IM.Date, CONCAT(AM.FirstName,' ', AM.LastName) AS FullName, CM.Name AS ClientName, 
    IM.Price, ASM.Unit, IM.NumOfUnits, IM.Price*IM.NumOfUnits AS Amount, IM.Type, IM.Deductions, IM.DueDate,IM.FromDate, IM.toDate, IM.Comments, IM.ReceivedAmount, IM.ReceivedDate
    FROM Invoice_Master IM
    JOIN Assignment_Master ASM ON IM.AssignmentID = ASM.ID
    JOIN Associate_Master AM ON ASM.AssociateID = AM.ID
    JOIN Client_Master CM ON ASM.ClientID = CM.ID Where IM.ID = ?";
    $ID = trim($_GET["ID"]);
    if($stmt = $mysqli->prepare($sql)){
        // Bind variables to the prepared statement as parameters
        $stmt->bind_param("i", $param_ID);
        
        // Set parameters
        $param_ID =(int)$ID;
        
        // Attempt to execute the prepared statement
        if($stmt->execute()){
            $stmt->store_result();
            
            if($stmt->num_rows == 1){
                // bind the result to variables
                $stmt->bind_result($ID, $altID, $date, $associateName, $clientName, $rate, $unit, $numOfUnits, 
                $amount, $type, $deductions,$dueDate,$fromDate,$toDate,$comments, $rAmount, $rDate);
                
                $stmt->fetch();
                $C=array();
                $C['ID'] = $ID;
                $C['altID'] = $altID;
                $C['invoiceDate'] = $date == null ? null:date('m/d/Y',strtotime($fromDate));
                $C['associateName'] = $associateName;
                $C['cname'] = $clientName;
                $C['rate'] = $rate;
                $C['unit'] = $unit;
                $C['noOfUnits'] = $numOfUnits;
                $C['amount'] = $amount;
                $C['type'] = $type;
                $C['deductions'] =$deductions;
                //$C['fromDate'] = $fromDate;
                //$C['toDate'] = $toDate;
                $C['fromDate'] =$fromDate == null ? null:date('m/d/Y',strtotime($fromDate));
                $C['toDate'] =$toDate == null?null:date('m/d/Y',strtotime($toDate));
                $C['dueDate'] = $dueDate == null? null:date('m/d/Y',strtotime($dueDate)); 
                $C['comments'] = $comments;
                $C['receivedAmount'] = $rAmount;
                $C['receivedDate'] = $rDate === null ? null: date('m/d/Y',strtotime($rDate));
                $formData['success'] = true;
                $formData['response'] = $C;


            } else{
                // URL doesn't contain valid id parameter. Redirect to error page
                //header("location: error.php");
               // exit();
               $formData['success'] = false;
                $formData['msg'] = "URL doesn't contain valid id parameter. Redirect to error page";
            }
            
        } else{
            $formData['success'] = false;
            $formData['msg'] = "Oops! Something went wrong. Please try again later.";
        }
    // Close statement    
    $stmt->close();
    }
    // Close connection
    $mysqli->close();
} else{
    // URL doesn't contain id parameter. Redirect to error page
    //header("location: error.php");
    //exit();
    $formData['success'] = false;
   $formData['msg'] = "URL doesn't contain id parameter. Redirect to error page";
}
echo json_encode($formData);
function convertDate($originalDate){
    $convertedDate = date("Y-m-d", strtotime($originalDate));
   // ChromePhp::log($convertedDate);
    return $convertedDate;
}
?>
