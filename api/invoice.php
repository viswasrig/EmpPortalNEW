<?php
// ini_set('session.save_path', '/home/content/31/7042131/html/tmp');
session_start();
require_once './config.php';
date_default_timezone_set('America/Chicago');
$form_data = array();
$resultData = array();
// $sql = "SELECT * FROM Invoice_Master ORDER BY ID ASC";
$sql = "SELECT IM.ID, IM.AltID, IM.Date, CONCAT(AM.FirstName,' ', AM.LastName) AS FullName, CM.Name AS ClientName, 
IM.Price*IM.NumOfUnits AS Amount, IM.DueDate
FROM Invoice_Master IM
JOIN Assignment_Master ASM ON IM.AssignmentID = ASM.ID AND (IM.RecStatus='N' OR IM.RecStatus='I' or IM.RecStatus='U')
JOIN Associate_Master AM ON ASM.AssociateID = AM.ID
JOIN Client_Master CM ON ASM.ClientID = CM.ID";

if($result = $mysqli->query($sql)){
    if($result->num_rows > 0){
        while($row = $result->fetch_array()){
            $rowData = array();
            $rowData['ID'] = $row['ID'];
            $rowData['AltID'] = $row['AltID'];
            $rowData['Date'] = $row['Date'] == null? null: date('m/d/Y',strtotime($row['Date']));
            $rowData['FullName'] = $row['FullName'];
            $rowData['ClientName'] = $row['ClientName'];
            $rowData['Amount'] = $row['Amount'];
            $rowData['DueDate'] = $row['DueDate'] == null? null: date('m/d/Y',strtotime($row['DueDate']));

            $resultData[] = $rowData; 
        }
        $result->free();
    }
    $form_data['success'] = true;
    $form_data['response'] = $resultData;
}else{
    $form_data['success'] = false;
    $form_data['response'] = $resultData;
}
$mysqli->close();
echo json_encode($form_data);
?>