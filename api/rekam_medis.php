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
            $query = "SELECT rm.*, p.nama_pasien, p.no_rekam_medis, d.nama_dokter, pd.no_registrasi
                     FROM rekam_medis rm
                     LEFT JOIN pendaftaran pd ON rm.pendaftaran_id = pd.id
                     LEFT JOIN pasien p ON pd.pasien_id = p.id
                     LEFT JOIN dokter d ON rm.dokter_id = d.id
                     WHERE rm.id = ?";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $id);
        } else if(isset($_GET['pendaftaran_id'])) {
            $pendaftaran_id = $_GET['pendaftaran_id'];
            $query = "SELECT rm.*, p.nama_pasien, p.no_rekam_medis, d.nama_dokter, pd.no_registrasi
                     FROM rekam_medis rm
                     LEFT JOIN pendaftaran pd ON rm.pendaftaran_id = pd.id
                     LEFT JOIN pasien p ON pd.pasien_id = p.id
                     LEFT JOIN dokter d ON rm.dokter_id = d.id
                     WHERE rm.pendaftaran_id = ?";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $pendaftaran_id);
        } else {
            $query = "SELECT rm.*, p.nama_pasien, p.no_rekam_medis, d.nama_dokter, pd.no_registrasi
                     FROM rekam_medis rm
                     LEFT JOIN pendaftaran pd ON rm.pendaftaran_id = pd.id
                     LEFT JOIN pasien p ON pd.pasien_id = p.id
                     LEFT JOIN dokter d ON rm.dokter_id = d.id
                     ORDER BY rm.tanggal_periksa DESC
                     LIMIT 100";
            $stmt = $db->prepare($query);
        }
        
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO rekam_medis SET pendaftaran_id=?, dokter_id=?, diagnosa=?, anamnesa=?, 
                 pemeriksaan_fisik=?, tinggi_badan=?, berat_badan=?, tekanan_darah=?, suhu_badan=?, 
                 catatan_dokter=?, tanggal_periksa=NOW()";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->pendaftaran_id);
        $stmt->bindParam(2, $data->dokter_id);
        $stmt->bindParam(3, $data->diagnosa);
        $stmt->bindParam(4, $data->anamnesa);
        $stmt->bindParam(5, $data->pemeriksaan_fisik);
        $stmt->bindParam(6, $data->tinggi_badan);
        $stmt->bindParam(7, $data->berat_badan);
        $stmt->bindParam(8, $data->tekanan_darah);
        $stmt->bindParam(9, $data->suhu_badan);
        $stmt->bindParam(10, $data->catatan_dokter);
        
        if($stmt->execute()) {
            // Update status pendaftaran menjadi selesai
            $updateQuery = "UPDATE pendaftaran SET status='selesai' WHERE id=?";
            $updateStmt = $db->prepare($updateQuery);
            $updateStmt->bindParam(1, $data->pendaftaran_id);
            $updateStmt->execute();
            
            echo json_encode(array("message" => "Rekam medis berhasil dibuat."));
        } else {
            echo json_encode(array("message" => "Gagal membuat rekam medis."));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE rekam_medis SET diagnosa=?, anamnesa=?, pemeriksaan_fisik=?, tinggi_badan=?, 
                 berat_badan=?, tekanan_darah=?, suhu_badan=?, catatan_dokter=? WHERE id=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->diagnosa);
        $stmt->bindParam(2, $data->anamnesa);
        $stmt->bindParam(3, $data->pemeriksaan_fisik);
        $stmt->bindParam(4, $data->tinggi_badan);
        $stmt->bindParam(5, $data->berat_badan);
        $stmt->bindParam(6, $data->tekanan_darah);
        $stmt->bindParam(7, $data->suhu_badan);
        $stmt->bindParam(8, $data->catatan_dokter);
        $stmt->bindParam(9, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Rekam medis berhasil diupdate."));
        } else {
            echo json_encode(array("message" => "Gagal mengupdate rekam medis."));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "DELETE FROM rekam_medis WHERE id=?";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Rekam medis berhasil dihapus."));
        } else {
            echo json_encode(array("message" => "Gagal menghapus rekam medis."));
        }
        break;
}
?>