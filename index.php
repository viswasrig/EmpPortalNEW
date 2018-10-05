<?php
$txt = "Hello world!";
$x = 5;
$y = 10.5;
echo "$txt";
echo "<h2>PHP is fun!<h2>";
echo "Hello world! <br/>";
echo "This ", "string ", "was ", "made ", "with multiple parameters.";
$txt2 = "W3schools.com";

echo "<h2>" . $txt2 . "</h2>";
echo "<h2>" . ($x + $y) . "</h2>";

print "<h2> PHP is fun !<h2>";
$x = 5985;
var_dump($x);
var_dump($txt);

$x = 10.365;
var_dump($x);

$cars = array("Volvo","BMW","Toyota");
var_dump($cars);

class Car {
    function Car() {
        $this->model = "VW";
    }
}

$herbie = new Car();

// show object properties
echo "<br/>";
echo $herbie->model;

$x = "Hello world!";
$x = null;
echo "<br/>";
var_dump($x);

echo strlen("Hello world!") + "<br/>";
echo "<br/>";
echo str_word_count("Hello world!");
echo "<br/>";
define("GREETING", "Welcome to Hello World...! program");
echo GREETING;
$daye = date_default_timezone_set(1);
$t = date("H");
if($t < "20"){
    echo "Have a Good Day";
}
header('Location: app/login/login.php');
?>
