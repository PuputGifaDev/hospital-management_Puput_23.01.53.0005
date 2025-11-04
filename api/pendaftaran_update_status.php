<?php
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: PUT");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

include_once '../config/database.php';
include_once '../objects/pendaftaran.php';

$database = new Database();
$db = $database->getConnection();

$pendaftaran = new Pendaftaran($db);

$data = json_decode(file_get_contents("php://input"));

if(!empty($data->id) && !empty($data->status)){
    $pendaftaran->id = $data->id;
    $pendaftaran->status = $data->status;

    if($pendaftaran->updateStatus()){
        http_response_code(200);
        echo json_encode(array("message" => "Status pendaftaran berhasil diupdate."));
    } else {
        http_response_code(503);
        echo json_encode(array("message" => "Tidak dapat mengupdate status pendaftaran."));
    }
} else {
    http_response_code(400);
    echo json_encode(array("message" => "Data tidak lengkap. ID dan status harus diisi."));
}
?>