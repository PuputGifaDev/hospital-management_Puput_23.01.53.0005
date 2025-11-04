<?php
class Pendaftaran {
    private $conn;
    private $table_name = "pendaftaran";

    public $id;
    public $pasien_id;
    public $dokter_id;
    public $poli_id;
    public $keluhan;
    public $tanggal_registrasi;
    public $jenis_pembayaran;
    public $no_antrian;
    public $status;

    public function __construct($db){
        $this->conn = $db;
    }

    // Method untuk membuat pendaftaran baru
    public function create(){
        // Generate nomor antrian otomatis untuk hari ini
        $this->generateNoAntrian();

        // Query insert
        $query = "INSERT INTO " . $this->table_name . "
                SET pasien_id=:pasien_id, dokter_id=:dokter_id, poli_id=:poli_id, 
                    keluhan=:keluhan, tanggal_registrasi=:tanggal_registrasi, 
                    jenis_pembayaran=:jenis_pembayaran, no_antrian=:no_antrian, status=:status";

        $stmt = $this->conn->prepare($query);

        // Sanitize input
        $this->pasien_id = htmlspecialchars(strip_tags($this->pasien_id));
        $this->dokter_id = htmlspecialchars(strip_tags($this->dokter_id));
        $this->poli_id = htmlspecialchars(strip_tags($this->poli_id));
        $this->keluhan = htmlspecialchars(strip_tags($this->keluhan));
        $this->jenis_pembayaran = htmlspecialchars(strip_tags($this->jenis_pembayaran));
        $this->no_antrian = htmlspecialchars(strip_tags($this->no_antrian));

        // Bind values
        $stmt->bindParam(":pasien_id", $this->pasien_id);
        $stmt->bindParam(":dokter_id", $this->dokter_id);
        $stmt->bindParam(":poli_id", $this->poli_id);
        $stmt->bindParam(":keluhan", $this->keluhan);
        $stmt->bindParam(":tanggal_registrasi", $this->tanggal_registrasi);
        $stmt->bindParam(":jenis_pembayaran", $this->jenis_pembayaran);
        $stmt->bindParam(":no_antrian", $this->no_antrian);
        $stmt->bindParam(":status", $this->status);

        if($stmt->execute()){
            $this->id = $this->conn->lastInsertId();
            return true;
        }
        return false;
    }

    // Method untuk generate nomor antrian otomatis
    private function generateNoAntrian(){
        if(empty($this->no_antrian)){
            $query = "SELECT COUNT(*) as total 
                     FROM " . $this->table_name . " 
                     WHERE DATE(tanggal_registrasi) = CURDATE()";
            
            $stmt = $this->conn->prepare($query);
            $stmt->execute();
            $row = $stmt->fetch(PDO::FETCH_ASSOC);
            
            $total_hari_ini = $row['total'] + 1;
            $this->no_antrian = "A" . date('Ymd') . sprintf("%03d", $total_hari_ini);
        }
    }

    // Method untuk membaca semua pendaftaran
    public function read(){
        $query = "SELECT p.*, ps.nama as nama_pasien, d.nama as nama_dokter, pl.nama as nama_poli
                FROM " . $this->table_name . " p
                LEFT JOIN pasien ps ON p.pasien_id = ps.id
                LEFT JOIN dokter d ON p.dokter_id = d.id
                LEFT JOIN poliklinik pl ON p.poli_id = pl.id
                ORDER BY p.tanggal_registrasi DESC";

        $stmt = $this->conn->prepare($query);
        $stmt->execute();

        return $stmt;
    }

    // Method untuk membaca pendaftaran by ID
    public function readOne(){
        $query = "SELECT p.*, ps.nama as nama_pasien, d.nama as nama_dokter, pl.nama as nama_poli
                FROM " . $this->table_name . " p
                LEFT JOIN pasien ps ON p.pasien_id = ps.id
                LEFT JOIN dokter d ON p.dokter_id = d.id
                LEFT JOIN poliklinik pl ON p.poli_id = pl.id
                WHERE p.id = ?
                LIMIT 0,1";

        $stmt = $this->conn->prepare($query);
        $stmt->bindParam(1, $this->id);
        $stmt->execute();

        $row = $stmt->fetch(PDO::FETCH_ASSOC);

        if($row){
            $this->pasien_id = $row['pasien_id'];
            $this->dokter_id = $row['dokter_id'];
            $this->poli_id = $row['poli_id'];
            $this->keluhan = $row['keluhan'];
            $this->tanggal_registrasi = $row['tanggal_registrasi'];
            $this->jenis_pembayaran = $row['jenis_pembayaran'];
            $this->no_antrian = $row['no_antrian'];
            $this->status = $row['status'];
            return true;
        }
        return false;
    }

    // Method untuk update status pendaftaran
    public function updateStatus(){
        $query = "UPDATE " . $this->table_name . "
                SET status = :status
                WHERE id = :id";

        $stmt = $this->conn->prepare($query);

        $stmt->bindParam(':status', $this->status);
        $stmt->bindParam(':id', $this->id);

        if($stmt->execute()){
            return true;
        }
        return false;
    }
}
?>