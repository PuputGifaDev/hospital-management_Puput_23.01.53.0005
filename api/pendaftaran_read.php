<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/pendaftaran.php';

$database = new Database();
$db = $database->getConnection();

$pendaftaran = new Pendaftaran($db);

$stmt = $pendaftaran->read();
$num = $stmt->rowCount();

if($num > 0){
    $pendaftaran_arr = array();
    $pendaftaran_arr["records"] = array();

    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)){
        extract($row);
        
        $pendaftaran_item = array(
            "id" => $id,
            "pasien_id" => $pasien_id,
            "nama_pasien" => $nama_pasien,
            "dokter_id" => $dokter_id,
            "nama_dokter" => $nama_dokter,
            "poli_id" => $poli_id,
            "nama_poli" => $nama_poli,
            "keluhan" => $keluhan,
            "tanggal_registrasi" => $tanggal_registrasi,
            "jenis_pembayaran" => $jenis_pembayaran,
            "no_antrian" => $no_antrian,
            "status" => $status
        );

        array_push($pendaftaran_arr["records"], $pendaftaran_item);
    }

    http_response_code(200);
    echo json_encode($pendaftaran_arr);
} else {
    http_response_code(404);
    echo json_encode(array("message" => "Tidak ada data pendaftaran."));
}
?>