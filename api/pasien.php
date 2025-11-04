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
            $query = "SELECT * FROM pasien WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $id);
        } else {
            $query = "SELECT * FROM pasien ORDER BY id DESC";
            $stmt = $db->prepare($query);
        }
        
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO pasien SET no_rekam_medis=?, nama_pasien=?, jenis_kelamin=?, tanggal_lahir=?, tempat_lahir=?, alamat=?, telepon=?, email=?, golongan_darah=?, alergi=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->no_rekam_medis);
        $stmt->bindParam(2, $data->nama_pasien);
        $stmt->bindParam(3, $data->jenis_kelamin);
        $stmt->bindParam(4, $data->tanggal_lahir);
        $stmt->bindParam(5, $data->tempat_lahir);
        $stmt->bindParam(6, $data->alamat);
        $stmt->bindParam(7, $data->telepon);
        $stmt->bindParam(8, $data->email);
        $stmt->bindParam(9, $data->golongan_darah);
        $stmt->bindParam(10, $data->alergi);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Pasien berhasil dibuat."));
        } else {
            echo json_encode(array("message" => "Gagal membuat pasien."));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE pasien SET no_rekam_medis=?, nama_pasien=?, jenis_kelamin=?, tanggal_lahir=?, tempat_lahir=?, alamat=?, telepon=?, email=?, golongan_darah=?, alergi=? WHERE id=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->no_rekam_medis);
        $stmt->bindParam(2, $data->nama_pasien);
        $stmt->bindParam(3, $data->jenis_kelamin);
        $stmt->bindParam(4, $data->tanggal_lahir);
        $stmt->bindParam(5, $data->tempat_lahir);
        $stmt->bindParam(6, $data->alamat);
        $stmt->bindParam(7, $data->telepon);
        $stmt->bindParam(8, $data->email);
        $stmt->bindParam(9, $data->golongan_darah);
        $stmt->bindParam(10, $data->alergi);
        $stmt->bindParam(11, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Pasien berhasil diupdate."));
        } else {
            echo json_encode(array("message" => "Gagal mengupdate pasien."));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "DELETE FROM pasien WHERE id=?";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Pasien berhasil dihapus."));
        } else {
            echo json_encode(array("message" => "Gagal menghapus pasien."));
        }
        break;
}
?>