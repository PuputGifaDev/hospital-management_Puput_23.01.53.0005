<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

if ($method == 'GET') {
    if(isset($_GET['id'])) {
        $id = $_GET['id'];
        $query = "SELECT * FROM poliklinik WHERE id = ?";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $id);
    } else {
        $query = "SELECT * FROM poliklinik ORDER BY nama_poli ASC";
        $stmt = $db->prepare($query);
    }
    
    $stmt->execute();
    $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
    
    echo json_encode($result);
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed"));
}
?>