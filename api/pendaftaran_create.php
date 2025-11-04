<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/pendaftaran.php';

$database = new Database();
$db = $database->getConnection();

$pendaftaran = new Pendaftaran($db);

$data = json_decode(file_get_contents("php://input"));

// Validasi data input
if(
    !empty($data->pasien_id) &&
    !empty($data->dokter_id) &&
    !empty($data->poli_id) &&
    !empty($data->keluhan)
){
    // Set property pendaftaran
    $pendaftaran->pasien_id = $data->pasien_id;
    $pendaftaran->dokter_id = $data->dokter_id;
    $pendaftaran->poli_id = $data->poli_id;
    $pendaftaran->keluhan = $data->keluhan;
    $pendaftaran->tanggal_registrasi = date('Y-m-d H:i:s');
    $pendaftaran->status = 'terdaftar'; // status default
    
    // Optional fields
    if(!empty($data->jenis_pembayaran)) {
        $pendaftaran->jenis_pembayaran = $data->jenis_pembayaran;
    } else {
        $pendaftaran->jenis_pembayaran = 'umum';
    }

    // Create pendaftaran
    if($pendaftaran->create()){
        http_response_code(201);
        echo json_encode(array(
            "message" => "Pendaftaran berhasil dibuat.",
            "id" => $pendaftaran->id,
            "no_antrian" => $pendaftaran->no_antrian,
            "tanggal_registrasi" => $pendaftaran->tanggal_registrasi
        ));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Tidak dapat membuat pendaftaran."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Data tidak lengkap. Pastikan pasien_id, dokter_id, poli_id, dan keluhan diisi."));
}
?>