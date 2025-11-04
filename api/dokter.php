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
        // Get all doctors or single doctor
        if(isset($_GET['id'])) {
            $id = $_GET['id'];
            $query = "SELECT d.*, p.nama_poli FROM dokter d LEFT JOIN poliklinik p ON d.poli_id = p.id WHERE d.id = ?";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $id);
        } else {
            $query = "SELECT d.*, p.nama_poli FROM dokter d LEFT JOIN poliklinik p ON d.poli_id = p.id ORDER BY d.id DESC";
            $stmt = $db->prepare($query);
        }
        
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($result);
        break;

    case 'POST':
        // Create new doctor
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO dokter SET kode_dokter=?, nama_dokter=?, spesialisasi=?, poli_id=?, telepon=?, email=?, alamat=?, status=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->kode_dokter);
        $stmt->bindParam(2, $data->nama_dokter);
        $stmt->bindParam(3, $data->spesialisasi);
        $stmt->bindParam(4, $data->poli_id);
        $stmt->bindParam(5, $data->telepon);
        $stmt->bindParam(6, $data->email);
        $stmt->bindParam(7, $data->alamat);
        $stmt->bindParam(8, $data->status);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Dokter berhasil dibuat."));
        } else {
            echo json_encode(array("message" => "Gagal membuat dokter."));
        }
        break;

    case 'PUT':
        // Update doctor
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE dokter SET kode_dokter=?, nama_dokter=?, spesialisasi=?, poli_id=?, telepon=?, email=?, alamat=?, status=? WHERE id=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->kode_dokter);
        $stmt->bindParam(2, $data->nama_dokter);
        $stmt->bindParam(3, $data->spesialisasi);
        $stmt->bindParam(4, $data->poli_id);
        $stmt->bindParam(5, $data->telepon);
        $stmt->bindParam(6, $data->email);
        $stmt->bindParam(7, $data->alamat);
        $stmt->bindParam(8, $data->status);
        $stmt->bindParam(9, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Dokter berhasil diupdate."));
        } else {
            echo json_encode(array("message" => "Gagal mengupdate dokter."));
        }
        break;

    case 'DELETE':
        // Delete doctor
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "DELETE FROM dokter WHERE id=?";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Dokter berhasil dihapus."));
        } else {
            echo json_encode(array("message" => "Gagal menghapus dokter."));
        }
        break;
}
?>