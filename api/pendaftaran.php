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
            $query = "SELECT pd.*, p.nama_pasien, p.no_rekam_medis, poli.nama_poli, d.nama_dokter 
                     FROM pendaftaran pd 
                     LEFT JOIN pasien p ON pd.pasien_id = p.id 
                     LEFT JOIN poliklinik poli ON pd.poli_id = poli.id 
                     LEFT JOIN dokter d ON pd.dokter_id = d.id 
                     WHERE pd.id = ?";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $id);
        } else if(isset($_GET['tanggal'])) {
            $tanggal = $_GET['tanggal'];
            $query = "SELECT pd.*, p.nama_pasien, p.no_rekam_medis, poli.nama_poli, d.nama_dokter 
                     FROM pendaftaran pd 
                     LEFT JOIN pasien p ON pd.pasien_id = p.id 
                     LEFT JOIN poliklinik poli ON pd.poli_id = poli.id 
                     LEFT JOIN dokter d ON pd.dokter_id = d.id 
                     WHERE pd.tanggal_registrasi = ? 
                     ORDER BY pd.jam_registrasi DESC";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $tanggal);
        } else {
            $query = "SELECT pd.*, p.nama_pasien, p.no_rekam_medis, poli.nama_poli, d.nama_dokter 
                     FROM pendaftaran pd 
                     LEFT JOIN pasien p ON pd.pasien_id = p.id 
                     LEFT JOIN poliklinik poli ON pd.poli_id = poli.id 
                     LEFT JOIN dokter d ON pd.dokter_id = d.id 
                     ORDER BY pd.tanggal_registrasi DESC, pd.jam_registrasi DESC 
                     LIMIT 100";
            $stmt = $db->prepare($query);
        }
        
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        // Generate registration number
        $no_registrasi = 'REG' . date('Ymd') . sprintf('%04d', rand(1, 9999));
        
        $query = "INSERT INTO pendaftaran SET no_registrasi=?, pasien_id=?, poli_id=?, dokter_id=?, 
                 tanggal_registrasi=?, jam_registrasi=?, keluhan=?, status=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $no_registrasi);
        $stmt->bindParam(2, $data->pasien_id);
        $stmt->bindParam(3, $data->poli_id);
        $stmt->bindParam(4, $data->dokter_id);
        $stmt->bindParam(5, $data->tanggal_registrasi);
        $stmt->bindParam(6, $data->jam_registrasi);
        $stmt->bindParam(7, $data->keluhan);
        $stmt->bindParam(8, $data->status);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Pendaftaran berhasil dibuat.", "no_registrasi" => $no_registrasi));
        } else {
            echo json_encode(array("message" => "Gagal membuat pendaftaran."));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE pendaftaran SET pasien_id=?, poli_id=?, dokter_id=?, tanggal_registrasi=?, 
                 jam_registrasi=?, keluhan=?, status=? WHERE id=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->pasien_id);
        $stmt->bindParam(2, $data->poli_id);
        $stmt->bindParam(3, $data->dokter_id);
        $stmt->bindParam(4, $data->tanggal_registrasi);
        $stmt->bindParam(5, $data->jam_registrasi);
        $stmt->bindParam(6, $data->keluhan);
        $stmt->bindParam(7, $data->status);
        $stmt->bindParam(8, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Pendaftaran berhasil diupdate."));
        } else {
            echo json_encode(array("message" => "Gagal mengupdate pendaftaran."));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "DELETE FROM pendaftaran WHERE id=?";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Pendaftaran berhasil dihapus."));
        } else {
            echo json_encode(array("message" => "Gagal menghapus pendaftaran."));
        }
        break;
}
?>