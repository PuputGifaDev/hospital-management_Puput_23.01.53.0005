<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sistem Manajemen Rumah Sakit</title>
    <link rel="stylesheet" href="css/style.css">
    <link href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css" rel="stylesheet">
</head>
<body>
    <div class="container">
        <header>
            <h1><i class="fas fa-hospital"></i> Sistem Manajemen Rumah Sakit</h1>
            <nav class="navbar">
                <button class="nav-btn active" data-target="dashboard"><i class="fas fa-tachometer-alt"></i> Dashboard</button>
                <button class="nav-btn" data-target="dokter"><i class="fas fa-user-md"></i> Dokter</button>
                <button class="nav-btn" data-target="pasien"><i class="fas fa-user-injured"></i> Pasien</button>
                <button class="nav-btn" data-target="pendaftaran"><i class="fas fa-clipboard-list"></i> Pendaftaran</button>
                <button class="nav-btn" data-target="rekam_medis"><i class="fas fa-file-medical"></i> Rekam Medis</button>
                <button class="nav-btn" data-target="obat"><i class="fas fa-pills"></i> Obat</button>
                <button class="nav-btn" data-target="kamar"><i class="fas fa-bed"></i> Kamar</button>
            </nav>
        </header>

        <main>
            <!-- Dashboard Section -->
            <section id="dashboard" class="content-section active">
                <div class="section-header">
                    <h2>Dashboard</h2>
                    <button class="btn-secondary" onclick="loadDashboard()" title="Refresh Dashboard">
                        <i class="fas fa-sync-alt"></i> Refresh
                    </button>
                </div>
                
                <div class="dashboard-cards">
                    <div class="card">
                        <div class="card-icon">
                            <i class="fas fa-user-injured"></i>
                        </div>
                        <div class="card-content">
                            <h3 id="total-pasien">0</h3>
                            <p>Total Pasien</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-icon">
                            <i class="fas fa-user-md"></i>
                        </div>
                        <div class="card-content">
                            <h3 id="total-dokter">0</h3>
                            <p>Total Dokter</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-icon">
                            <i class="fas fa-clipboard-list"></i>
                        </div>
                        <div class="card-content">
                            <h3 id="pendaftaran-hari-ini">0</h3>
                            <p>Pendaftaran Hari Ini</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-icon">
                            <i class="fas fa-bed"></i>
                        </div>
                        <div class="card-content">
                            <h3 id="rawat-inap-aktif">0</h3>
                            <p>Rawat Inap Aktif</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-icon">
                            <i class="fas fa-pills"></i>
                        </div>
                        <div class="card-content">
                            <h3 id="obat-stok-rendah">0</h3>
                            <p>Obat Stok Rendah</p>
                        </div>
                    </div>
                    <div class="card">
                        <div class="card-icon">
                            <i class="fas fa-money-bill-wave"></i>
                        </div>
                        <div class="card-content">
                            <h3 id="pendapatan-hari-ini">0</h3>
                            <p>Pendapatan Hari Ini</p>
                        </div>
                    </div>
                </div>

                <!-- Detail Pendapatan -->
                <div id="pendapatan-detail" class="pendapatan-detail" style="display: none;">
                    <h3>Detail Pendapatan Hari Ini</h3>
                    <div class="pendapatan-breakdown">
                        <div class="pendapatan-item">
                            <span class="label">Tindakan Medis:</span>
                            <span class="value" id="pendapatan-tindakan">Rp 0</span>
                        </div>
                        <div class="pendapatan-item">
                            <span class="label">Penjualan Obat:</span>
                            <span class="value" id="pendapatan-obat">Rp 0</span>
                        </div>
                        <div class="pendapatan-item">
                            <span class="label">Rawat Inap:</span>
                            <span class="value" id="pendapatan-rawat-inap">Rp 0</span>
                        </div>
                        <div class="pendapatan-item total">
                            <span class="label">Total Pendapatan:</span>
                            <span class="value" id="total-pendapatan-hari-ini">Rp 0</span>
                        </div>
                    </div>
                </div>

                <!-- Quick Actions -->
                <div class="quick-actions">
                    <h3>Quick Actions</h3>
                    <div class="action-buttons">
                        <button class="btn-primary" onclick="showPasienForm()">
                            <i class="fas fa-plus"></i> Tambah Pasien
                        </button>
                        <button class="btn-primary" onclick="showPendaftaranForm()">
                            <i class="fas fa-plus"></i> Pendaftaran Baru
                        </button>
                        <button class="btn-primary" onclick="showDokterForm()">
                            <i class="fas fa-plus"></i> Tambah Dokter
                        </button>
                        <button class="btn-primary" onclick="showObatForm()">
                            <i class="fas fa-plus"></i> Tambah Obat
                        </button>
                    </div>
                </div>

                <!-- Recent Activity -->
                <div class="recent-activity">
                    <h3>Aktivitas Terkini</h3>
                    <div class="activity-list" id="activity-list">
                        <div class="loading">
                            <i class="fas fa-spinner fa-spin"></i>
                            <p>Memuat aktivitas...</p>
                        </div>
                    </div>
                </div>
            </section>

      
            <!-- Dokter Section -->
            <section id="dokter" class="content-section">
                <div class="section-header">
                    <h2>Manajemen Dokter</h2>
                    <div class="header-actions">
                        <button class="btn-secondary" onclick="loadDokter()" title="Refresh">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn-primary" onclick="showDokterForm()">
                            <i class="fas fa-plus"></i> Tambah Dokter
                        </button>
                    </div>
                </div>
                
                <div class="table-container">
                    <table id="dokter-table">
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Nama Dokter</th>
                                <th>Spesialisasi</th>
                                <th>Poli</th>
                                <th>Telepon</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="dokter-tbody">
                            <tr>
                                <td colspan="7" class="loading">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    <p>Memuat data dokter...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Pasien Section -->
            <section id="pasien" class="content-section">
                <div class="section-header">
                    <h2>Manajemen Pasien</h2>
                    <div class="header-actions">
                        <button class="btn-secondary" onclick="loadPasien()" title="Refresh">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn-primary" onclick="showPasienForm()">
                            <i class="fas fa-plus"></i> Tambah Pasien
                        </button>
                    </div>
                </div>
                
                <div class="table-container">
                    <table id="pasien-table">
                        <thead>
                            <tr>
                                <th>No. RM</th>
                                <th>Nama Pasien</th>
                                <th>Jenis Kelamin</th>
                                <th>Tanggal Lahir</th>
                                <th>Telepon</th>
                                <th>Gol. Darah</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="pasien-tbody">
                            <tr>
                                <td colspan="7" class="loading">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    <p>Memuat data pasien...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Pendaftaran Section -->
            <section id="pendaftaran" class="content-section">
                <div class="section-header">
                    <h2>Manajemen Pendaftaran</h2>
                    <div class="header-actions">
                        <button class="btn-secondary" onclick="loadPendaftaran()" title="Refresh">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn-primary" onclick="showPendaftaranForm()">
                            <i class="fas fa-plus"></i> Tambah Pendaftaran
                        </button>
                    </div>
                </div>
                
                <div class="table-container">
                    <table id="pendaftaran-table">
                        <thead>
                            <tr>
                                <th>No. Registrasi</th>
                                <th>Pasien</th>
                                <th>Poli</th>
                                <th>Dokter</th>
                                <th>Tanggal</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="pendaftaran-tbody">
                            <tr>
                                <td colspan="7" class="loading">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    <p>Memuat data pendaftaran...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Rekam Medis Section -->
            <section id="rekam_medis" class="content-section">
                <div class="section-header">
                    <h2>Rekam Medis</h2>
                    <div class="header-actions">
                        <button class="btn-secondary" onclick="loadRekamMedis()" title="Refresh">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                    </div>
                </div>
                
                <div class="table-container">
                    <table id="rekam-medis-table">
                        <thead>
                            <tr>
                                <th>No. RM</th>
                                <th>Nama Pasien</th>
                                <th>Dokter</th>
                                <th>Diagnosa</th>
                                <th>Tanggal Periksa</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="rekam-medis-tbody">
                            <tr>
                                <td colspan="6" class="loading">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    <p>Memuat data rekam medis...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Obat Section -->
            <section id="obat" class="content-section">
                <div class="section-header">
                    <h2>Manajemen Obat</h2>
                    <div class="header-actions">
                        <button class="btn-secondary" onclick="loadObat()" title="Refresh">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn-primary" onclick="showObatForm()">
                            <i class="fas fa-plus"></i> Tambah Obat
                        </button>
                    </div>
                </div>
                
                <div class="table-container">
                    <table id="obat-table">
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Nama Obat</th>
                                <th>Jenis</th>
                                <th>Stok</th>
                                <th>Harga Jual</th>
                                <th>Expired</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="obat-tbody">
                            <tr>
                                <td colspan="8" class="loading">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    <p>Memuat data obat...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Kamar Section -->
            <section id="kamar" class="content-section">
                <div class="section-header">
                    <h2>Manajemen Kamar</h2>
                    <div class="header-actions">
                        <button class="btn-secondary" onclick="loadKamar()" title="Refresh">
                            <i class="fas fa-sync-alt"></i>
                        </button>
                        <button class="btn-primary" onclick="showKamarForm()">
                            <i class="fas fa-plus"></i> Tambah Kamar
                        </button>
                    </div>
                </div>
                
                <div class="table-container">
                    <table id="kamar-table">
                        <thead>
                            <tr>
                                <th>Kode</th>
                                <th>Nama Kamar</th>
                                <th>Kelas</th>
                                <th>Kapasitas</th>
                                <th>Terisi</th>
                                <th>Harga/Hari</th>
                                <th>Status</th>
                                <th>Aksi</th>
                            </tr>
                        </thead>
                        <tbody id="kamar-tbody">
                            <tr>
                                <td colspan="8" class="loading">
                                    <i class="fas fa-spinner fa-spin"></i>
                                    <p>Memuat data kamar...</p>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            <!-- Modal Forms -->
            <div id="modal-overlay" class="modal-overlay">
                <div class="modal" id="modal">
                    <div class="modal-header">
                        <h3 id="modal-title">Tambah Data</h3>
                        <button class="close-btn" onclick="closeModal()">&times;</button>
                    </div>
                    <div class="modal-body" id="modal-body">
                        <!-- Form akan diisi oleh JavaScript -->
                    </div>
                </div>
            </div>

            <!-- Detail Modal -->
            <div id="detail-modal-overlay" class="modal-overlay">
                <div class="modal modal-wide">
                    <div class="modal-header">
                        <h3 id="detail-modal-title">Detail Data</h3>
                        <button class="close-btn" onclick="closeDetailModal()">&times;</button>
                    </div>
                    <div class="modal-body" id="detail-modal-body">
                        <!-- Detail content akan diisi oleh JavaScript -->
                    </div>
                </div>
            </div>
        </main>
    </div>

    <script src="https://cdn.jsdelivr.net/npm/chart.js"></script>
    <script src="js/script.js"></script>
</body>
</html>