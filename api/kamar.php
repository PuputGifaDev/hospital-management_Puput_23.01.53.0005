<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];
  
switch($method) {
    case 'GET':
        if(isset($_GET['id'])) {
            $id = $_GET['id'];
            $query = "SELECT * FROM kamar WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $id);
        } else if(isset($_GET['status'])) {
            $status = $_GET['status'];
            $query = "SELECT * FROM kamar WHERE status = ? ORDER BY kelas, kode_kamar";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $status);
        } else if(isset($_GET['tersedia'])) {
            $query = "SELECT * FROM kamar WHERE status = 'tersedia' AND terisi < kapasitas ORDER BY kelas, kode_kamar";
            $stmt = $db->prepare($query);
        } else {
            $query = "SELECT * FROM kamar ORDER BY kelas, kode_kamar";
            $stmt = $db->prepare($query);
        }
        
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO kamar SET kode_kamar=?, nama_kamar=?, kelas=?, kapasitas=?, terisi=?, 
                 harga_per_hari=?, fasilitas=?, status=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->kode_kamar);
        $stmt->bindParam(2, $data->nama_kamar);
        $stmt->bindParam(3, $data->kelas);
        $stmt->bindParam(4, $data->kapasitas);
        $stmt->bindParam(5, $data->terisi);
        $stmt->bindParam(6, $data->harga_per_hari);
        $stmt->bindParam(7, $data->fasilitas);
        $stmt->bindParam(8, $data->status);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Kamar berhasil ditambahkan."));
        } else {
            echo json_encode(array("message" => "Gagal menambahkan kamar."));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE kamar SET kode_kamar=?, nama_kamar=?, kelas=?, kapasitas=?, terisi=?, 
                 harga_per_hari=?, fasilitas=?, status=? WHERE id=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->kode_kamar);
        $stmt->bindParam(2, $data->nama_kamar);
        $stmt->bindParam(3, $data->kelas);
        $stmt->bindParam(4, $data->kapasitas);
        $stmt->bindParam(5, $data->terisi);
        $stmt->bindParam(6, $data->harga_per_hari);
        $stmt->bindParam(7, $data->fasilitas);
        $stmt->bindParam(8, $data->status);
        $stmt->bindParam(9, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Kamar berhasil diupdate."));
        } else {
            echo json_encode(array("message" => "Gagal mengupdate kamar."));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "DELETE FROM kamar WHERE id=?";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Kamar berhasil dihapus."));
        } else {
            echo json_encode(array("message" => "Gagal menghapus kamar."));
        }
        break;
}
?>