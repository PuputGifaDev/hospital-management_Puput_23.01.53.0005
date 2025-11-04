// Global variables
let currentEditingId = null;
let currentData = null;
let dropdownData = {
    pasien: [],
    poli: [],
    dokter: []
};
let pendapatanChart = null;

// Initialize application
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    loadDashboard();
    loadDokter();
    loadPasien();
    loadPendaftaran();
    loadRekamMedis();
    loadObat();
    loadKamar();
    loadDropdownData();
    
    // Setup event listeners untuk laporan
    document.getElementById('filter-form').addEventListener('submit', function(e) {
        e.preventDefault();
        loadLaporanData();
    });
});

// Navigation
function initializeNavigation() {
    const navButtons = document.querySelectorAll('.nav-btn');
    navButtons.forEach(button => {
        button.addEventListener('click', function() {
            const target = this.getAttribute('data-target');
            
            // Update active button
            navButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            
            // Show target section
            document.querySelectorAll('.content-section').forEach(section => {
                section.classList.remove('active');
            });
            document.getElementById(target).classList.add('active');
            
            // Load data khusus untuk laporan
            if (target === 'laporan') {
                loadLaporanData();
            }
        });
    });
}

// Load dropdown data
async function loadDropdownData() {
    try {
        // Load pasien
        const pasienResponse = await fetch('api/pasien.php');
        dropdownData.pasien = await pasienResponse.json();
        
        // Load poli
        const poliResponse = await fetch('api/poliklinik.php');
        dropdownData.poli = await poliResponse.json();
        
        // Load dokter
        const dokterResponse = await fetch('api/dokter.php');
        dropdownData.dokter = await dokterResponse.json();
    } catch (error) {
        console.error('Error loading dropdown data:', error);
    }
}

// ===============================
// DASHBOARD & PENDAPATAN FUNCTIONS
// ===============================
async function loadDashboard() {
    try {
        showLoading('dashboard');
        const response = await fetch('api/dashboard.php');
        const data = await response.json();
        
        document.getElementById('total-pasien').textContent = data.total_pasien || 0;
        document.getElementById('total-dokter').textContent = data.total_dokter || 0;
        document.getElementById('pendaftaran-hari-ini').textContent = data.pendaftaran_hari_ini || 0;
        document.getElementById('rawat-inap-aktif').textContent = data.rawat_inap_aktif || 0;
        document.getElementById('obat-stok-rendah').textContent = data.obat_stok_rendah || 0;
        document.getElementById('pendapatan-hari-ini').textContent = formatCurrency(data.pendapatan_hari_ini || 0);
        
        // Load detail pendapatan
        await loadDetailPendapatanHariIni();
        
        // Load aktivitas terkini
        await loadRecentActivity();
        
    } catch (error) {
        console.error('Error loading dashboard:', error);
        showError('dashboard', 'Gagal memuat data dashboard');
    }
}

async function loadDetailPendapatanHariIni() {
    try {
        const today = getToday();
        const response = await fetch(`api/laporan_pendapatan.php?tanggal_awal=${today}&tanggal_akhir=${today}`);
        const data = await response.json();
        
        // Tampilkan detail pendapatan
        document.getElementById('pendapatan-tindakan').textContent = formatCurrency(data.pendapatan_tindakan);
        document.getElementById('pendapatan-obat').textContent = formatCurrency(data.pendapatan_obat);
        document.getElementById('pendapatan-rawat-inap').textContent = formatCurrency(data.pendapatan_rawat_inap);
        document.getElementById('total-pendapatan-hari-ini').textContent = formatCurrency(data.total_pendapatan);
        
        // Tampilkan section detail pendapatan
        document.getElementById('pendapatan-detail').style.display = 'block';
        
    } catch (error) {
        console.error('Error loading detail pendapatan:', error);
        document.getElementById('pendapatan-detail').style.display = 'none';
    }
}

async function loadRecentActivity() {
    try {
        const activityList = document.getElementById('activity-list');
        
        // Simulasi data aktivitas (dalam implementasi nyata, ini akan mengambil dari API)
        const activities = [
            {
                icon: 'user-injured',
                title: 'Pasien baru terdaftar',
                time: 'Beberapa menit yang lalu',
                color: '#667eea'
            },
            {
                icon: 'file-medical',
                title: 'Rekam medis baru dibuat',
                time: '1 jam yang lalu',
                color: '#28a745'
            },
            {
                icon: 'pills',
                title: 'Stok obat diperbarui',
                time: '2 jam yang lalu',
                color: '#ffc107'
            },
            {
                icon: 'bed',
                title: 'Pasien rawat inap baru',
                time: '3 jam yang lalu',
                color: '#dc3545'
            }
        ];
        
        activityList.innerHTML = activities.map(activity => `
            <div class="activity-item">
                <div class="activity-icon" style="background: ${activity.color}">
                    <i class="fas fa-${activity.icon}"></i>
                </div>
                <div class="activity-content">
                    <div class="activity-title">${activity.title}</div>
                    <div class="activity-time">${activity.time}</div>
                </div>
            </div>
        `).join('');
        
    } catch (error) {
        console.error('Error loading recent activity:', error);
        document.getElementById('activity-list').innerHTML = '<div class="error">Gagal memuat aktivitas terkini</div>';
    }
}

// ===============================
// LAPORAN PENDAPATAN FUNCTIONS
// ===============================
async function loadLaporanData() {
    const tanggalAwal = document.getElementById('tanggal_awal').value;
    const tanggalAkhir = document.getElementById('tanggal_akhir').value;
    
    try {
        showLoadingLaporan();
        const response = await fetch(`api/laporan_pendapatan.php?tanggal_awal=${tanggalAwal}&tanggal_akhir=${tanggalAkhir}`);
        const data = await response.json();
        
        updateLaporanSummary(data);
        updateLaporanDetailTable(data);
        updatePendapatanChart(data);
        
    } catch (error) {
        console.error('Error loading laporan data:', error);
        showNotification('Gagal memuat data laporan', 'error');
    }
}

function updateLaporanSummary(data) {
    document.getElementById('laporan-total-pendapatan').textContent = formatCurrency(data.total_pendapatan);
    document.getElementById('laporan-pendapatan-tindakan').textContent = formatCurrency(data.pendapatan_tindakan);
    document.getElementById('laporan-pendapatan-obat').textContent = formatCurrency(data.pendapatan_obat);
    document.getElementById('laporan-pendapatan-rawat-inap').textContent = formatCurrency(data.pendapatan_rawat_inap);
}

function updateLaporanDetailTable(data) {
    const tbody = document.getElementById('detail-tbody');
    const total = data.total_pendapatan;
    
    tbody.innerHTML = `
        <tr>
            <td><i class="fas fa-stethoscope"></i> Tindakan Medis</td>
            <td>${formatCurrency(data.pendapatan_tindakan)}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${total > 0 ? ((data.pendapatan_tindakan / total) * 100) : 0}%">
                        ${total > 0 ? ((data.pendapatan_tindakan / total) * 100).toFixed(1) + '%' : '0%'}
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td><i class="fas fa-pills"></i> Penjualan Obat</td>
            <td>${formatCurrency(data.pendapatan_obat)}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${total > 0 ? ((data.pendapatan_obat / total) * 100) : 0}%">
                        ${total > 0 ? ((data.pendapatan_obat / total) * 100).toFixed(1) + '%' : '0%'}
                    </div>
                </div>
            </td>
        </tr>
        <tr>
            <td><i class="fas fa-bed"></i> Rawat Inap</td>
            <td>${formatCurrency(data.pendapatan_rawat_inap)}</td>
            <td>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${total > 0 ? ((data.pendapatan_rawat_inap / total) * 100) : 0}%">
                        ${total > 0 ? ((data.pendapatan_rawat_inap / total) * 100).toFixed(1) + '%' : '0%'}
                    </div>
                </div>
            </td>
        </tr>
        <tr class="total-row" style="background: #f8f9fa; font-weight: bold;">
            <td>Total Pendapatan</td>
            <td>${formatCurrency(total)}</td>
            <td>100%</td>
        </tr>
    `;
}

