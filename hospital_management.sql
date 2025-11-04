-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Nov 04, 2025 at 05:25 PM
-- Server version: 10.4.28-MariaDB
-- PHP Version: 8.2.4

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hospital_management`
--

-- --------------------------------------------------------

--
-- Table structure for table `dokter`
--

CREATE TABLE `dokter` (
  `id` int(11) NOT NULL,
  `kode_dokter` varchar(20) NOT NULL,
  `nama_dokter` varchar(100) NOT NULL,
  `spesialisasi` varchar(100) DEFAULT NULL,
  `poli_id` int(11) DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `status` enum('aktif','cuti','keluar') DEFAULT 'aktif',
  `foto` varchar(255) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `dokter`
--

INSERT INTO `dokter` (`id`, `kode_dokter`, `nama_dokter`, `spesialisasi`, `poli_id`, `telepon`, `email`, `alamat`, `status`, `foto`, `created_at`) VALUES
(1, 'D001', 'Dr. Ahmad Wijaya, Sp.PD', 'Penyakit Dalam', 1, '081234567001', 'ahmad.wijaya@rs.com', 'Jl. Merdeka No. 123, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(2, 'D002', 'Dr. Siti Rahayu, Sp.KG', 'Kedokteran Gigi', 2, '081234567002', 'siti.rahayu@rs.com', 'Jl. Sudirman No. 45, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(3, 'D003', 'Dr. Budi Santoso, Sp.A', 'Anak', 3, '081234567003', 'budi.santoso@rs.com', 'Jl. Thamrin No. 67, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(4, 'D004', 'Dr. Maria Ulfa, Sp.OG', 'Kandungan', 4, '081234567004', 'maria.ulfa@rs.com', 'Jl. Gatot Subroto No. 89, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(5, 'D005', 'Dr. Rizki Pratama, Sp.B', 'Bedah', 5, '081234567005', 'rizki.pratama@rs.com', 'Jl. Rasuna Said No. 12, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(6, 'D006', 'Dr. Dian Sastro, Sp.JP', 'Jantung', 6, '081234567006', 'dian.sastro@rs.com', 'Jl. Kuningan No. 34, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(7, 'D007', 'Dr. Fajar Nugroho, Sp.S', 'Saraf', 7, '081234567007', 'fajar.nugroho@rs.com', 'Jl. Senayan No. 56, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(8, 'D008', 'Dr. Lina Marlina, Sp.KK', 'Kulit dan Kelamin', 8, '081234567008', 'lina.marlina@rs.com', 'Jl. Kebon Sirih No. 78, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(9, 'D009', 'Dr. Andi Permana, Sp.M', 'Mata', 9, '081234567009', 'andi.permana@rs.com', 'Jl. Menteng No. 90, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(10, 'D010', 'Dr. Rina Melati, Sp.THT', 'THT', 10, '081234567010', 'rina.melati@rs.com', 'Jl. Palmerah No. 23, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(11, 'D011', 'Dr. Joko Susilo, Sp.PD', 'Penyakit Dalam', 1, '081234567011', 'joko.susilo@rs.com', 'Jl. Asia Afrika No. 67, Jakarta', 'aktif', NULL, '2025-11-04 15:44:54'),
(12, 'D012', 'Dr. Dewi Anggraeni, Sp.A', 'Anak', 3, '081234567012', 'dewi.anggraeni@rs.com', 'Jl. Diponegoro No. 45, Jakarta', 'cuti', NULL, '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `kamar`
--

CREATE TABLE `kamar` (
  `id` int(11) NOT NULL,
  `kode_kamar` varchar(20) NOT NULL,
  `nama_kamar` varchar(100) NOT NULL,
  `kelas` enum('VIP','I','II','III') DEFAULT 'III',
  `kapasitas` int(11) DEFAULT 1,
  `terisi` int(11) DEFAULT 0,
  `harga_per_hari` decimal(15,2) DEFAULT NULL,
  `fasilitas` text DEFAULT NULL,
  `status` enum('tersedia','terisi','maintenance') DEFAULT 'tersedia',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `kamar`
--

INSERT INTO `kamar` (`id`, `kode_kamar`, `nama_kamar`, `kelas`, `kapasitas`, `terisi`, `harga_per_hari`, `fasilitas`, `status`, `created_at`) VALUES
(1, 'KMR001', 'Kamar 101', 'VIP', 1, 1, 750000.00, 'AC, TV LED, Kamar Mandi Dalam, Kulkas, Sofa', 'terisi', '2025-11-04 15:44:54'),
(2, 'KMR002', 'Kamar 102', 'VIP', 1, 0, 700000.00, 'AC, TV LED, Kamar Mandi Dalam, Kulkas', 'tersedia', '2025-11-04 15:44:54'),
(3, 'KMR003', 'Kamar 103', 'I', 2, 1, 500000.00, 'AC, TV LED, Kamar Mandi Dalam', 'terisi', '2025-11-04 15:44:54'),
(4, 'KMR004', 'Kamar 104', 'I', 2, 2, 450000.00, 'AC, TV LED, Kamar Mandi Dalam', 'terisi', '2025-11-04 15:44:54'),
(5, 'KMR005', 'Kamar 105', 'II', 3, 1, 350000.00, 'AC, Kamar Mandi Dalam', 'terisi', '2025-11-04 15:44:54'),
(6, 'KMR006', 'Kamar 106', 'II', 3, 0, 300000.00, 'AC, Kamar Mandi Dalam', 'tersedia', '2025-11-04 15:44:54'),
(7, 'KMR007', 'Kamar 107', 'III', 4, 3, 200000.00, 'Kipas Angin, Kamar Mandi Luar', 'terisi', '2025-11-04 15:44:54'),
(8, 'KMR008', 'Kamar 108', 'III', 4, 0, 180000.00, 'Kipas Angin, Kamar Mandi Luar', 'tersedia', '2025-11-04 15:44:54'),
(9, 'KMR009', 'Kamar 201', 'VIP', 1, 0, 800000.00, 'AC, TV LED, Kamar Mandi Dalam, Kulkas, Microwave', 'tersedia', '2025-11-04 15:44:54'),
(10, 'KMR010', 'Kamar 202', 'I', 2, 0, 550000.00, 'AC, TV LED, Kamar Mandi Dalam', 'tersedia', '2025-11-04 15:44:54'),
(11, 'KMR011', 'Kamar 203', 'I', 2, 1, 500000.00, 'AC, TV LED, Kamar Mandi Dalam', 'terisi', '2025-11-04 15:44:54'),
(12, 'KMR012', 'Kamar 204', 'II', 3, 2, 320000.00, 'AC, Kamar Mandi Dalam', 'terisi', '2025-11-04 15:44:54'),
(13, 'KMR013', 'Kamar 205', 'II', 3, 0, 280000.00, 'AC, Kamar Mandi Dalam', 'tersedia', '2025-11-04 15:44:54'),
(14, 'KMR014', 'Kamar 206', 'III', 4, 0, 150000.00, 'Kipas Angin, Kamar Mandi Luar', 'maintenance', '2025-11-04 15:44:54'),
(15, 'KMR015', 'Kamar 207', 'III', 4, 0, 160000.00, 'Kipas Angin, Kamar Mandi Luar', 'tersedia', '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `obat`
--

CREATE TABLE `obat` (
  `id` int(11) NOT NULL,
  `kode_obat` varchar(20) NOT NULL,
  `nama_obat` varchar(200) NOT NULL,
  `jenis_obat` varchar(100) DEFAULT NULL,
  `satuan` varchar(50) DEFAULT NULL,
  `stok` int(11) DEFAULT 0,
  `stok_minimum` int(11) DEFAULT 10,
  `harga_beli` decimal(15,2) DEFAULT NULL,
  `harga_jual` decimal(15,2) DEFAULT NULL,
  `expired_date` date DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `obat`
--

INSERT INTO `obat` (`id`, `kode_obat`, `nama_obat`, `jenis_obat`, `satuan`, `stok`, `stok_minimum`, `harga_beli`, `harga_jual`, `expired_date`, `created_at`) VALUES
(1, 'OBT001', 'Paracetamol 500mg', 'Analgesik', 'tablet', 150, 20, 300.00, 500.00, '2025-12-31', '2025-11-04 15:44:54'),
(2, 'OBT002', 'Amoxicillin 500mg', 'Antibiotik', 'kapsul', 80, 15, 800.00, 1200.00, '2025-10-31', '2025-11-04 15:44:54'),
(3, 'OBT003', 'Vitamin C 500mg', 'Vitamin', 'tablet', 200, 30, 200.00, 400.00, '2026-03-31', '2025-11-04 15:44:54'),
(4, 'OBT004', 'Omeprazole 20mg', 'Antasida', 'kapsul', 90, 15, 600.00, 900.00, '2025-11-30', '2025-11-04 15:44:54'),
(5, 'OBT005', 'Cetirizine 10mg', 'Antihistamin', 'tablet', 120, 20, 300.00, 600.00, '2025-09-30', '2025-11-04 15:44:54'),
(6, 'OBT006', 'Salbutamol 2mg', 'Bronkodilator', 'tablet', 70, 10, 400.00, 700.00, '2025-08-31', '2025-11-04 15:44:54'),
(7, 'OBT007', 'Metformin 500mg', 'Antidiabetes', 'tablet', 110, 15, 350.00, 650.00, '2025-12-31', '2025-11-04 15:44:54'),
(8, 'OBT008', 'Amlodipine 5mg', 'Antihipertensi', 'tablet', 95, 15, 450.00, 800.00, '2025-10-31', '2025-11-04 15:44:54'),
(9, 'OBT009', 'Simvastatin 20mg', 'Antikolesterol', 'tablet', 85, 10, 500.00, 850.00, '2025-11-30', '2025-11-04 15:44:54'),
(10, 'OBT010', 'Loratadine 10mg', 'Antihistamin', 'tablet', 130, 20, 320.00, 550.00, '2025-07-31', '2025-11-04 15:44:54'),
(11, 'OBT011', 'Ibuprofen 400mg', 'Antiinflamasi', 'tablet', 140, 25, 280.00, 450.00, '2026-01-31', '2025-11-04 15:44:54'),
(12, 'OBT012', 'Diazepam 5mg', 'Antiansietas', 'tablet', 60, 10, 600.00, 1000.00, '2025-06-30', '2025-11-04 15:44:54'),
(13, 'OBT013', 'Metronidazole 500mg', 'Antibiotik', 'tablet', 75, 15, 550.00, 900.00, '2025-08-31', '2025-11-04 15:44:54'),
(14, 'OBT014', 'Furosemide 40mg', 'Diuretik', 'tablet', 65, 10, 380.00, 650.00, '2025-09-30', '2025-11-04 15:44:54'),
(15, 'OBT015', 'Captopril 25mg', 'Antihipertensi', 'tablet', 80, 15, 420.00, 720.00, '2025-10-31', '2025-11-04 15:44:54'),
(16, 'OBT016', 'Ranitidine 150mg', 'Antasida', 'tablet', 100, 20, 350.00, 600.00, '2025-07-31', '2025-11-04 15:44:54'),
(17, 'OBT017', 'Dexamethasone 0.5mg', 'Kortikosteroid', 'tablet', 55, 10, 480.00, 800.00, '2025-08-31', '2025-11-04 15:44:54'),
(18, 'OBT018', 'Chlorpheniramine 4mg', 'Antihistamin', 'tablet', 145, 25, 250.00, 450.00, '2025-11-30', '2025-11-04 15:44:54'),
(19, 'OBT019', 'Cefadroxil 500mg', 'Antibiotik', 'kapsul', 70, 15, 900.00, 1400.00, '2025-09-30', '2025-11-04 15:44:54'),
(20, 'OBT020', 'Aspirin 100mg', 'Antiplatelet', 'tablet', 160, 30, 180.00, 300.00, '2026-02-28', '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `pasien`
--

CREATE TABLE `pasien` (
  `id` int(11) NOT NULL,
  `no_rekam_medis` varchar(50) NOT NULL,
  `nama_pasien` varchar(100) NOT NULL,
  `jenis_kelamin` enum('L','P') NOT NULL,
  `tanggal_lahir` date NOT NULL,
  `tempat_lahir` varchar(100) DEFAULT NULL,
  `alamat` text DEFAULT NULL,
  `telepon` varchar(20) DEFAULT NULL,
  `email` varchar(100) DEFAULT NULL,
  `golongan_darah` enum('A','B','AB','O') DEFAULT NULL,
  `alergi` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pasien`
