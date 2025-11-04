<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';

$database = new Database();
$db = $database->getConnection();

// Query untuk data dashboard dengan perhitungan pendapatan yang benar
$query = "
    SELECT 
        (SELECT COUNT(*) FROM pasien) as total_pasien,
        (SELECT COUNT(*) FROM dokter WHERE status = 'aktif') as total_dokter,
        (SELECT COUNT(*) FROM pendaftaran WHERE tanggal_registrasi = CURDATE()) as pendaftaran_hari_ini,
        (SELECT COUNT(*) FROM rawat_inap WHERE status = 'dirawat') as rawat_inap_aktif,
        (SELECT COUNT(*) FROM obat WHERE stok <= stok_minimum) as obat_stok_rendah,
        COALESCE((
            -- Pendapatan dari Tindakan Hari Ini
            SELECT SUM(tp.harga * tp.jumlah)
            FROM tindakan_pasien tp
            JOIN rekam_medis rm ON tp.rekam_medis_id = rm.id
            WHERE DATE(rm.tanggal_periksa) = CURDATE()
        ), 0) +
        COALESCE((
            -- Pendapatan dari Obat Hari Ini
            SELECT SUM(o.harga_jual * ro.jumlah)
            FROM resep_obat ro
            JOIN rekam_medis rm ON ro.rekam_medis_id = rm.id
            JOIN obat o ON ro.obat_id = o.id
            WHERE DATE(rm.tanggal_periksa) = CURDATE()
        ), 0) +
        COALESCE((
            -- Pendapatan dari Rawat Inap Hari Ini
            SELECT SUM(k.harga_per_hari)
            FROM rawat_inap ri
            JOIN kamar k ON ri.kamar_id = k.id
            WHERE ri.status = 'dirawat' 
            AND CURDATE() BETWEEN ri.tanggal_masuk AND COALESCE(ri.tanggal_keluar, CURDATE())
        ), 0) as pendapatan_hari_ini
";

$stmt = $db->prepare($query);
$stmt->execute();
$result = $stmt->fetch(PDO::FETCH_ASSOC);

echo json_encode($result);
?>