function updatePendapatanChart(data) {
    const ctx = document.getElementById('pendapatanChart').getContext('2d');
    
    // Destroy existing chart
    if (pendapatanChart) {
        pendapatanChart.destroy();
    }
    
    pendapatanChart = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: ['Tindakan Medis', 'Penjualan Obat', 'Rawat Inap'],
            datasets: [{
                data: [data.pendapatan_tindakan, data.pendapatan_obat, data.pendapatan_rawat_inap],
                backgroundColor: [
                    '#667eea',
                    '#28a745',
                    '#ffc107'
                ],
                borderWidth: 2,
                borderColor: '#fff'
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: {
                    position: 'bottom',
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.raw || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = total > 0 ? ((value / total) * 100).toFixed(1) + '%' : '0%';
                            return `${label}: ${formatCurrency(value)} (${percentage})`;
                        }
                    }
                }
            }
        }
    });
}

function showLoadingLaporan() {
    const tbody = document.getElementById('detail-tbody');
    tbody.innerHTML = `
        <tr>
            <td colspan="3" class="loading">
                <i class="fas fa-spinner fa-spin"></i>
                <p>Memuat data laporan...</p>
            </td>
        </tr>
    `;
}

function cetakLaporan() {
    window.print();
}

// ===============================
// UTILITY FUNCTIONS
// ===============================
function showModal() {
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    currentEditingId = null;
    currentData = null;
}

function showDetailModal() {
    document.getElementById('detail-modal-overlay').style.display = 'flex';
}

