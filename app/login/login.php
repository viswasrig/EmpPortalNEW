<?php
include '../ChromePhp.php';
//ini_set('session.save_path', '/home/content/31/7042131/html/tmp');
//session.save_path = '/home/content/31/7042131/html/tmp';
session_start();
require_once '../config.php';
$username_err='';
$password_err='';
if($_SERVER["REQUEST_METHOD"] == "POST"){
    $userId = $_POST['userid'];
    $pwd = $_POST['password'];
    $rememberMe = $_POST['remember'];
    //echo $fname,$mname,$lname, $dob, $ssn, $gender, $userid, $pwd, $email, $mobileNumber;
    //ChromePhp::log($_POST);
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
                    header("location:../main/menu.php");
                } else{
                    ChromePhp::log("Password NOT matched");
                    $password_err = 'The password you entered was not valid.';
                }
            }else{
                ChromePhp::log("UserName not matched");
                $username_err = 'No account found with that username.';
            }
        }else{
            ChromePhp::log("UserName and PWD not matched");
            echo "Oops! Something went wrong. Please try again later.";
        }
    }
    $stmt->close();
    $mysqli->close();
}
?>

<!DOCTYPE HTML>
<html>
<head>
<link rel="stylesheet" href="../../assets/css/bootstrap/css/bootstrap.min.css" />
<link rel="stylesheet" href="../../assets/css/font-awesome-4.7.0/css/font-awesome.min.css" />
<link rel="stylesheet" href="../../assets/js/bootstrap-datepicker/css/bootstrap-datepicker.min.css" />
<link rel="stylesheet" href="../../assets/css/main.css" />

<script src="../../assets/js/jQuery/jquery-3.3.1.min.js"></script>
<script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.12.9/umd/popper.min.js" integrity="sha384-ApNbgh9B+Y1QKtv3Rn7W3mgPxhU9K/ScQsAP7hUibX39j7fakFPskvXusvfa0b4Q" crossorigin="anonymous"></script>
<script src="../../assets/css/bootstrap/js/bootstrap.min.js"></script>
<script src="../../assets/js/bootstrap-datepicker/js/bootstrap-datepicker.min.js"></script>
<script src="../serviceAPI.js"></script>

