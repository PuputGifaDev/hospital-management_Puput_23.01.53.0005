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
    $tanggal_awal = isset($_GET['tanggal_awal']) ? $_GET['tanggal_awal'] : date('Y-m-01');
    $tanggal_akhir = isset($_GET['tanggal_akhir']) ? $_GET['tanggal_akhir'] : date('Y-m-d');
    
    // Query untuk laporan pendapatan detail
    $query = "
        SELECT 
            -- Pendapatan dari Tindakan
            COALESCE((
                SELECT SUM(tp.harga * tp.jumlah)
                FROM tindakan_pasien tp
                JOIN rekam_medis rm ON tp.rekam_medis_id = rm.id
                WHERE DATE(rm.tanggal_periksa) BETWEEN ? AND ?
            ), 0) as pendapatan_tindakan,
            
            -- Pendapatan dari Obat
            COALESCE((
                SELECT SUM(o.harga_jual * ro.jumlah)
                FROM resep_obat ro
                JOIN rekam_medis rm ON ro.rekam_medis_id = rm.id
                JOIN obat o ON ro.obat_id = o.id
                WHERE DATE(rm.tanggal_periksa) BETWEEN ? AND ?
            ), 0) as pendapatan_obat,
            
            -- Pendapatan dari Rawat Inap
            COALESCE((
                SELECT SUM(k.harga_per_hari * DATEDIFF(COALESCE(ri.tanggal_keluar, CURDATE()), ri.tanggal_masuk))
                FROM rawat_inap ri
                JOIN kamar k ON ri.kamar_id = k.id
                WHERE (ri.tanggal_masuk BETWEEN ? AND ? 
                       OR ri.tanggal_keluar BETWEEN ? AND ?
                       OR (ri.tanggal_masuk <= ? AND (ri.tanggal_keluar >= ? OR ri.tanggal_keluar IS NULL)))
            ), 0) as pendapatan_rawat_inap,
            
            -- Total Pendapatan
            (
                COALESCE((
                    SELECT SUM(tp.harga * tp.jumlah)
                    FROM tindakan_pasien tp
                    JOIN rekam_medis rm ON tp.rekam_medis_id = rm.id
                    WHERE DATE(rm.tanggal_periksa) BETWEEN ? AND ?
                ), 0) +
                COALESCE((
                    SELECT SUM(o.harga_jual * ro.jumlah)
                    FROM resep_obat ro
                    JOIN rekam_medis rm ON ro.rekam_medis_id = rm.id
                    JOIN obat o ON ro.obat_id = o.id
                    WHERE DATE(rm.tanggal_periksa) BETWEEN ? AND ?
                ), 0) +
                COALESCE((
                    SELECT SUM(k.harga_per_hari * DATEDIFF(COALESCE(ri.tanggal_keluar, CURDATE()), ri.tanggal_masuk))
                    FROM rawat_inap ri
                    JOIN kamar k ON ri.kamar_id = k.id
                    WHERE (ri.tanggal_masuk BETWEEN ? AND ? 
                           OR ri.tanggal_keluar BETWEEN ? AND ?
                           OR (ri.tanggal_masuk <= ? AND (ri.tanggal_keluar >= ? OR ri.tanggal_keluar IS NULL)))
                ), 0)
            ) as total_pendapatan
    ";
    
    $stmt = $db->prepare($query);
    
    // Bind parameters untuk semua placeholder
    for($i = 1; $i <= 16; $i++) {
        if($i <= 2 || ($i >= 5 && $i <= 6) || ($i >= 9 && $i <= 10) || ($i >= 13 && $i <= 16)) {
            $stmt->bindValue($i, $tanggal_awal);
        } else {
            $stmt->bindValue($i, $tanggal_akhir);
        }
    }
    
    $stmt->execute();
    $result = $stmt->fetch(PDO::FETCH_ASSOC);
    
    echo json_encode($result);
} else {
    http_response_code(405);
    echo json_encode(array("message" => "Method not allowed"));
}
?>