function closeDetailModal() {
    document.getElementById('detail-modal-overlay').style.display = 'none';
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function getCurrentTime() {
    return new Date().toTimeString().split(' ')[0].substring(0, 5);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('id-ID');
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(amount) {
    return 'Rp ' + parseInt(amount).toLocaleString('id-ID');
}

function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showLoading(section) {
    const tbody = document.getElementById(section.replace('_', '-') + '-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Memuat data...</p>
                </td>
            </tr>
        `;
    }
}

function showError(section, message) {
    const tbody = document.getElementById(section.replace('_', '-') + '-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${message}
                </td>
            </tr>
        `;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}

// Tambahkan CSS untuk progress bar
const progressStyle = document.createElement('style');
progressStyle.textContent = `
    .progress-bar {
        width: 100%;
        height: 20px;
        background: #e9ecef;
        border-radius: 10px;
        overflow: hidden;
        position: relative;
    }
    
    .progress-fill {
        height: 100%;
        background: #667eea;
        border-radius: 10px;
        transition: width 0.3s ease;
        display: flex;
        align-items: center;
        justify-content: center;
        color: white;
        font-size: 0.7rem;
        font-weight: bold;
    }
`;
document.head.appendChild(progressStyle);

// ===============================
// DOKTER - CRUD FUNCTIONS
// ===============================
async function loadDokter() {
    try {
        showLoading('dokter');
        const response = await fetch('api/dokter.php');
        const data = await response.json();
        
        const tbody = document.getElementById('dokter-tbody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state"><i class="fas fa-user-md"></i><p>Belum ada data dokter</p></td></tr>';
            return;
        }
        
        data.forEach(dokter => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(dokter.kode_dokter)}</td>
                <td>${escapeHtml(dokter.nama_dokter)}</td>
                <td>${escapeHtml(dokter.spesialisasi)}</td>
                <td>${escapeHtml(dokter.nama_poli || '-')}</td>
                <td>${escapeHtml(dokter.telepon || '-')}</td>
                <td><span class="status-badge status-${dokter.status}">${dokter.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn-info" onclick="viewDokter(${dokter.id})" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-secondary" onclick="editDokter(${dokter.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-danger" onclick="deleteDokter(${dokter.id})" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading dokter:', error);
        showError('dokter', 'Gagal memuat data dokter');
    }
}

function showDokterForm(dokter = null) {
    currentEditingId = dokter ? dokter.id : null;
    currentData = dokter;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="dokter-form">
            <div class="form-group">
                <label for="kode_dokter">Kode Dokter *</label>
                <input type="text" id="kode_dokter" name="kode_dokter" value="${dokter ? escapeHtml(dokter.kode_dokter) : ''}" required>
            </div>
            <div class="form-group">
                <label for="nama_dokter">Nama Dokter *</label>
                <input type="text" id="nama_dokter" name="nama_dokter" value="${dokter ? escapeHtml(dokter.nama_dokter) : ''}" required>
            </div>
            <div class="form-group">
                <label for="spesialisasi">Spesialisasi *</label>
                <input type="text" id="spesialisasi" name="spesialisasi" value="${dokter ? escapeHtml(dokter.spesialisasi) : ''}" required>
            </div>
            <div class="form-group">
                <label for="telepon">Telepon</label>
                <input type="text" id="telepon" name="telepon" value="${dokter ? escapeHtml(dokter.telepon) : ''}">
            </div>
            <div class="form-group">
                <label for="email">Email</label>
                <input type="email" id="email" name="email" value="${dokter ? escapeHtml(dokter.email) : ''}">
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" name="alamat">${dokter ? escapeHtml(dokter.alamat) : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status">
                    <option value="aktif" ${dokter && dokter.status === 'aktif' ? 'selected' : ''}>Aktif</option>
                    <option value="cuti" ${dokter && dokter.status === 'cuti' ? 'selected' : ''}>Cuti</option>
                    <option value="keluar" ${dokter && dokter.status === 'keluar' ? 'selected' : ''}>Keluar</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn-primary">${dokter ? 'Update' : 'Simpan'}</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = dokter ? 'Edit Dokter' : 'Tambah Dokter';
    showModal();
    
    document.getElementById('dokter-form').addEventListener('submit', handleDokterSubmit);
}

async function handleDokterSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    if (currentEditingId) {
        data.id = currentEditingId;
    }
    
    try {
        const response = await fetch('api/dokter.php', {
            method: currentEditingId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        showNotification(result.message, 'success');
        
        closeModal();
        loadDokter();
        loadDropdownData();
    } catch (error) {
        console.error('Error saving dokter:', error);
        showNotification('Terjadi kesalahan saat menyimpan data', 'error');
    }
}

async function viewDokter(id) {
    try {
        const response = await fetch(`api/dokter.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            const dokter = data[0];
            const modalBody = document.getElementById('detail-modal-body');
            modalBody.innerHTML = `
                <div class="detail-section">
                    <h4>Informasi Dokter</h4>
                    <div class="detail-grid">
                        <div class="detail-label">Kode Dokter:</div>
                        <div class="detail-value">${escapeHtml(dokter.kode_dokter)}</div>
                        
                        <div class="detail-label">Nama Dokter:</div>
                        <div class="detail-value">${escapeHtml(dokter.nama_dokter)}</div>
                        
                        <div class="detail-label">Spesialisasi:</div>
                        <div class="detail-value">${escapeHtml(dokter.spesialisasi)}</div>
                        
                        <div class="detail-label">Poliklinik:</div>
                        <div class="detail-value">${escapeHtml(dokter.nama_poli || '-')}</div>
                        
                        <div class="detail-label">Telepon:</div>
                        <div class="detail-value">${escapeHtml(dokter.telepon || '-')}</div>
                        
                        <div class="detail-label">Email:</div>
                        <div class="detail-value">${escapeHtml(dokter.email || '-')}</div>
                        
                        <div class="detail-label">Status:</div>
                        <div class="detail-value"><span class="status-badge status-${dokter.status}">${dokter.status}</span></div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Alamat</h4>
                    <div class="detail-value">${escapeHtml(dokter.alamat || '-')}</div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeDetailModal()">Tutup</button>
                    <button type="button" class="btn-primary" onclick="editDokter(${dokter.id})">Edit Data</button>
                </div>
            `;
            
            document.getElementById('detail-modal-title').textContent = 'Detail Dokter';
            showDetailModal();
        }
    } catch (error) {
        console.error('Error loading dokter data:', error);
        showNotification('Gagal memuat data dokter', 'error');
    }
}

async function editDokter(id) {
    try {
        closeDetailModal();
        const response = await fetch(`api/dokter.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            showDokterForm(data[0]);
        }
    } catch (error) {
        console.error('Error loading dokter data:', error);
        showNotification('Gagal memuat data dokter', 'error');
    }
}

async function deleteDokter(id) {
    if (confirm('Apakah Anda yakin ingin menghapus dokter ini?')) {
        try {
            const response = await fetch('api/dokter.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });
            
            const result = await response.json();
            showNotification(result.message, 'success');
            loadDokter();
            loadDropdownData();
        } catch (error) {
            console.error('Error deleting dokter:', error);
            showNotification('Terjadi kesalahan saat menghapus data', 'error');
        }
    }
}

// ===============================
// PASIEN - CRUD FUNCTIONS
// ===============================
async function loadPasien() {
    try {
        showLoading('pasien');
        const response = await fetch('api/pasien.php');
        const data = await response.json();
        
        const tbody = document.getElementById('pasien-tbody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state"><i class="fas fa-user-injured"></i><p>Belum ada data pasien</p></td></tr>';
            return;
        }
        
        data.forEach(pasien => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(pasien.no_rekam_medis)}</td>
                <td>${escapeHtml(pasien.nama_pasien)}</td>
                <td>${pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</td>
                <td>${formatDate(pasien.tanggal_lahir)}</td>
                <td>${escapeHtml(pasien.telepon || '-')}</td>
                <td>${pasien.golongan_darah || '-'}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-info" onclick="viewPasien(${pasien.id})" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-secondary" onclick="editPasien(${pasien.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-danger" onclick="deletePasien(${pasien.id})" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading pasien:', error);
        showError('pasien', 'Gagal memuat data pasien');
    }
}

function showPasienForm(pasien = null) {
    currentEditingId = pasien ? pasien.id : null;
    currentData = pasien;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="pasien-form">
            <div class="form-group">
                <label for="no_rekam_medis">No. Rekam Medis *</label>
                <input type="text" id="no_rekam_medis" name="no_rekam_medis" value="${pasien ? escapeHtml(pasien.no_rekam_medis) : ''}" required>
            </div>
            <div class="form-group">
                <label for="nama_pasien">Nama Pasien *</label>
                <input type="text" id="nama_pasien" name="nama_pasien" value="${pasien ? escapeHtml(pasien.nama_pasien) : ''}" required>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="jenis_kelamin">Jenis Kelamin *</label>
                    <select id="jenis_kelamin" name="jenis_kelamin" required>
                        <option value="">Pilih Jenis Kelamin</option>
                        <option value="L" ${pasien && pasien.jenis_kelamin === 'L' ? 'selected' : ''}>Laki-laki</option>
                        <option value="P" ${pasien && pasien.jenis_kelamin === 'P' ? 'selected' : ''}>Perempuan</option>
                    </select>
                </div>
                <div class="form-group">
                    <label for="golongan_darah">Golongan Darah</label>
                    <select id="golongan_darah" name="golongan_darah">
                        <option value="">Pilih Golongan Darah</option>
                        <option value="A" ${pasien && pasien.golongan_darah === 'A' ? 'selected' : ''}>A</option>
                        <option value="B" ${pasien && pasien.golongan_darah === 'B' ? 'selected' : ''}>B</option>
                        <option value="AB" ${pasien && pasien.golongan_darah === 'AB' ? 'selected' : ''}>AB</option>
                        <option value="O" ${pasien && pasien.golongan_darah === 'O' ? 'selected' : ''}>O</option>
                    </select>
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="tanggal_lahir">Tanggal Lahir *</label>
                    <input type="date" id="tanggal_lahir" name="tanggal_lahir" value="${pasien ? pasien.tanggal_lahir : ''}" required>
                </div>
                <div class="form-group">
                    <label for="tempat_lahir">Tempat Lahir</label>
                    <input type="text" id="tempat_lahir" name="tempat_lahir" value="${pasien ? escapeHtml(pasien.tempat_lahir) : ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="telepon">Telepon</label>
                    <input type="text" id="telepon" name="telepon" value="${pasien ? escapeHtml(pasien.telepon) : ''}">
                </div>
                <div class="form-group">
                    <label for="email">Email</label>
                    <input type="email" id="email" name="email" value="${pasien ? escapeHtml(pasien.email) : ''}">
                </div>
            </div>
            <div class="form-group">
                <label for="alergi">Alergi</label>
                <textarea id="alergi" name="alergi">${pasien ? escapeHtml(pasien.alergi) : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="alamat">Alamat</label>
                <textarea id="alamat" name="alamat">${pasien ? escapeHtml(pasien.alamat) : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn-primary">${pasien ? 'Update' : 'Simpan'}</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = pasien ? 'Edit Pasien' : 'Tambah Pasien';
    showModal();
    
    document.getElementById('pasien-form').addEventListener('submit', handlePasienSubmit);
}

async function handlePasienSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    if (currentEditingId) {
        data.id = currentEditingId;
    }
    
    try {
        const response = await fetch('api/pasien.php', {
            method: currentEditingId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        showNotification(result.message, 'success');
        
        closeModal();
        loadPasien();
        loadDropdownData();
    } catch (error) {
        console.error('Error saving pasien:', error);
        showNotification('Terjadi kesalahan saat menyimpan data', 'error');
    }
}

async function viewPasien(id) {
    try {
        const response = await fetch(`api/pasien.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            const pasien = data[0];
            const modalBody = document.getElementById('detail-modal-body');
            modalBody.innerHTML = `
                <div class="detail-section">
                    <h4>Informasi Pasien</h4>
                    <div class="detail-grid">
                        <div class="detail-label">No. Rekam Medis:</div>
                        <div class="detail-value">${escapeHtml(pasien.no_rekam_medis)}</div>
                        
                        <div class="detail-label">Nama Pasien:</div>
                        <div class="detail-value">${escapeHtml(pasien.nama_pasien)}</div>
                        
                        <div class="detail-label">Jenis Kelamin:</div>
                        <div class="detail-value">${pasien.jenis_kelamin === 'L' ? 'Laki-laki' : 'Perempuan'}</div>
                        
                        <div class="detail-label">Tanggal Lahir:</div>
                        <div class="detail-value">${formatDate(pasien.tanggal_lahir)}</div>
                        
                        <div class="detail-label">Tempat Lahir:</div>
                        <div class="detail-value">${escapeHtml(pasien.tempat_lahir || '-')}</div>
                        
                        <div class="detail-label">Golongan Darah:</div>
                        <div class="detail-value">${pasien.golongan_darah || '-'}</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Kontak</h4>
                    <div class="detail-grid">
                        <div class="detail-label">Telepon:</div>
                        <div class="detail-value">${escapeHtml(pasien.telepon || '-')}</div>
                        
                        <div class="detail-label">Email:</div>
                        <div class="detail-value">${escapeHtml(pasien.email || '-')}</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Informasi Medis</h4>
                    <div class="detail-grid">
                        <div class="detail-label">Alergi:</div>
                        <div class="detail-value">${escapeHtml(pasien.alergi || 'Tidak ada')}</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Alamat</h4>
                    <div class="detail-value">${escapeHtml(pasien.alamat || '-')}</div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeDetailModal()">Tutup</button>
                    <button type="button" class="btn-primary" onclick="editPasien(${pasien.id})">Edit Data</button>
                </div>
            `;
            
            document.getElementById('detail-modal-title').textContent = 'Detail Pasien';
            showDetailModal();
        }
    } catch (error) {
        console.error('Error loading pasien data:', error);
        showNotification('Gagal memuat data pasien', 'error');
    }
}

async function editPasien(id) {
    try {
        closeDetailModal();
        const response = await fetch(`api/pasien.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            showPasienForm(data[0]);
        }
    } catch (error) {
        console.error('Error loading pasien data:', error);
        showNotification('Gagal memuat data pasien', 'error');
    }
}

async function deletePasien(id) {
    if (confirm('Apakah Anda yakin ingin menghapus pasien ini?')) {
        try {
            const response = await fetch('api/pasien.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });
            
            const result = await response.json();
            showNotification(result.message, 'success');
            loadPasien();
            loadDropdownData();
        } catch (error) {
            console.error('Error deleting pasien:', error);
            showNotification('Terjadi kesalahan saat menghapus data', 'error');
        }
    }
}

// ===============================
// PENDAFTARAN - CRUD FUNCTIONS
// ===============================
async function loadPendaftaran() {
    try {
        showLoading('pendaftaran');
        const response = await fetch('api/pendaftaran.php');
        const data = await response.json();
        
        const tbody = document.getElementById('pendaftaran-tbody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="7" class="empty-state"><i class="fas fa-clipboard-list"></i><p>Belum ada data pendaftaran</p></td></tr>';
            return;
        }
        
        data.forEach(pendaftaran => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(pendaftaran.no_registrasi)}</td>
                <td>${escapeHtml(pendaftaran.nama_pasien)} (${escapeHtml(pendaftaran.no_rekam_medis)})</td>
                <td>${escapeHtml(pendaftaran.nama_poli)}</td>
                <td>${escapeHtml(pendaftaran.nama_dokter || '-')}</td>
                <td>${formatDate(pendaftaran.tanggal_registrasi)} ${pendaftaran.jam_registrasi}</td>
                <td><span class="status-badge status-${pendaftaran.status}">${pendaftaran.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn-info" onclick="viewPendaftaran(${pendaftaran.id})" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-secondary" onclick="editPendaftaran(${pendaftaran.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        ${pendaftaran.status !== 'selesai' ? `
                            <button class="btn-success" onclick="buatRekamMedis(${pendaftaran.id})" title="Buat Rekam Medis">
                                <i class="fas fa-file-medical"></i>
                            </button>
                        ` : ''}
                        <button class="btn-danger" onclick="deletePendaftaran(${pendaftaran.id})" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading pendaftaran:', error);
        showError('pendaftaran', 'Gagal memuat data pendaftaran');
    }
}

function showPendaftaranForm(pendaftaran = null) {
    currentEditingId = pendaftaran ? pendaftaran.id : null;
    currentData = pendaftaran;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="pendaftaran-form">
            <div class="form-group">
                <label for="pasien_id">Pasien *</label>
                <select id="pasien_id" name="pasien_id" required>
                    <option value="">Pilih Pasien</option>
                </select>
            </div>
            <div class="form-group">
                <label for="poli_id">Poliklinik *</label>
                <select id="poli_id" name="poli_id" required>
                    <option value="">Pilih Poli</option>
                </select>
            </div>
            <div class="form-group">
                <label for="dokter_id">Dokter</label>
                <select id="dokter_id" name="dokter_id">
                    <option value="">Pilih Dokter</option>
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="tanggal_registrasi">Tanggal Registrasi *</label>
                    <input type="date" id="tanggal_registrasi" name="tanggal_registrasi" value="${pendaftaran ? pendaftaran.tanggal_registrasi : getToday()}" required>
                </div>
                <div class="form-group">
                    <label for="jam_registrasi">Jam Registrasi *</label>
                    <input type="time" id="jam_registrasi" name="jam_registrasi" value="${pendaftaran ? pendaftaran.jam_registrasi : getCurrentTime()}" required>
                </div>
            </div>
            <div class="form-group">
                <label for="keluhan">Keluhan</label>
                <textarea id="keluhan" name="keluhan">${pendaftaran ? escapeHtml(pendaftaran.keluhan) : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status">
                    <option value="terdaftar" ${pendaftaran && pendaftaran.status === 'terdaftar' ? 'selected' : ''}>Terdaftar</option>
                    <option value="diproses" ${pendaftaran && pendaftaran.status === 'diproses' ? 'selected' : ''}>Diproses</option>
                    <option value="selesai" ${pendaftaran && pendaftaran.status === 'selesai' ? 'selected' : ''}>Selesai</option>
                    <option value="batal" ${pendaftaran && pendaftaran.status === 'batal' ? 'selected' : ''}>Batal</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn-primary">${pendaftaran ? 'Update' : 'Simpan'}</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = pendaftaran ? 'Edit Pendaftaran' : 'Tambah Pendaftaran';
    showModal();
    
    loadPasienDropdown();
    loadPoliDropdown();
    loadDokterDropdown();
    
    document.getElementById('pendaftaran-form').addEventListener('submit', handlePendaftaranSubmit);
}

function loadPasienDropdown() {
    const select = document.getElementById('pasien_id');
    select.innerHTML = '<option value="">Pilih Pasien</option>';
    
    dropdownData.pasien.forEach(pasien => {
        const option = document.createElement('option');
        option.value = pasien.id;
        option.textContent = `${pasien.nama_pasien} (${pasien.no_rekam_medis})`;
        if (currentData && currentData.pasien_id == pasien.id) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

function loadPoliDropdown() {
    const select = document.getElementById('poli_id');
    select.innerHTML = '<option value="">Pilih Poli</option>';
    
    dropdownData.poli.forEach(poli => {
        const option = document.createElement('option');
        option.value = poli.id;
        option.textContent = poli.nama_poli;
        if (currentData && currentData.poli_id == poli.id) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

function loadDokterDropdown() {
    const select = document.getElementById('dokter_id');
    select.innerHTML = '<option value="">Pilih Dokter</option>';
    
    dropdownData.dokter.forEach(dokter => {
        const option = document.createElement('option');
        option.value = dokter.id;
        option.textContent = `${dokter.nama_dokter} - ${dokter.spesialisasi}`;
        if (currentData && currentData.dokter_id == dokter.id) {
            option.selected = true;
        }
        select.appendChild(option);
    });
}

async function handlePendaftaranSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    if (currentEditingId) {
        data.id = currentEditingId;
    }
    
    try {
        const response = await fetch('api/pendaftaran.php', {
            method: currentEditingId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        showNotification(result.message, 'success');
        
        closeModal();
        loadPendaftaran();
    } catch (error) {
        console.error('Error saving pendaftaran:', error);
        showNotification('Terjadi kesalahan saat menyimpan data', 'error');
    }
}

async function viewPendaftaran(id) {
    try {
        const response = await fetch(`api/pendaftaran.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            const pendaftaran = data[0];
            const modalBody = document.getElementById('detail-modal-body');
            modalBody.innerHTML = `
                <div class="detail-section">
                    <h4>Informasi Pendaftaran</h4>
                    <div class="detail-grid">
                        <div class="detail-label">No. Registrasi:</div>
                        <div class="detail-value">${escapeHtml(pendaftaran.no_registrasi)}</div>
                        
                        <div class="detail-label">Pasien:</div>
                        <div class="detail-value">${escapeHtml(pendaftaran.nama_pasien)} (${escapeHtml(pendaftaran.no_rekam_medis)})</div>
                        
                        <div class="detail-label">Poliklinik:</div>
                        <div class="detail-value">${escapeHtml(pendaftaran.nama_poli)}</div>
                        
                        <div class="detail-label">Dokter:</div>
                        <div class="detail-value">${escapeHtml(pendaftaran.nama_dokter || '-')}</div>
                        
                        <div class="detail-label">Tanggal:</div>
                        <div class="detail-value">${formatDate(pendaftaran.tanggal_registrasi)} ${pendaftaran.jam_registrasi}</div>
                        
                        <div class="detail-label">Status:</div>
                        <div class="detail-value"><span class="status-badge status-${pendaftaran.status}">${pendaftaran.status}</span></div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Keluhan</h4>
                    <div class="detail-value">${escapeHtml(pendaftaran.keluhan || '-')}</div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeDetailModal()">Tutup</button>
                    <button type="button" class="btn-primary" onclick="editPendaftaran(${pendaftaran.id})">Edit Data</button>
                    ${pendaftaran.status !== 'selesai' ? `
                        <button type="button" class="btn-success" onclick="buatRekamMedis(${pendaftaran.id})">Buat Rekam Medis</button>
                    ` : ''}
                </div>
            `;
            
            document.getElementById('detail-modal-title').textContent = 'Detail Pendaftaran';
            showDetailModal();
        }
    } catch (error) {
        console.error('Error loading pendaftaran data:', error);
        showNotification('Gagal memuat data pendaftaran', 'error');
    }
}

async function editPendaftaran(id) {
    try {
        closeDetailModal();
        const response = await fetch(`api/pendaftaran.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            showPendaftaranForm(data[0]);
        }
    } catch (error) {
        console.error('Error loading pendaftaran data:', error);
        showNotification('Gagal memuat data pendaftaran', 'error');
    }
}

async function deletePendaftaran(id) {
    if (confirm('Apakah Anda yakin ingin menghapus pendaftaran ini?')) {
        try {
            const response = await fetch('api/pendaftaran.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });
            
            const result = await response.json();
            showNotification(result.message, 'success');
            loadPendaftaran();
        } catch (error) {
            console.error('Error deleting pendaftaran:', error);
            showNotification('Terjadi kesalahan saat menghapus data', 'error');
        }
    }
}

// ===============================
// REKAM MEDIS - CRUD FUNCTIONS
// ===============================
async function loadRekamMedis() {
    try {
        showLoading('rekam_medis');
        const response = await fetch('api/rekam_medis.php');
        const data = await response.json();
        
        const tbody = document.getElementById('rekam-medis-tbody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="6" class="empty-state"><i class="fas fa-file-medical"></i><p>Belum ada data rekam medis</p></td></tr>';
            return;
        }
        
        data.forEach(rekam => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(rekam.no_rekam_medis)}</td>
                <td>${escapeHtml(rekam.nama_pasien)}</td>
                <td>${escapeHtml(rekam.nama_dokter)}</td>
                <td>${escapeHtml(rekam.diagnosa || '-')}</td>
                <td>${formatDateTime(rekam.tanggal_periksa)}</td>
                <td>
                    <div class="table-actions">
                        <button class="btn-info" onclick="viewRekamMedis(${rekam.id})" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-secondary" onclick="editRekamMedis(${rekam.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-danger" onclick="deleteRekamMedis(${rekam.id})" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading rekam medis:', error);
        showError('rekam_medis', 'Gagal memuat data rekam medis');
    }
}

async function buatRekamMedis(pendaftaranId) {
    try {
        closeDetailModal();
        const response = await fetch(`api/pendaftaran.php?id=${pendaftaranId}`);
        const pendaftaranData = await response.json();
        
        if (pendaftaranData.length === 0) {
            showNotification('Data pendaftaran tidak ditemukan', 'error');
            return;
        }
        
        const pendaftaran = pendaftaranData[0];
        showRekamMedisForm(null, pendaftaran);
    } catch (error) {
        console.error('Error creating rekam medis:', error);
        showNotification('Gagal memuat data pendaftaran', 'error');
    }
}

function showRekamMedisForm(rekam = null, pendaftaran = null) {
    currentEditingId = rekam ? rekam.id : null;
    currentData = rekam;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="rekam-medis-form">
            ${pendaftaran ? `
                <div class="form-group">
                    <label>Pasien</label>
                    <input type="text" value="${escapeHtml(pendaftaran.nama_pasien)} (${escapeHtml(pendaftaran.no_rekam_medis)})" readonly>
                    <input type="hidden" name="pendaftaran_id" value="${pendaftaran.id}">
                </div>
                <div class="form-group">
                    <label>Dokter</label>
                    <input type="text" value="${escapeHtml(pendaftaran.nama_dokter || '-')}" readonly>
                    <input type="hidden" name="dokter_id" value="${pendaftaran.dokter_id}">
                </div>
            ` : ''}
            <div class="form-group">
                <label for="diagnosa">Diagnosa *</label>
                <textarea id="diagnosa" name="diagnosa" required>${rekam ? escapeHtml(rekam.diagnosa) : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="anamnesa">Anamnesa</label>
                <textarea id="anamnesa" name="anamnesa">${rekam ? escapeHtml(rekam.anamnesa) : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="pemeriksaan_fisik">Pemeriksaan Fisik</label>
                <textarea id="pemeriksaan_fisik" name="pemeriksaan_fisik">${rekam ? escapeHtml(rekam.pemeriksaan_fisik) : ''}</textarea>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="tinggi_badan">Tinggi Badan (cm)</label>
                    <input type="number" id="tinggi_badan" name="tinggi_badan" value="${rekam ? rekam.tinggi_badan : ''}">
                </div>
                <div class="form-group">
                    <label for="berat_badan">Berat Badan (kg)</label>
                    <input type="number" id="berat_badan" name="berat_badan" value="${rekam ? rekam.berat_badan : ''}">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="tekanan_darah">Tekanan Darah</label>
                    <input type="text" id="tekanan_darah" name="tekanan_darah" value="${rekam ? escapeHtml(rekam.tekanan_darah) : ''}" placeholder="120/80">
                </div>
                <div class="form-group">
                    <label for="suhu_badan">Suhu Badan (°C)</label>
                    <input type="number" step="0.1" id="suhu_badan" name="suhu_badan" value="${rekam ? rekam.suhu_badan : ''}">
                </div>
            </div>
            <div class="form-group">
                <label for="catatan_dokter">Catatan Dokter</label>
                <textarea id="catatan_dokter" name="catatan_dokter">${rekam ? escapeHtml(rekam.catatan_dokter) : ''}</textarea>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn-primary">${rekam ? 'Update' : 'Simpan'}</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = rekam ? 'Edit Rekam Medis' : 'Buat Rekam Medis';
    showModal();
    
    document.getElementById('rekam-medis-form').addEventListener('submit', handleRekamMedisSubmit);
}

async function handleRekamMedisSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    if (currentEditingId) {
        data.id = currentEditingId;
    }
    
    try {
        const response = await fetch('api/rekam_medis.php', {
            method: currentEditingId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        showNotification(result.message, 'success');
        
        closeModal();
        loadRekamMedis();
        loadPendaftaran();
    } catch (error) {
        console.error('Error saving rekam medis:', error);
        showNotification('Terjadi kesalahan saat menyimpan data', 'error');
    }
}

async function viewRekamMedis(id) {
    try {
        const response = await fetch(`api/rekam_medis.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            const rekam = data[0];
            const modalBody = document.getElementById('detail-modal-body');
            modalBody.innerHTML = `
                <div class="detail-section">
                    <h4>Informasi Pasien</h4>
                    <div class="detail-grid">
                        <div class="detail-label">No. Rekam Medis:</div>
                        <div class="detail-value">${escapeHtml(rekam.no_rekam_medis)}</div>
                        
                        <div class="detail-label">Nama Pasien:</div>
                        <div class="detail-value">${escapeHtml(rekam.nama_pasien)}</div>
                        
                        <div class="detail-label">Dokter:</div>
                        <div class="detail-value">${escapeHtml(rekam.nama_dokter)}</div>
                        
                        <div class="detail-label">Tanggal Periksa:</div>
                        <div class="detail-value">${formatDateTime(rekam.tanggal_periksa)}</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Diagnosa</h4>
                    <div class="detail-value">${escapeHtml(rekam.diagnosa || '-')}</div>
                </div>
                
                <div class="detail-section">
                    <h4>Anamnesa</h4>
                    <div class="detail-value">${escapeHtml(rekam.anamnesa || '-')}</div>
                </div>
                
                <div class="detail-section">
                    <h4>Pemeriksaan Fisik</h4>
                    <div class="detail-value">${escapeHtml(rekam.pemeriksaan_fisik || '-')}</div>
                </div>
                
                <div class="detail-section">
                    <h4>Vital Signs</h4>
                    <div class="detail-grid">
                        <div class="detail-label">Tinggi Badan:</div>
                        <div class="detail-value">${rekam.tinggi_badan ? rekam.tinggi_badan + ' cm' : '-'}</div>
                        
                        <div class="detail-label">Berat Badan:</div>
                        <div class="detail-value">${rekam.berat_badan ? rekam.berat_badan + ' kg' : '-'}</div>
                        
                        <div class="detail-label">Tekanan Darah:</div>
                        <div class="detail-value">${escapeHtml(rekam.tekanan_darah || '-')}</div>
                        
                        <div class="detail-label">Suhu Badan:</div>
                        <div class="detail-value">${rekam.suhu_badan ? rekam.suhu_badan + ' °C' : '-'}</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Catatan Dokter</h4>
                    <div class="detail-value">${escapeHtml(rekam.catatan_dokter || '-')}</div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeDetailModal()">Tutup</button>
                    <button type="button" class="btn-primary" onclick="editRekamMedis(${rekam.id})">Edit Data</button>
                </div>
            `;
            
            document.getElementById('detail-modal-title').textContent = 'Detail Rekam Medis';
            showDetailModal();
        }
    } catch (error) {
        console.error('Error loading rekam medis data:', error);
        showNotification('Gagal memuat data rekam medis', 'error');
    }
}

async function editRekamMedis(id) {
    try {
        closeDetailModal();
        const response = await fetch(`api/rekam_medis.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            showRekamMedisForm(data[0]);
        }
    } catch (error) {
        console.error('Error loading rekam medis data:', error);
        showNotification('Gagal memuat data rekam medis', 'error');
    }
}

async function deleteRekamMedis(id) {
    if (confirm('Apakah Anda yakin ingin menghapus rekam medis ini?')) {
        try {
            const response = await fetch('api/rekam_medis.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });
            
            const result = await response.json();
            showNotification(result.message, 'success');
            loadRekamMedis();
        } catch (error) {
            console.error('Error deleting rekam medis:', error);
            showNotification('Terjadi kesalahan saat menghapus data', 'error');
        }
    }
}

// ===============================
// OBAT - CRUD FUNCTIONS
// ===============================
async function loadObat() {
    try {
        showLoading('obat');
        const response = await fetch('api/obat.php');
        const data = await response.json();
        
        const tbody = document.getElementById('obat-tbody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><i class="fas fa-pills"></i><p>Belum ada data obat</p></td></tr>';
            return;
        }
        
        data.forEach(obat => {
            const isStokRendah = obat.stok <= obat.stok_minimum;
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(obat.kode_obat)}</td>
                <td>${escapeHtml(obat.nama_obat)}</td>
                <td>${escapeHtml(obat.jenis_obat)}</td>
                <td>${obat.stok} ${obat.satuan}</td>
                <td>${formatCurrency(obat.harga_jual)}</td>
                <td>${formatDate(obat.expired_date)}</td>
                <td><span class="status-badge ${isStokRendah ? 'status-rendah' : 'status-aman'}">${isStokRendah ? 'Stok Rendah' : 'Aman'}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn-info" onclick="viewObat(${obat.id})" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-secondary" onclick="editObat(${obat.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-danger" onclick="deleteObat(${obat.id})" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading obat:', error);
        showError('obat', 'Gagal memuat data obat');
    }
}

function showObatForm(obat = null) {
    currentEditingId = obat ? obat.id : null;
    currentData = obat;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="obat-form">
            <div class="form-group">
                <label for="kode_obat">Kode Obat *</label>
                <input type="text" id="kode_obat" name="kode_obat" value="${obat ? escapeHtml(obat.kode_obat) : ''}" required>
            </div>
            <div class="form-group">
                <label for="nama_obat">Nama Obat *</label>
                <input type="text" id="nama_obat" name="nama_obat" value="${obat ? escapeHtml(obat.nama_obat) : ''}" required>
            </div>
            <div class="form-group">
                <label for="jenis_obat">Jenis Obat</label>
                <input type="text" id="jenis_obat" name="jenis_obat" value="${obat ? escapeHtml(obat.jenis_obat) : ''}">
            </div>
            <div class="form-group">
                <label for="satuan">Satuan</label>
                <select id="satuan" name="satuan">
                    <option value="tablet" ${obat && obat.satuan === 'tablet' ? 'selected' : ''}>Tablet</option>
                    <option value="kapsul" ${obat && obat.satuan === 'kapsul' ? 'selected' : ''}>Kapsul</option>
                    <option value="botol" ${obat && obat.satuan === 'botol' ? 'selected' : ''}>Botol</option>
                    <option value="tube" ${obat && obat.satuan === 'tube' ? 'selected' : ''}>Tube</option>
                    <option value="sachet" ${obat && obat.satuan === 'sachet' ? 'selected' : ''}>Sachet</option>
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="stok">Stok *</label>
                    <input type="number" id="stok" name="stok" value="${obat ? obat.stok : 0}" required min="0">
                </div>
                <div class="form-group">
                    <label for="stok_minimum">Stok Minimum *</label>
                    <input type="number" id="stok_minimum" name="stok_minimum" value="${obat ? obat.stok_minimum : 10}" required min="0">
                </div>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="harga_beli">Harga Beli *</label>
                    <input type="number" id="harga_beli" name="harga_beli" value="${obat ? obat.harga_beli : 0}" required min="0">
                </div>
                <div class="form-group">
                    <label for="harga_jual">Harga Jual *</label>
                    <input type="number" id="harga_jual" name="harga_jual" value="${obat ? obat.harga_jual : 0}" required min="0">
                </div>
            </div>
            <div class="form-group">
                <label for="expired_date">Tanggal Expired *</label>
                <input type="date" id="expired_date" name="expired_date" value="${obat ? obat.expired_date : ''}" required>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn-primary">${obat ? 'Update' : 'Simpan'}</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = obat ? 'Edit Obat' : 'Tambah Obat';
    showModal();
    
    document.getElementById('obat-form').addEventListener('submit', handleObatSubmit);
}

async function handleObatSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    if (currentEditingId) {
        data.id = currentEditingId;
    }
    
    try {
        const response = await fetch('api/obat.php', {
            method: currentEditingId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        showNotification(result.message, 'success');
        
        closeModal();
        loadObat();
    } catch (error) {
        console.error('Error saving obat:', error);
        showNotification('Terjadi kesalahan saat menyimpan data', 'error');
    }
}

async function viewObat(id) {
    try {
        const response = await fetch(`api/obat.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            const obat = data[0];
            const isStokRendah = obat.stok <= obat.stok_minimum;
            const modalBody = document.getElementById('detail-modal-body');
            modalBody.innerHTML = `
                <div class="detail-section">
                    <h4>Informasi Obat</h4>
                    <div class="detail-grid">
                        <div class="detail-label">Kode Obat:</div>
                        <div class="detail-value">${escapeHtml(obat.kode_obat)}</div>
                        
                        <div class="detail-label">Nama Obat:</div>
                        <div class="detail-value">${escapeHtml(obat.nama_obat)}</div>
                        
                        <div class="detail-label">Jenis Obat:</div>
                        <div class="detail-value">${escapeHtml(obat.jenis_obat)}</div>
                        
                        <div class="detail-label">Satuan:</div>
                        <div class="detail-value">${obat.satuan}</div>
                        
                        <div class="detail-label">Stok:</div>
                        <div class="detail-value">${obat.stok} ${obat.satuan}</div>
                        
                        <div class="detail-label">Stok Minimum:</div>
                        <div class="detail-value">${obat.stok_minimum} ${obat.satuan}</div>
                        
                        <div class="detail-label">Status Stok:</div>
                        <div class="detail-value"><span class="status-badge ${isStokRendah ? 'status-rendah' : 'status-aman'}">${isStokRendah ? 'Stok Rendah' : 'Aman'}</span></div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Harga</h4>
                    <div class="detail-grid">
                        <div class="detail-label">Harga Beli:</div>
                        <div class="detail-value">${formatCurrency(obat.harga_beli)}</div>
                        
                        <div class="detail-label">Harga Jual:</div>
                        <div class="detail-value">${formatCurrency(obat.harga_jual)}</div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Informasi Lainnya</h4>
                    <div class="detail-grid">
                        <div class="detail-label">Tanggal Expired:</div>
                        <div class="detail-value">${formatDate(obat.expired_date)}</div>
                        
                        <div class="detail-label">Tanggal Dibuat:</div>
                        <div class="detail-value">${formatDateTime(obat.created_at)}</div>
                    </div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeDetailModal()">Tutup</button>
                    <button type="button" class="btn-primary" onclick="editObat(${obat.id})">Edit Data</button>
                </div>
            `;
            
            document.getElementById('detail-modal-title').textContent = 'Detail Obat';
            showDetailModal();
        }
    } catch (error) {
        console.error('Error loading obat data:', error);
        showNotification('Gagal memuat data obat', 'error');
    }
}

async function editObat(id) {
    try {
        closeDetailModal();
        const response = await fetch(`api/obat.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            showObatForm(data[0]);
        }
    } catch (error) {
        console.error('Error loading obat data:', error);
        showNotification('Gagal memuat data obat', 'error');
    }
}

async function deleteObat(id) {
    if (confirm('Apakah Anda yakin ingin menghapus obat ini?')) {
        try {
            const response = await fetch('api/obat.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });
            
            const result = await response.json();
            showNotification(result.message, 'success');
            loadObat();
        } catch (error) {
            console.error('Error deleting obat:', error);
            showNotification('Terjadi kesalahan saat menghapus data', 'error');
        }
    }
}

// ===============================
// KAMAR - CRUD FUNCTIONS
// ===============================
async function loadKamar() {
    try {
        showLoading('kamar');
        const response = await fetch('api/kamar.php');
        const data = await response.json();
        
        const tbody = document.getElementById('kamar-tbody');
        tbody.innerHTML = '';
        
        if (data.length === 0) {
            tbody.innerHTML = '<tr><td colspan="8" class="empty-state"><i class="fas fa-bed"></i><p>Belum ada data kamar</p></td></tr>';
            return;
        }
        
        data.forEach(kamar => {
            const row = document.createElement('tr');
            row.innerHTML = `
                <td>${escapeHtml(kamar.kode_kamar)}</td>
                <td>${escapeHtml(kamar.nama_kamar)}</td>
                <td>${kamar.kelas}</td>
                <td>${kamar.kapasitas}</td>
                <td>${kamar.terisi}</td>
                <td>${formatCurrency(kamar.harga_per_hari)}</td>
                <td><span class="status-badge status-${kamar.status}">${kamar.status}</span></td>
                <td>
                    <div class="table-actions">
                        <button class="btn-info" onclick="viewKamar(${kamar.id})" title="Lihat Detail">
                            <i class="fas fa-eye"></i>
                        </button>
                        <button class="btn-secondary" onclick="editKamar(${kamar.id})" title="Edit">
                            <i class="fas fa-edit"></i>
                        </button>
                        <button class="btn-danger" onclick="deleteKamar(${kamar.id})" title="Hapus">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </td>
            `;
            tbody.appendChild(row);
        });
    } catch (error) {
        console.error('Error loading kamar:', error);
        showError('kamar', 'Gagal memuat data kamar');
    }
}

function showKamarForm(kamar = null) {
    currentEditingId = kamar ? kamar.id : null;
    currentData = kamar;
    
    const modalBody = document.getElementById('modal-body');
    modalBody.innerHTML = `
        <form id="kamar-form">
            <div class="form-group">
                <label for="kode_kamar">Kode Kamar *</label>
                <input type="text" id="kode_kamar" name="kode_kamar" value="${kamar ? escapeHtml(kamar.kode_kamar) : ''}" required>
            </div>
            <div class="form-group">
                <label for="nama_kamar">Nama Kamar *</label>
                <input type="text" id="nama_kamar" name="nama_kamar" value="${kamar ? escapeHtml(kamar.nama_kamar) : ''}" required>
            </div>
            <div class="form-group">
                <label for="kelas">Kelas *</label>
                <select id="kelas" name="kelas" required>
                    <option value="VIP" ${kamar && kamar.kelas === 'VIP' ? 'selected' : ''}>VIP</option>
                    <option value="I" ${kamar && kamar.kelas === 'I' ? 'selected' : ''}>I</option>
                    <option value="II" ${kamar && kamar.kelas === 'II' ? 'selected' : ''}>II</option>
                    <option value="III" ${kamar && kamar.kelas === 'III' ? 'selected' : ''}>III</option>
                </select>
            </div>
            <div class="form-row">
                <div class="form-group">
                    <label for="kapasitas">Kapasitas *</label>
                    <input type="number" id="kapasitas" name="kapasitas" value="${kamar ? kamar.kapasitas : 1}" required min="1">
                </div>
                <div class="form-group">
                    <label for="terisi">Terisi</label>
                    <input type="number" id="terisi" name="terisi" value="${kamar ? kamar.terisi : 0}" min="0">
                </div>
            </div>
            <div class="form-group">
                <label for="harga_per_hari">Harga Per Hari *</label>
                <input type="number" id="harga_per_hari" name="harga_per_hari" value="${kamar ? kamar.harga_per_hari : 0}" required min="0">
            </div>
            <div class="form-group">
                <label for="fasilitas">Fasilitas</label>
                <textarea id="fasilitas" name="fasilitas">${kamar ? escapeHtml(kamar.fasilitas) : ''}</textarea>
            </div>
            <div class="form-group">
                <label for="status">Status</label>
                <select id="status" name="status">
                    <option value="tersedia" ${kamar && kamar.status === 'tersedia' ? 'selected' : ''}>Tersedia</option>
                    <option value="terisi" ${kamar && kamar.status === 'terisi' ? 'selected' : ''}>Terisi</option>
                    <option value="maintenance" ${kamar && kamar.status === 'maintenance' ? 'selected' : ''}>Maintenance</option>
                </select>
            </div>
            <div class="form-actions">
                <button type="button" class="btn-secondary" onclick="closeModal()">Batal</button>
                <button type="submit" class="btn-primary">${kamar ? 'Update' : 'Simpan'}</button>
            </div>
        </form>
    `;
    
    document.getElementById('modal-title').textContent = kamar ? 'Edit Kamar' : 'Tambah Kamar';
    showModal();
    
    document.getElementById('kamar-form').addEventListener('submit', handleKamarSubmit);
}

async function handleKamarSubmit(event) {
    event.preventDefault();
    
    const formData = new FormData(event.target);
    const data = Object.fromEntries(formData);
    
    if (currentEditingId) {
        data.id = currentEditingId;
    }
    
    try {
        const response = await fetch('api/kamar.php', {
            method: currentEditingId ? 'PUT' : 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        showNotification(result.message, 'success');
        
        closeModal();
        loadKamar();
    } catch (error) {
        console.error('Error saving kamar:', error);
        showNotification('Terjadi kesalahan saat menyimpan data', 'error');
    }
}

async function viewKamar(id) {
    try {
        const response = await fetch(`api/kamar.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            const kamar = data[0];
            const modalBody = document.getElementById('detail-modal-body');
            modalBody.innerHTML = `
                <div class="detail-section">
                    <h4>Informasi Kamar</h4>
                    <div class="detail-grid">
                        <div class="detail-label">Kode Kamar:</div>
                        <div class="detail-value">${escapeHtml(kamar.kode_kamar)}</div>
                        
                        <div class="detail-label">Nama Kamar:</div>
                        <div class="detail-value">${escapeHtml(kamar.nama_kamar)}</div>
                        
                        <div class="detail-label">Kelas:</div>
                        <div class="detail-value">${kamar.kelas}</div>
                        
                        <div class="detail-label">Kapasitas:</div>
                        <div class="detail-value">${kamar.kapasitas} orang</div>
                        
                        <div class="detail-label">Terisi:</div>
                        <div class="detail-value">${kamar.terisi} orang</div>
                        
                        <div class="detail-label">Ketersediaan:</div>
                        <div class="detail-value">${kamar.kapasitas - kamar.terisi} orang</div>
                        
                        <div class="detail-label">Harga Per Hari:</div>
                        <div class="detail-value">${formatCurrency(kamar.harga_per_hari)}</div>
                        
                        <div class="detail-label">Status:</div>
                        <div class="detail-value"><span class="status-badge status-${kamar.status}">${kamar.status}</span></div>
                    </div>
                </div>
                
                <div class="detail-section">
                    <h4>Fasilitas</h4>
                    <div class="detail-value">${escapeHtml(kamar.fasilitas || '-')}</div>
                </div>
                
                <div class="form-actions">
                    <button type="button" class="btn-secondary" onclick="closeDetailModal()">Tutup</button>
                    <button type="button" class="btn-primary" onclick="editKamar(${kamar.id})">Edit Data</button>
                </div>
            `;
            
            document.getElementById('detail-modal-title').textContent = 'Detail Kamar';
            showDetailModal();
        }
    } catch (error) {
        console.error('Error loading kamar data:', error);
        showNotification('Gagal memuat data kamar', 'error');
    }
}

async function editKamar(id) {
    try {
        closeDetailModal();
        const response = await fetch(`api/kamar.php?id=${id}`);
        const data = await response.json();
        
        if (data.length > 0) {
            showKamarForm(data[0]);
        }
    } catch (error) {
        console.error('Error loading kamar data:', error);
        showNotification('Gagal memuat data kamar', 'error');
    }
}

async function deleteKamar(id) {
    if (confirm('Apakah Anda yakin ingin menghapus kamar ini?')) {
        try {
            const response = await fetch('api/kamar.php', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: id })
            });
            
            const result = await response.json();
            showNotification(result.message, 'success');
            loadKamar();
        } catch (error) {
            console.error('Error deleting kamar:', error);
            showNotification('Terjadi kesalahan saat menghapus data', 'error');
        }
    }
}

// ===============================
// UTILITY FUNCTIONS
// ===============================
function showModal() {
    document.getElementById('modal-overlay').style.display = 'flex';
}

function closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
    currentEditingId = null;
    currentData = null;
}

function showDetailModal() {
    document.getElementById('detail-modal-overlay').style.display = 'flex';
}

function closeDetailModal() {
    document.getElementById('detail-modal-overlay').style.display = 'none';
}

function getToday() {
    return new Date().toISOString().split('T')[0];
}

function getCurrentTime() {
    return new Date().toTimeString().split(' ')[0].substring(0, 5);
}

function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('id-ID');
}

function formatDateTime(dateTimeString) {
    if (!dateTimeString) return '-';
    const date = new Date(dateTimeString);
    return date.toLocaleDateString('id-ID') + ' ' + date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
}

function formatCurrency(amount) {
    return 'Rp ' + parseInt(amount).toLocaleString('id-ID');
}

function escapeHtml(unsafe) {
    if (unsafe === null || unsafe === undefined) return '';
    return unsafe
        .toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function showLoading(section) {
    const tbody = document.getElementById(section.replace('_', '-') + '-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="loading">
                    <i class="fas fa-spinner fa-spin"></i>
                    <p>Memuat data...</p>
                </td>
            </tr>
        `;
    }
}

function showError(section, message) {
    const tbody = document.getElementById(section.replace('_', '-') + '-tbody');
    if (tbody) {
        tbody.innerHTML = `
            <tr>
                <td colspan="10" class="error">
                    <i class="fas fa-exclamation-triangle"></i>
                    ${message}
                </td>
            </tr>
        `;
    }
}

function showNotification(message, type = 'info') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => {
            if (notification.parentNode) {
                notification.parentNode.removeChild(notification);
            }
        }, 300);
    }, 5000);
}