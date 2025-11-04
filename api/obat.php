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
            $query = "SELECT * FROM obat WHERE id = ?";
            $stmt = $db->prepare($query);
            $stmt->bindParam(1, $id);
        } else if(isset($_GET['stok_rendah'])) {
            $query = "SELECT * FROM view_stok_obat WHERE status_stok IN ('Rendah', 'Habis') ORDER BY stok ASC";
            $stmt = $db->prepare($query);
        } else {
            $query = "SELECT * FROM obat ORDER BY nama_obat ASC";
            $stmt = $db->prepare($query);
        }
        
        $stmt->execute();
        $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        echo json_encode($result);
        break;

    case 'POST':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "INSERT INTO obat SET kode_obat=?, nama_obat=?, jenis_obat=?, satuan=?, stok=?, 
                 stok_minimum=?, harga_beli=?, harga_jual=?, expired_date=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->kode_obat);
        $stmt->bindParam(2, $data->nama_obat);
        $stmt->bindParam(3, $data->jenis_obat);
        $stmt->bindParam(4, $data->satuan);
        $stmt->bindParam(5, $data->stok);
        $stmt->bindParam(6, $data->stok_minimum);
        $stmt->bindParam(7, $data->harga_beli);
        $stmt->bindParam(8, $data->harga_jual);
        $stmt->bindParam(9, $data->expired_date);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Obat berhasil ditambahkan."));
        } else {
            echo json_encode(array("message" => "Gagal menambahkan obat."));
        }
        break;

    case 'PUT':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "UPDATE obat SET kode_obat=?, nama_obat=?, jenis_obat=?, satuan=?, stok=?, 
                 stok_minimum=?, harga_beli=?, harga_jual=?, expired_date=? WHERE id=?";
        $stmt = $db->prepare($query);
        
        $stmt->bindParam(1, $data->kode_obat);
        $stmt->bindParam(2, $data->nama_obat);
        $stmt->bindParam(3, $data->jenis_obat);
        $stmt->bindParam(4, $data->satuan);
        $stmt->bindParam(5, $data->stok);
        $stmt->bindParam(6, $data->stok_minimum);
        $stmt->bindParam(7, $data->harga_beli);
        $stmt->bindParam(8, $data->harga_jual);
        $stmt->bindParam(9, $data->expired_date);
        $stmt->bindParam(10, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Obat berhasil diupdate."));
        } else {
            echo json_encode(array("message" => "Gagal mengupdate obat."));
        }
        break;

    case 'DELETE':
        $data = json_decode(file_get_contents("php://input"));
        
        $query = "DELETE FROM obat WHERE id=?";
        $stmt = $db->prepare($query);
        $stmt->bindParam(1, $data->id);
        
        if($stmt->execute()) {
            echo json_encode(array("message" => "Obat berhasil dihapus."));
        } else {
            echo json_encode(array("message" => "Gagal menghapus obat."));
        }
        break;
}
?>