<?php
$data   = urldecode(file_get_contents("php://input"));
$_POST  = json_decode($data, true);
include './ChromePhp.php';
//ini_set('session.save_path', '/home/content/31/7042131/html/tmp');
//session.save_path = '/home/content/31/7042131/html/tmp';
session_start();
require_once './config.php';
$username_err='';
$password_err='';
$errors = array(); //To store errors
$form_data = array();
$resultData = array();
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $userId = $_POST['userid'] ;
    $pwd = $_POST['password'];
    $rememberMe = $_POST['remember'];
    ChromePhp::log($userId,$pwd, $rememberMe);
    $sqlQuery = "SELECT AM.Id, AM.FirstName, AM.MiddleName, AM.LastName,AM.UserID, AM.Password,ROLE.ID AS RoleID, ROLE.RoleName, RES.ID AS ResourceID, RES.ResourceName
                FROM Associate_Master AS AM
                INNER JOIN Role_Associate_Map AS RAM ON AM.Id = RAM.AssociateID
                AND RAM.Status =  'A'
                INNER JOIN Roles_Master AS ROLE ON ROLE.ID = RAM.RoleID
                INNER JOIN Role_Resource_Map AS RRM ON RRM.RoleID = RAM.RoleID
                AND RAM.Status =  'A'
                INNER JOIN Resource_Master AS RES ON RES.Id = RRM.ResourceID
                WHERE AM.userID = '". $userId ."'";
    if($result = $mysqli->query($sqlQuery)){
        $int_i =0;
        $userDetails = array(); 
        $userDetails['user']  = array();
        $resources = array();
        $row_count = $result -> num_rows;
        if($row_count>0){
            while($row = $result->fetch_array()){
                $C = array();
                if(strcmp($row['Password'], $pwd)==0){
                    if($userDetails['user'] -> ID === NULL){
                        $userDetails['user']  = (object)[
                            'ID' => $row['Id'],
                            'FirstName' => $row['FirstName'],
                            'MiddleName' => $row['MiddleName'],
                            'LastName' => $row['LastName'],
                            'UserID' => $row['UserID'],
                            'RoleID' => $row['RoleID'],
                            'RoleName' => $row['RoleName'],
                        ];
                    }
                }else{
                    $errors['error'] = 'The password you entered was not valid.';
                    break;
                }
                $C['ResourceID'] = $row['ResourceID'];
                $C['ResourceName'] = $row['ResourceName'];
                $resources[] = $C;
                $userDetails['user'] -> resources =  array();
                $userDetails['user'] -> resources = $resources;
                $int_i++;
            }
            $resultData = $userDetails;
        }else{
            $errors['error'] = 'No account found with that username.';
        }
    }else{
        $errors['error'] = "Oops! Something went wrong. Please try again later.";
    }
    $mysqli->close();

    if (!empty($errors)) { //If errors in validation
        $form_data['success'] = false;
        $form_data['errors']  = $errors;
    }
    else { //If not, process the form, and return true on success
        $form_data['success'] = true;
        $form_data['posted'] = 'login was Succefully';
        $form_data['response'] = $resultData;
    }    
}
echo json_encode($form_data);
?>