<script src="../validate.js"></script>
<script src="./login.js"></script>
<script src="../utils.js"></script>
</head>
<body>
    <div class="limiter h-100">
        <div class="container-login100">
            <div class="wrap-login100">
                <div class="w-100 sign-tabs">
                    <div class="float-right">
                         <button class="btn rounded-0 log-in-t" onclick="showLogin()">Log in</button>
                    </div>
                    <div class="float-right">
                         <button class="btn rounded-0 sign-up-t" onclick="showSignUp()">Sign up</button>
                    </div>
                    <input type="hidden" name="ltype" class="l-type" value="<?php echo $selectedTab ?>" /> 
                </div>   
                <div class="card shadow-lg bg-white rounded-0 border-top-0 w-100">
                    <div class="card-body">
                        <div class="login-container">  
                            <div class="sign-in">
                                <span class="title">log in to e3Global.com <i class="fa fa-lock px-1 color_orange_1"></i> </span>
                            </div>
                            <div class="spacer"></div>
                            <div class="section login-form-container w-100">
                                <div class="row">
                                    <div class="col-7">
                                        <form class="form log-in-from"  novalidate>
                                            <fieldset>
                                                <div class="row">
                                                    <div class="col-10">
                                                        <div class="form-group l-field">
                                                            <input class="form-control rounded-0 user-id" placeholder="User Id" name="userid" type="text" autofocus autocomplete="off" MaxLength="25" data-efield="User Id" required>
                                                            <div class="error"></div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div class="row">
                                                    <div class="col-10">
                                                        <div class="form-group l-field">
                                                            <input class="form-control rounded-0 password" placeholder="Password" name="password" type="password" value="" data-efield="Password" MaxLength="40" required>
                                                            <div class="error"></div>
                                                        </div>
                                                    </div>
                                                </div>  
                                                <div class="row">
                                                    <div class="col-10">
                                                        <div class="checkbox">
                                                            <label>
                                                                <input name="remember" type="checkbox" value="Remember Me"><span class="px-1">Remember Me</span>
                                                            </label>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div class="row">
                                                    <div class="col-3">
                                                        <!-- Change this to a button or input when using this as a form -->
                                                        <button type="button" class="btn btn-md btn-primary btn-block rounded-0" onClick="loginSubmit(this.form)">Login</button>
                                                        <!--<a href="index.html" class="btn btn-md btn-primary btn-block rounded-0">Login</a> -->
                                                    </div>
                                                </div>
                                            </fieldset>
                                        </form>
                                    </div>
                                    <div class="col-5 p-0">
                                        <div class="l-r-section px-2 py-3">
                                            <div class="d-inline-block">
                                                <h6 class="mb-1">Don't have an account?</h6>
                                                <p class="small"><a class="no-underline" href="#" onClick="showSignUpForm(this)">Sign Up now!</a></h6>
                                            </div>
                                            <div class="d-inline-block">
                                                <h6 class="mb-1">Did you forget your password?</h6>
                                                <p class="small"><a class="no-underline" href="">Recover it here!</a></p>
                                            </div>
                                        </div>
                                    </div>
                                </div> <!-- Row --End -->
                            </div> <!-- lofn-form-container --End -->
                        </div><!-- Login Container End -->
                        <div class="sign-up-container">
                                <div class="sign-in">
                                    <span class="title">Sign Up in to e3Global.com <i class="fa fa-user-plus px-1 color_green_1"></i> </span>
                                </div>
                                <div class="section container signup-form-container w-100">
                                    <div class="row">
                                        <div class="col-md-12 col-sm-12 col-lg-12 col-xl-12 p-0">
                                            <form class="form sign-up-form" action="./sign_up.php" method="POST"  novalidate>
                                                <div class="form-row">
                                                    <div class="form-group col-md-6 col-sm-6 col-lg-6 col-xl-6">
                                                        <label for="fname">First Name<em class="required-field">*</em></label>
                                                        <input class="form-control" type="text" value="" name="fname" id="fname" autocomplete="off" placeholder="First Name" MaxLength="25" data-efield="First Name"  required>
                                                    </div>
                                                    <div class="form-group col-md-6 col-sm-6 col-lg-6 col-xl-6">
                                                        <label for="mname">Middle Name</label>
                                                        <input class="form-control" type="text" value="" name="mname" id="mname" autocomplete="off" placeholder="Middle Name" data-efield="Middle Name" MaxLength="25">
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group col-md-6 col-sm-6 col-lg-6 col-xl-6">
                                                        <label for="lname">Last Name<em class="required-field">*</em></label>
                                                        <input class="form-control" type="text" value="" name="lname" id="lname" autocomplete="off" placeholder="Last Name" MaxLength="25" data-efield="Last Name" required>
                                                    </div>
                                                    <div class="form-group date col-md-6 col-sm-6 col-lg-6 col-xl-6">
                                                        <label for="dob">Date of Birth</label>
                                                        <input class="form-control datepicker" type="text" value="" name="dob" id="dob" autocomplete="off" MaxLength="10" placeholder="MM/dd/YYYY" data-efield="Date of Birth">
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group col-md-6 col-sm-6 col-lg-6 col-xl-6">
                                                        <label for="ssn">SSN</label>
                                                        <input class="form-control" type="text" value="" name="ssn" id="ssn" autocomplete="off" placeholder="SSN" data-efield="SSN" MaxLength="11">
                                                    </div>
                                                    <div class="form-group col-md-6 col-sm-6 col-lg-6 col-xl-6">
                                                        <label for="gender">Gender</label>
                                                        <select class="custom-select form-control" id="inlineFormCustomSelect" name="gender" data-efield="Gender">
                                                            <option value="-1" selected>-- Select --</option>
                                                            <option value="M">MALE</option>
                                                            <option value="F">Female</option>
                                                            <option value="O">Other</option>
                                                        </select>
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group col-md-6 col-sm-6 col-lg-6 col-xl-6">
                                                        <label for="userid">User Id<em class="required-field">*</em></label>
                                                        <input class="form-control" type="text" value="" name="userid" id="userid" MaxLength="25" autocomplete="off" placeholder="User Id" data-efield="User Id" required>
                                                    </div>
                                                    <div class="form-group col-md-6 col-sm-6 col-lg-6 col-xl-6">
                                                        <label for="dob">Password<em class="required-field">*</em></label>
                                                        <input class="form-control" type="password" value="" name="pwd" id="pwd" MaxLength="40" autocomplete="off" placeholder="Password" data-efield="Password" required>
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group col-md-6 col-sm-6 col-lg-6 col-xl-6">
                                                        <label for="userid">Email<em class="required-field">*</em></label>
                                                        <input class="form-control" type="email" value="" name="email" id="email" autocomplete="off" placeholder="Email" MaxLength="50" data-efield="Email" pattern="^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$" required>
                                                    </div>
                                                    <div class="form-group col-md-6 col-sm-6 col-lg-6 col-xl-6">
                                                        <label for="mobileNumber">Mobile Number<em class="required-field">*</em></label>
                                                        <input class="form-control" type="text" value="" name="mobileNumber" id="mobileNumber" autocomplete="off" MaxLength="10" data-efield="Mobile Number" placeholder="Mobile Number (Ex: xxxxxxxxxx)" pattern="^(\+\d{1,3}[- ]?)?\d{10}$" required>
                                                    </div>
                                                </div>
                                                <div class="form-row">
                                                    <div class="form-group col-md-12 col-sm-12 col-lg-12 col-xl-12">
                                                        <button type="submit" class="btn btn-default  rounded-0 float-right my-2">Submit</button>
                                                    </div>
                                                </div>
                                            </form>
                                        </div>
                                    </div>
                                </div>

                        </div><!-- Sign Up Container end -->  
                    </div><!-- Card body -->
                </div><!-- Card-->
            </div>
    </div>
</form>
</body>
</html>