--

INSERT INTO `pasien` (`id`, `no_rekam_medis`, `nama_pasien`, `jenis_kelamin`, `tanggal_lahir`, `tempat_lahir`, `alamat`, `telepon`, `email`, `golongan_darah`, `alergi`, `created_at`) VALUES
(1, 'RM20240001', 'Bambang Sugiono', 'L', '1980-05-15', 'Jakarta', 'Jl. Merdeka No. 123, Jakarta Pusat', '081111111001', NULL, 'A', 'Debu, Udang', '2025-11-04 15:44:54'),
(2, 'RM20240002', 'Sari Dewi', 'P', '1990-08-20', 'Bandung', 'Jl. Sudirman No. 45, Jakarta Selatan', '081111111002', NULL, 'B', 'Kacang, Susu', '2025-11-04 15:44:54'),
(3, 'RM20240003', 'Rina Melati', 'P', '1975-12-10', 'Surabaya', 'Jl. Thamrin No. 67, Jakarta Pusat', '081111111003', NULL, 'O', 'Tidak ada', '2025-11-04 15:44:54'),
(4, 'RM20240004', 'Joko Widodo', 'L', '1985-03-25', 'Semarang', 'Jl. Gatot Subroto No. 89, Jakarta Selatan', '081111111004', NULL, 'AB', 'Obat penicillin', '2025-11-04 15:44:54'),
(5, 'RM20240005', 'Dewi Sartika', 'P', '1995-07-30', 'Yogyakarta', 'Jl. Asia Afrika No. 12, Jakarta Barat', '081111111005', NULL, 'A', 'Seafood', '2025-11-04 15:44:54'),
(6, 'RM20240006', 'Ahmad Fauzi', 'L', '1982-11-12', 'Medan', 'Jl. Rasuna Said No. 34, Jakarta Selatan', '081111111006', NULL, 'B', 'Tidak ada', '2025-11-04 15:44:54'),
(7, 'RM20240007', 'Maya Sari', 'P', '1992-04-18', 'Bogor', 'Jl. Kuningan No. 56, Jakarta Selatan', '081111111007', NULL, 'O', 'Debu, Bulu kucing', '2025-11-04 15:44:54'),
(8, 'RM20240008', 'Rudi Hartono', 'L', '1978-09-05', 'Surabaya', 'Jl. Senayan No. 78, Jakarta Pusat', '081111111008', NULL, 'A', 'Obat antiinflamasi', '2025-11-04 15:44:54'),
(9, 'RM20240009', 'Linda Wati', 'P', '1988-06-22', 'Jakarta', 'Jl. Kebon Sirih No. 90, Jakarta Pusat', '081111111009', NULL, 'B', 'Telur, Kacang', '2025-11-04 15:44:54'),
(10, 'RM20240010', 'Hendra Setiawan', 'L', '1991-02-14', 'Bandung', 'Jl. Menteng No. 23, Jakarta Pusat', '081111111010', NULL, 'AB', 'Tidak ada', '2025-11-04 15:44:54'),
(11, 'RM20240011', 'Siti Aminah', 'P', '1970-12-03', 'Jakarta', 'Jl. Palmerah No. 45, Jakarta Barat', '081111111011', NULL, 'A', 'Latex, Obat tertentu', '2025-11-04 15:44:54'),
(12, 'RM20240012', 'Budi Santoso', 'L', '1983-07-19', 'Surabaya', 'Jl. Diponegoro No. 67, Jakarta Pusat', '081111111012', NULL, 'O', 'Serbuk sari', '2025-11-04 15:44:54'),
(13, 'RM20240013', 'Ani Lestari', 'P', '1993-10-08', 'Bandung', 'Jl. Gajah Mada No. 89, Jakarta Barat', '081111111013', NULL, 'B', 'Tidak ada', '2025-11-04 15:44:54'),
(14, 'RM20240014', 'Eko Prasetyo', 'L', '1987-01-25', 'Yogyakarta', 'Jl. Hayam Wuruk No. 12, Jakarta Barat', '081111111014', NULL, 'A', 'Makanan pedas', '2025-11-04 15:44:54'),
(15, 'RM20240015', 'Mira Handayani', 'P', '1998-05-30', 'Jakarta', 'Jl. Fatmawati No. 34, Jakarta Selatan', '081111111015', NULL, 'O', 'Antibiotik tertentu', '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `pembayaran`
--

CREATE TABLE `pembayaran` (
  `id` int(11) NOT NULL,
  `no_pembayaran` varchar(50) NOT NULL,
  `pendaftaran_id` int(11) NOT NULL,
  `total_biaya` decimal(15,2) NOT NULL,
  `total_bayar` decimal(15,2) NOT NULL,
  `metode_bayar` enum('tunai','debit','kredit','asuransi') DEFAULT 'tunai',
  `status` enum('pending','lunas','sebagian') DEFAULT 'pending',
  `tanggal_bayar` datetime DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pembayaran`
--

INSERT INTO `pembayaran` (`id`, `no_pembayaran`, `pendaftaran_id`, `total_biaya`, `total_bayar`, `metode_bayar`, `status`, `tanggal_bayar`, `created_at`) VALUES
(1, 'BYR2024010001', 1, 185000.00, 185000.00, 'tunai', 'lunas', '2024-01-15 10:30:00', '2025-11-04 15:44:54'),
(2, 'BYR2024010002', 2, 345000.00, 345000.00, 'debit', 'lunas', '2024-01-15 11:45:00', '2025-11-04 15:44:54'),
(3, 'BYR2024010003', 3, 235000.00, 235000.00, 'tunai', 'lunas', '2024-01-16 11:20:00', '2025-11-04 15:44:54'),
(4, 'BYR2024010004', 4, 450000.00, 450000.00, 'kredit', 'lunas', '2024-01-16 15:30:00', '2025-11-04 15:44:54'),
(5, 'BYR2024010005', 5, 380000.00, 380000.00, 'tunai', 'lunas', '2024-01-17 10:15:00', '2025-11-04 15:44:54'),
(6, 'BYR2024010006', 6, 510000.00, 510000.00, 'asuransi', 'lunas', '2024-01-17 12:45:00', '2025-11-04 15:44:54'),
(7, 'BYR2024010007', 7, 280000.00, 280000.00, 'tunai', 'lunas', '2024-01-18 10:30:00', '2025-11-04 15:44:54'),
(8, 'BYR2024010008', 8, 195000.00, 195000.00, 'debit', 'lunas', '2024-01-18 14:20:00', '2025-11-04 15:44:54'),
(9, 'BYR2024010009', 9, 240000.00, 240000.00, 'tunai', 'lunas', '2024-01-19 11:45:00', '2025-11-04 15:44:54'),
(10, 'BYR2024010010', 10, 205000.00, 205000.00, 'kredit', 'lunas', '2024-01-19 16:00:00', '2025-11-04 15:44:54'),
(11, 'BYR2024010011', 11, 150000.00, 100000.00, 'tunai', 'sebagian', '2024-01-20 09:30:00', '2025-11-04 15:44:54'),
(12, 'BYR2024010012', 12, 180000.00, 0.00, 'tunai', 'pending', NULL, '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `pendaftaran`
--

CREATE TABLE `pendaftaran` (
  `id` int(11) NOT NULL,
  `no_registrasi` varchar(50) NOT NULL,
  `pasien_id` int(11) NOT NULL,
  `poli_id` int(11) NOT NULL,
  `dokter_id` int(11) DEFAULT NULL,
  `tanggal_registrasi` date NOT NULL,
  `jam_registrasi` time NOT NULL,
  `keluhan` text DEFAULT NULL,
  `status` enum('terdaftar','diproses','selesai','batal') DEFAULT 'terdaftar',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `pendaftaran`
--

INSERT INTO `pendaftaran` (`id`, `no_registrasi`, `pasien_id`, `poli_id`, `dokter_id`, `tanggal_registrasi`, `jam_registrasi`, `keluhan`, `status`, `created_at`) VALUES
(1, 'REG2024010001', 1, 1, 1, '2024-01-15', '08:00:00', 'Demam dan batuk sudah 3 hari', 'selesai', '2025-11-04 15:44:54'),
(2, 'REG2024010002', 2, 2, 2, '2024-01-15', '09:30:00', 'Sakit gigi berlubang', 'selesai', '2025-11-04 15:44:54'),
(3, 'REG2024010003', 3, 3, 3, '2024-01-16', '10:00:00', 'Anak demam tinggi dan pilek', 'selesai', '2025-11-04 15:44:54'),
(4, 'REG2024010004', 4, 4, 4, '2024-01-16', '14:00:00', 'Kontrol kehamilan trimester 2', 'selesai', '2025-11-04 15:44:54'),
(5, 'REG2024010005', 5, 5, 5, '2024-01-17', '08:30:00', 'Nyeri perut kanan bawah', 'selesai', '2025-11-04 15:44:54'),
(6, 'REG2024010006', 6, 6, 6, '2024-01-17', '11:00:00', 'Nyeri dada dan sesak napas', 'selesai', '2025-11-04 15:44:54'),
(7, 'REG2024010007', 7, 7, 7, '2024-01-18', '09:00:00', 'Sakit kepala berulang', 'selesai', '2025-11-04 15:44:54'),
(8, 'REG2024010008', 8, 8, 8, '2024-01-18', '13:30:00', 'Gatal-gatal pada kulit', 'selesai', '2025-11-04 15:44:54'),
(9, 'REG2024010009', 9, 9, 9, '2024-01-19', '10:30:00', 'Mata merah dan berair', 'selesai', '2025-11-04 15:44:54'),
(10, 'REG2024010010', 10, 10, 10, '2024-01-19', '15:00:00', 'Telinga berdenging', 'selesai', '2025-11-04 15:44:54'),
(11, 'REG2024010011', 11, 1, 11, '2024-01-20', '08:00:00', 'Pusing dan lemas', 'diproses', '2025-11-04 15:44:54'),
(12, 'REG2024010012', 12, 3, 12, '2024-01-20', '09:00:00', 'Anak diare dan muntah', 'terdaftar', '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `poliklinik`
--

CREATE TABLE `poliklinik` (
  `id` int(11) NOT NULL,
  `kode_poli` varchar(10) NOT NULL,
  `nama_poli` varchar(100) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `lokasi` varchar(100) DEFAULT NULL,
  `kapasitas` int(11) DEFAULT 0,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `poliklinik`
--

INSERT INTO `poliklinik` (`id`, `kode_poli`, `nama_poli`, `deskripsi`, `lokasi`, `kapasitas`, `created_at`) VALUES
(1, 'P001', 'Poli Umum', 'Pelayanan kesehatan umum untuk semua usia', 'Lantai 1 - Ruang 101', 50, '2025-11-04 15:44:54'),
(2, 'P002', 'Poli Gigi', 'Pelayanan kesehatan gigi dan mulut', 'Lantai 1 - Ruang 102', 30, '2025-11-04 15:44:54'),
(3, 'P003', 'Poli Anak', 'Pelayanan kesehatan khusus anak-anak', 'Lantai 2 - Ruang 201', 40, '2025-11-04 15:44:54'),
(4, 'P004', 'Poli Kandungan', 'Pelayanan kesehatan kandungan dan kebidanan', 'Lantai 2 - Ruang 202', 35, '2025-11-04 15:44:54'),
(5, 'P005', 'Poli Bedah', 'Pelayanan kesehatan bedah umum dan khusus', 'Lantai 3 - Ruang 301', 25, '2025-11-04 15:44:54'),
(6, 'P006', 'Poli Jantung', 'Pelayanan kesehatan jantung dan pembuluh darah', 'Lantai 3 - Ruang 302', 20, '2025-11-04 15:44:54'),
(7, 'P007', 'Poli Saraf', 'Pelayanan kesehatan saraf dan neurologi', 'Lantai 4 - Ruang 401', 15, '2025-11-04 15:44:54'),
(8, 'P008', 'Poli Kulit', 'Pelayanan kesehatan kulit dan kelamin', 'Lantai 4 - Ruang 402', 25, '2025-11-04 15:44:54'),
(9, 'P009', 'Poli Mata', 'Pelayanan kesehatan mata dan visi', 'Lantai 5 - Ruang 501', 30, '2025-11-04 15:44:54'),
(10, 'P010', 'Poli THT', 'Pelayanan kesehatan telinga, hidung, dan tenggorokan', 'Lantai 5 - Ruang 502', 20, '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `rawat_inap`
--

CREATE TABLE `rawat_inap` (
  `id` int(11) NOT NULL,
  `no_rawat` varchar(50) NOT NULL,
  `pendaftaran_id` int(11) NOT NULL,
  `kamar_id` int(11) DEFAULT NULL,
  `tanggal_masuk` date NOT NULL,
  `tanggal_keluar` date DEFAULT NULL,
  `diagnosa_awal` text DEFAULT NULL,
  `diagnosa_akhir` text DEFAULT NULL,
  `status` enum('dirawat','pulang','rujuk','meninggal') DEFAULT 'dirawat',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rawat_inap`
--

INSERT INTO `rawat_inap` (`id`, `no_rawat`, `pendaftaran_id`, `kamar_id`, `tanggal_masuk`, `tanggal_keluar`, `diagnosa_awal`, `diagnosa_akhir`, `status`, `created_at`) VALUES
(1, 'RI202401001', 5, 1, '2024-01-17', '2024-01-22', 'Appendisitis akut', 'Appendisitis akut post operasi', 'pulang', '2025-11-04 15:44:54'),
(2, 'RI202401002', 6, 3, '2024-01-17', NULL, 'Angina pektoris', NULL, 'dirawat', '2025-11-04 15:44:54'),
(3, 'RI202401003', 7, 5, '2024-01-18', '2024-01-20', 'Migren berat', 'Migren', 'pulang', '2025-11-04 15:44:54'),
(4, 'RI202401004', 8, 7, '2024-01-18', NULL, 'Dermatitis alergika berat', NULL, 'dirawat', '2025-11-04 15:44:54'),
(5, 'RI202401005', 9, 11, '2024-01-19', '2024-01-21', 'Konjungtivitis berat', 'Konjungtivitis', 'pulang', '2025-11-04 15:44:54'),
(6, 'RI202401006', 10, 12, '2024-01-19', NULL, 'Tinnitus', NULL, 'dirawat', '2025-11-04 15:44:54'),
(7, 'RI202401007', 11, 4, '2024-01-20', NULL, 'Anemia berat', NULL, 'dirawat', '2025-11-04 15:44:54'),
(8, 'RI202401008', 12, 7, '2024-01-20', NULL, 'Gastroenteritis dengan dehidrasi', NULL, 'dirawat', '2025-11-04 15:44:54'),
(9, 'RI202401009', 1, 3, '2024-01-15', '2024-01-17', 'Influenza dengan komplikasi', 'Influenza', 'pulang', '2025-11-04 15:44:54'),
(10, 'RI202401010', 3, 5, '2024-01-16', '2024-01-18', 'Faringitis akut dengan demam tinggi', 'Faringitis akut', 'pulang', '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `rekam_medis`
--

CREATE TABLE `rekam_medis` (
  `id` int(11) NOT NULL,
  `pendaftaran_id` int(11) NOT NULL,
  `dokter_id` int(11) NOT NULL,
  `diagnosa` text DEFAULT NULL,
  `anamnesa` text DEFAULT NULL,
  `pemeriksaan_fisik` text DEFAULT NULL,
  `tinggi_badan` int(11) DEFAULT NULL,
  `berat_badan` int(11) DEFAULT NULL,
  `tekanan_darah` varchar(20) DEFAULT NULL,
  `suhu_badan` decimal(4,2) DEFAULT NULL,
  `catatan_dokter` text DEFAULT NULL,
  `tanggal_periksa` datetime DEFAULT current_timestamp(),
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rekam_medis`
--

INSERT INTO `rekam_medis` (`id`, `pendaftaran_id`, `dokter_id`, `diagnosa`, `anamnesa`, `pemeriksaan_fisik`, `tinggi_badan`, `berat_badan`, `tekanan_darah`, `suhu_badan`, `catatan_dokter`, `tanggal_periksa`, `created_at`) VALUES
(1, 1, 1, 'Influenza', 'Demam, batuk, pilek sejak 3 hari lalu', 'Faring hiperemis, tonsil T1-T1', 170, 65, '120/80', 38.20, 'Istirahat yang cukup, perbanyak minum air putih', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(2, 2, 2, 'Karies dentis', 'Nyeri gigi geraham kiri bawah', 'Karies profunda pada gigi 36', 165, 55, '110/70', 36.80, 'Direkomendasikan perawatan saluran akar', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(3, 3, 3, 'Faringitis akut', 'Demam, batuk, anak rewel', 'Faring merah, tonsil T1-T1', 95, 15, '100/65', 38.50, 'Anak perlu istirahat dan monitor suhu', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(4, 4, 4, 'Kehamilan normal trimester 2', 'Kehamilan 24 minggu, keluhan morning sickness', 'TFU 24 cm, DJJ +, edema -', 160, 58, '115/75', 36.70, 'Kontrol ulang 4 minggu lagi', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(5, 5, 5, 'Appendisitis akut', 'Nyeri perut kanan bawah sejak 2 hari', 'Nyeri tekan dan defans muskuler kuadran kanan bawah', 175, 70, '130/85', 38.00, 'Dirujuk untuk tindakan operasi', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(6, 6, 6, 'Angina pektoris', 'Nyeri dada seperti ditekan, sesak napas', 'Bunyi jantung reguler, murmur -', 168, 68, '140/90', 36.90, 'Perlu pemeriksaan EKG dan treadmill', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(7, 7, 7, 'Migren', 'Sakit kepala berdenyut sebelah kanan', 'Neurologis dalam batas normal', 162, 52, '125/80', 36.80, 'Hindari pencetus seperti stres dan kurang tidur', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(8, 8, 8, 'Dermatitis alergika', 'Gatal-gatal dan kemerahan pada lengan dan dada', 'Eritema dan papula multiple pada daerah tersebut', 158, 50, '118/78', 36.60, 'Hindari alergen yang dicurigai', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(9, 9, 9, 'Konjungtivitis', 'Mata merah, berair, gatal', 'Konjungtiva injeksi +, sekret mukoid +', 172, 66, '122/82', 36.70, 'Kompres hangat dan hindari menggosok mata', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(10, 10, 10, 'Tinnitus', 'Telinga berdenging terus menerus', 'TM utuh, liang telinga bersih', 180, 75, '135/85', 36.80, 'Perlu pemeriksaan audiometri', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(11, 11, 11, 'Anemia', 'Lemah, lesu, pusing', 'Konjungtiva anemis +', 155, 48, '100/60', 36.50, 'Perlu pemeriksaan darah lengkap', '2025-11-04 22:44:54', '2025-11-04 15:44:54'),
(12, 12, 12, 'Gastroenteritis', 'Diare dan muntah sejak 1 hari', 'Abdomen lunak, bising usus meningkat', 100, 18, '95/60', 37.80, 'Rehidrasi oral dan diet BRAT', '2025-11-04 22:44:54', '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `resep_obat`
--

CREATE TABLE `resep_obat` (
  `id` int(11) NOT NULL,
  `rekam_medis_id` int(11) NOT NULL,
  `obat_id` int(11) NOT NULL,
  `jumlah` int(11) NOT NULL,
  `aturan_pakai` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `resep_obat`
--

INSERT INTO `resep_obat` (`id`, `rekam_medis_id`, `obat_id`, `jumlah`, `aturan_pakai`, `created_at`) VALUES
(1, 1, 1, 10, '1 tablet 3x sehari setelah makan', '2025-11-04 15:44:54'),
(2, 1, 3, 10, '1 tablet 1x sehari', '2025-11-04 15:44:54'),
(3, 1, 5, 10, '1 tablet 1x sehari malam', '2025-11-04 15:44:54'),
(4, 2, 2, 14, '1 kapsul 2x sehari selama 7 hari', '2025-11-04 15:44:54'),
(5, 2, 1, 10, '1 tablet jika nyeri', '2025-11-04 15:44:54'),
(6, 3, 1, 6, '1/2 tablet 3x sehari', '2025-11-04 15:44:54'),
(7, 3, 2, 10, '1/2 kapsul 2x sehari', '2025-11-04 15:44:54'),
(8, 4, 3, 30, '1 tablet 1x sehari', '2025-11-04 15:44:54'),
(9, 5, 2, 21, '1 kapsul 3x sehari', '2025-11-04 15:44:54'),
(10, 5, 11, 10, '1 tablet 3x sehari', '2025-11-04 15:44:54'),
(11, 6, 8, 30, '1 tablet 1x sehari pagi', '2025-11-04 15:44:54'),
(12, 6, 9, 30, '1 tablet 1x sehari malam', '2025-11-04 15:44:54'),
(13, 7, 1, 10, '1 tablet jika sakit kepala', '2025-11-04 15:44:54'),
(14, 7, 12, 10, '1/2 tablet jika cemas', '2025-11-04 15:44:54'),
(15, 8, 5, 10, '1 tablet 1x sehari', '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `tindakan`
--

CREATE TABLE `tindakan` (
  `id` int(11) NOT NULL,
  `kode_tindakan` varchar(20) NOT NULL,
  `nama_tindakan` varchar(200) NOT NULL,
  `deskripsi` text DEFAULT NULL,
  `poli_id` int(11) DEFAULT NULL,
  `harga` decimal(15,2) NOT NULL,
  `durasi` int(11) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tindakan`
--

INSERT INTO `tindakan` (`id`, `kode_tindakan`, `nama_tindakan`, `deskripsi`, `poli_id`, `harga`, `durasi`, `created_at`) VALUES
(1, 'T001', 'Konsultasi Umum', 'Konsultasi dokter umum', 1, 50000.00, 15, '2025-11-04 15:44:54'),
(2, 'T002', 'Konsultasi Spesialis', 'Konsultasi dokter spesialis', 1, 100000.00, 30, '2025-11-04 15:44:54'),
(3, 'T003', 'Pemeriksaan Gigi', 'Pemeriksaan kesehatan gigi menyeluruh', 2, 75000.00, 30, '2025-11-04 15:44:54'),
(4, 'T004', 'Tambal Gigi', 'Penambalan gigi berlubang', 2, 150000.00, 45, '2025-11-04 15:44:54'),
(5, 'T005', 'Scalling Gigi', 'Pembersihan karang gigi', 2, 200000.00, 60, '2025-11-04 15:44:54'),
(6, 'T006', 'Pemeriksaan Anak', 'Pemeriksaan kesehatan anak lengkap', 3, 80000.00, 20, '2025-11-04 15:44:54'),
(7, 'T007', 'Imunisasi Dasar', 'Imunisasi dasar untuk anak', 3, 120000.00, 15, '2025-11-04 15:44:54'),
(8, 'T008', 'USG Kandungan', 'Pemeriksaan USG kandungan', 4, 250000.00, 30, '2025-11-04 15:44:54'),
(9, 'T009', 'Kontrol Kehamilan', 'Pemeriksaan rutin kehamilan', 4, 100000.00, 20, '2025-11-04 15:44:54'),
(10, 'T010', 'Konsultasi Jantung', 'Konsultasi spesialis jantung', 6, 150000.00, 30, '2025-11-04 15:44:54'),
(11, 'T011', 'EKG', 'Pemeriksaan elektrokardiogram', 6, 180000.00, 20, '2025-11-04 15:44:54'),
(12, 'T012', 'Pemeriksaan Mata', 'Pemeriksaan mata lengkap', 9, 90000.00, 25, '2025-11-04 15:44:54'),
(13, 'T013', 'Tes Buta Warna', 'Pemeriksaan buta warna', 9, 50000.00, 15, '2025-11-04 15:44:54'),
(14, 'T014', 'Pemeriksaan THT', 'Pemeriksaan telinga, hidung, tenggorokan', 10, 85000.00, 20, '2025-11-04 15:44:54'),
(15, 'T015', 'Tes Pendengaran', 'Pemeriksaan fungsi pendengaran', 10, 120000.00, 30, '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Table structure for table `tindakan_pasien`
--

CREATE TABLE `tindakan_pasien` (
  `id` int(11) NOT NULL,
  `rekam_medis_id` int(11) NOT NULL,
  `tindakan_id` int(11) NOT NULL,
  `jumlah` int(11) DEFAULT 1,
  `harga` decimal(15,2) DEFAULT NULL,
  `keterangan` text DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `tindakan_pasien`
--

INSERT INTO `tindakan_pasien` (`id`, `rekam_medis_id`, `tindakan_id`, `jumlah`, `harga`, `keterangan`, `created_at`) VALUES
(1, 1, 1, 1, 50000.00, 'Konsultasi umum', '2025-11-04 15:44:54'),
(2, 2, 3, 1, 75000.00, 'Pemeriksaan gigi', '2025-11-04 15:44:54'),
(3, 2, 4, 1, 150000.00, 'Tambal gigi', '2025-11-04 15:44:54'),
(4, 3, 6, 1, 80000.00, 'Pemeriksaan anak', '2025-11-04 15:44:54'),
(5, 4, 8, 1, 250000.00, 'USG kandungan', '2025-11-04 15:44:54'),
(6, 4, 9, 1, 100000.00, 'Kontrol kehamilan', '2025-11-04 15:44:54'),
(7, 5, 2, 1, 100000.00, 'Konsultasi spesialis bedah', '2025-11-04 15:44:54'),
(8, 6, 10, 1, 150000.00, 'Konsultasi jantung', '2025-11-04 15:44:54'),
(9, 6, 11, 1, 180000.00, 'Pemeriksaan EKG', '2025-11-04 15:44:54'),
(10, 7, 2, 1, 100000.00, 'Konsultasi spesialis saraf', '2025-11-04 15:44:54'),
(11, 9, 12, 1, 90000.00, 'Pemeriksaan mata', '2025-11-04 15:44:54'),
(12, 10, 14, 1, 85000.00, 'Pemeriksaan THT', '2025-11-04 15:44:54');

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_dashboard`
-- (See below for the actual view)
--
CREATE TABLE `view_dashboard` (
`total_pasien` bigint(21)
,`total_dokter` bigint(21)
,`pendaftaran_hari_ini` bigint(21)
,`rawat_inap_aktif` bigint(21)
,`obat_stok_rendah` bigint(21)
,`pendapatan_hari_ini` decimal(37,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_laporan_harian`
-- (See below for the actual view)
--
CREATE TABLE `view_laporan_harian` (
`nama_poli` varchar(100)
,`jumlah_pasien` bigint(21)
,`total_pendapatan` decimal(37,2)
);

-- --------------------------------------------------------

--
-- Stand-in structure for view `view_stok_obat`
-- (See below for the actual view)
--
CREATE TABLE `view_stok_obat` (
`kode_obat` varchar(20)
,`nama_obat` varchar(200)
,`jenis_obat` varchar(100)
,`satuan` varchar(50)
,`stok` int(11)
,`stok_minimum` int(11)
,`harga_jual` decimal(15,2)
,`expired_date` date
,`status_stok` varchar(6)
);

-- --------------------------------------------------------

--
-- Structure for view `view_dashboard`
--
DROP TABLE IF EXISTS `view_dashboard`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_dashboard`  AS SELECT (select count(0) from `pasien`) AS `total_pasien`, (select count(0) from `dokter` where `dokter`.`status` = 'aktif') AS `total_dokter`, (select count(0) from `pendaftaran` where cast(`pendaftaran`.`tanggal_registrasi` as date) = curdate()) AS `pendaftaran_hari_ini`, (select count(0) from `rawat_inap` where `rawat_inap`.`status` = 'dirawat') AS `rawat_inap_aktif`, (select count(0) from `obat` where `obat`.`stok` <= `obat`.`stok_minimum`) AS `obat_stok_rendah`, (select coalesce(sum(`pembayaran`.`total_bayar`),0) from `pembayaran` where cast(`pembayaran`.`tanggal_bayar` as date) = curdate()) AS `pendapatan_hari_ini` ;

-- --------------------------------------------------------

--
-- Structure for view `view_laporan_harian`
--
DROP TABLE IF EXISTS `view_laporan_harian`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_laporan_harian`  AS SELECT `p`.`nama_poli` AS `nama_poli`, count(`pd`.`id`) AS `jumlah_pasien`, coalesce(sum(`pb`.`total_bayar`),0) AS `total_pendapatan` FROM ((`pendaftaran` `pd` join `poliklinik` `p` on(`pd`.`poli_id` = `p`.`id`)) left join `pembayaran` `pb` on(`pd`.`id` = `pb`.`pendaftaran_id`)) WHERE cast(`pd`.`tanggal_registrasi` as date) = curdate() GROUP BY `p`.`id`, `p`.`nama_poli` ;

-- --------------------------------------------------------

--
-- Structure for view `view_stok_obat`
--
DROP TABLE IF EXISTS `view_stok_obat`;

CREATE ALGORITHM=UNDEFINED DEFINER=`root`@`localhost` SQL SECURITY DEFINER VIEW `view_stok_obat`  AS SELECT `obat`.`kode_obat` AS `kode_obat`, `obat`.`nama_obat` AS `nama_obat`, `obat`.`jenis_obat` AS `jenis_obat`, `obat`.`satuan` AS `satuan`, `obat`.`stok` AS `stok`, `obat`.`stok_minimum` AS `stok_minimum`, `obat`.`harga_jual` AS `harga_jual`, `obat`.`expired_date` AS `expired_date`, CASE WHEN `obat`.`stok` = 0 THEN 'Habis' WHEN `obat`.`stok` <= `obat`.`stok_minimum` THEN 'Rendah' ELSE 'Aman' END AS `status_stok` FROM `obat` ORDER BY `obat`.`stok` ASC, `obat`.`expired_date` ASC ;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `dokter`
--
ALTER TABLE `dokter`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_dokter` (`kode_dokter`),
  ADD KEY `poli_id` (`poli_id`);

--
-- Indexes for table `kamar`
--
ALTER TABLE `kamar`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_kamar` (`kode_kamar`);

--
-- Indexes for table `obat`
--
ALTER TABLE `obat`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_obat` (`kode_obat`);

--
-- Indexes for table `pasien`
--
ALTER TABLE `pasien`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `no_rekam_medis` (`no_rekam_medis`);

--
-- Indexes for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `no_pembayaran` (`no_pembayaran`),
  ADD KEY `pendaftaran_id` (`pendaftaran_id`);

--
-- Indexes for table `pendaftaran`
--
ALTER TABLE `pendaftaran`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `no_registrasi` (`no_registrasi`),
  ADD KEY `pasien_id` (`pasien_id`),
  ADD KEY `poli_id` (`poli_id`),
  ADD KEY `dokter_id` (`dokter_id`);

--
-- Indexes for table `poliklinik`
--
ALTER TABLE `poliklinik`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_poli` (`kode_poli`);

--
-- Indexes for table `rawat_inap`
--
ALTER TABLE `rawat_inap`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `no_rawat` (`no_rawat`),
  ADD KEY `pendaftaran_id` (`pendaftaran_id`),
  ADD KEY `kamar_id` (`kamar_id`);

--
-- Indexes for table `rekam_medis`
--
ALTER TABLE `rekam_medis`
  ADD PRIMARY KEY (`id`),
  ADD KEY `pendaftaran_id` (`pendaftaran_id`),
  ADD KEY `dokter_id` (`dokter_id`);

--
-- Indexes for table `resep_obat`
--
ALTER TABLE `resep_obat`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rekam_medis_id` (`rekam_medis_id`),
  ADD KEY `obat_id` (`obat_id`);

--
-- Indexes for table `tindakan`
--
ALTER TABLE `tindakan`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `kode_tindakan` (`kode_tindakan`),
  ADD KEY `poli_id` (`poli_id`);

--
-- Indexes for table `tindakan_pasien`
--
ALTER TABLE `tindakan_pasien`
  ADD PRIMARY KEY (`id`),
  ADD KEY `rekam_medis_id` (`rekam_medis_id`),
  ADD KEY `tindakan_id` (`tindakan_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `dokter`
--
ALTER TABLE `dokter`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `kamar`
--
ALTER TABLE `kamar`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `obat`
--
ALTER TABLE `obat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=21;

--
-- AUTO_INCREMENT for table `pasien`
--
ALTER TABLE `pasien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `pembayaran`
--
ALTER TABLE `pembayaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `pendaftaran`
--
ALTER TABLE `pendaftaran`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `poliklinik`
--
ALTER TABLE `poliklinik`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `rawat_inap`
--
ALTER TABLE `rawat_inap`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=11;

--
-- AUTO_INCREMENT for table `rekam_medis`
--
ALTER TABLE `rekam_medis`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- AUTO_INCREMENT for table `resep_obat`
--
ALTER TABLE `resep_obat`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tindakan`
--
ALTER TABLE `tindakan`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=16;

--
-- AUTO_INCREMENT for table `tindakan_pasien`
--
ALTER TABLE `tindakan_pasien`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=13;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `dokter`
--
ALTER TABLE `dokter`
  ADD CONSTRAINT `dokter_ibfk_1` FOREIGN KEY (`poli_id`) REFERENCES `poliklinik` (`id`);

--
-- Constraints for table `pembayaran`
--
ALTER TABLE `pembayaran`
  ADD CONSTRAINT `pembayaran_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`);

--
-- Constraints for table `pendaftaran`
--
ALTER TABLE `pendaftaran`
  ADD CONSTRAINT `pendaftaran_ibfk_1` FOREIGN KEY (`pasien_id`) REFERENCES `pasien` (`id`),
  ADD CONSTRAINT `pendaftaran_ibfk_2` FOREIGN KEY (`poli_id`) REFERENCES `poliklinik` (`id`),
  ADD CONSTRAINT `pendaftaran_ibfk_3` FOREIGN KEY (`dokter_id`) REFERENCES `dokter` (`id`);

--
-- Constraints for table `rawat_inap`
--
ALTER TABLE `rawat_inap`
  ADD CONSTRAINT `rawat_inap_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`),
  ADD CONSTRAINT `rawat_inap_ibfk_2` FOREIGN KEY (`kamar_id`) REFERENCES `kamar` (`id`);

--
-- Constraints for table `rekam_medis`
--
ALTER TABLE `rekam_medis`
  ADD CONSTRAINT `rekam_medis_ibfk_1` FOREIGN KEY (`pendaftaran_id`) REFERENCES `pendaftaran` (`id`),
  ADD CONSTRAINT `rekam_medis_ibfk_2` FOREIGN KEY (`dokter_id`) REFERENCES `dokter` (`id`);

--
-- Constraints for table `resep_obat`
--
ALTER TABLE `resep_obat`
  ADD CONSTRAINT `resep_obat_ibfk_1` FOREIGN KEY (`rekam_medis_id`) REFERENCES `rekam_medis` (`id`),
  ADD CONSTRAINT `resep_obat_ibfk_2` FOREIGN KEY (`obat_id`) REFERENCES `obat` (`id`);

--
-- Constraints for table `tindakan`
--
ALTER TABLE `tindakan`
  ADD CONSTRAINT `tindakan_ibfk_1` FOREIGN KEY (`poli_id`) REFERENCES `poliklinik` (`id`);

--
-- Constraints for table `tindakan_pasien`
--
ALTER TABLE `tindakan_pasien`
  ADD CONSTRAINT `tindakan_pasien_ibfk_1` FOREIGN KEY (`rekam_medis_id`) REFERENCES `rekam_medis` (`id`),
  ADD CONSTRAINT `tindakan_pasien_ibfk_2` FOREIGN KEY (`tindakan_id`) REFERENCES `tindakan` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
