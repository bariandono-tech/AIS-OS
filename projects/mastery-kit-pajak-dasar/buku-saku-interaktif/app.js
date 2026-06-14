document.addEventListener('DOMContentLoaded', () => {

    // ==========================================================================
    // 0. DATA STORAGE (CHAPTERS & WITHHOLDING & QUIZ)
    // ==========================================================================
    const CHAPTERS_DATA = {
        1: {
            title: "Ketentuan Umum & Tata Cara Perpajakan (KUP)",
            badge: "Bab 01",
            html: `
                <div class="chapter-header">
                    <span class="chapter-badge">Bab 01</span>
                    <h1>Ketentuan Umum & Tata Cara Perpajakan (KUP)</h1>
                    <p class="chapter-intro">Pemahaman dasar mengenai sistem perpajakan di Indonesia, batas waktu penyetoran, pelaporan, dan sanksi administrasinya.</p>
                </div>
                <hr class="section-divider">
                
                <h2>A. Tiga Sistem Pemungutan Pajak</h2>
                <p>Indonesia menggunakan tiga sistem pemungutan pajak yang disesuaikan dengan jenis objek dan wajib pajaknya:</p>
                <div class="card-grid">
                    <div class="info-card">
                        <div class="card-icon"><i class="fa-solid fa-user-check"></i></div>
                        <h3>Self Assessment System</h3>
                        <p>Wajib Pajak (WP) diberikan kepercayaan penuh untuk menghitung, menyetor, dan melaporkan pajaknya sendiri secara mandiri. Contoh: PPh Badan, PPh Orang Pribadi, dan PPN.</p>
                    </div>
                    <div class="info-card">
                        <div class="card-icon"><i class="fa-solid fa-building-columns"></i></div>
                        <h3>Official Assessment System</h3>
                        <p>Fiskus atau aparat perpajakan yang menetapkan besaran jumlah pajak yang terutang melalui Surat Ketetapan Pajak. Contoh: Pajak Bumi dan Bangunan (PBB).</p>
                    </div>
                    <div class="info-card">
                        <div class="card-icon"><i class="fa-solid fa-handshake"></i></div>
                        <h3>Withholding Tax System</h3>
                        <p>Pemotongan atau pemungutan besaran pajak terutang dilakukan oleh pihak ketiga (pemberi kerja atau bendahara pembayar). Contoh: PPh Pasal 21, PPh Pasal 23, PPh 4(2).</p>
                    </div>
                </div>

                <h2>B. Kalender Batas Setor & Lapor Pajak</h2>
                <p>Ketepatan waktu adalah kunci utama kepatuhan wajib pajak. Berikut ringkasan batas akhir penyetoran dan pelaporan SPT pajak masa dan tahunan:</p>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Jenis Pajak</th>
                                <th>Batas Penyetoran Masa</th>
                                <th>Batas Pelaporan SPT Masa</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>PPh Masa (21, 23, 4(2))</strong></td>
                                <td>Tanggal 10 bulan berikutnya</td>
                                <td>Tanggal 20 bulan berikutnya</td>
                            </tr>
                            <tr>
                                <td><strong>PPN Masa</strong></td>
                                <td>Akhir bulan berikutnya (sebelum lapor)</td>
                                <td>Akhir bulan berikutnya</td>
                            </tr>
                            <tr>
                                <td><strong>SPT Tahunan Orang Pribadi (OP)</strong></td>
                                <td>Sebelum lapor SPT (Maks 31 Maret)</td>
                                <td>Tanggal 31 Maret tahun berikutnya</td>
                            </tr>
                            <tr>
                                <td><strong>SPT Tahunan Badan</strong></td>
                                <td>Sebelum lapor SPT (Maks 30 April)</td>
                                <td>Tanggal 30 April tahun berikutnya</td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="alert alert-warning">
                    <div class="alert-icon"><i class="fa-solid fa-triangle-exclamation"></i></div>
                    <div class="alert-content">
                        <h4>Sanksi Keterlambatan Lapor SPT Tahunan:</h4>
                        <p>Sesuai UU KUP, denda administrasi keterlambatan pelaporan SPT adalah sebesar <strong>Rp 100.000</strong> untuk WP Orang Pribadi, dan <strong>Rp 1.000.000</strong> untuk WP Badan. Sanksi terlambat setor pajak dikenakan bunga berdasarkan tarif bunga KMK ditambah surcharge.</p>
                    </div>
                </div>
            `
        },
        2: {
            title: "PPh 21 Metode TER (Tarif Efektif Rata-Rata)",
            badge: "Bab 02",
            html: `
                <div class="chapter-header">
                    <span class="chapter-badge">Bab 02</span>
                    <h1>PPh 21 Metode TER (Tarif Efektif Rata-Rata)</h1>
                    <p class="chapter-intro">Skema pemotongan pajak penghasilan bulanan terbaru yang berlaku sejak 1 Januari 2024 berdasarkan PP 58/2023 dan PMK 168/2023.</p>
                </div>
                <hr class="section-divider">

                <h2>A. Latar Belakang Metode TER</h2>
                <p>Sebelum tahun 2024, pemotongan PPh 21 bulanan karyawan tetap harus dihitung rumit dengan mengurangkan biaya jabatan, iuran pensiun, menyetahunkan penghasilan, dikurangi PTKP, baru dikali tarif Pasal 17. Sejak 1 Januari 2024, pemotongan masa (Januari-November) sangat disederhanakan: <strong>Gaji Bruto Bulanan &times; Tarif TER</strong>.</p>

                <h2>B. Pembagian Kategori TER Bulanan</h2>
                <p>Tarif TER dibagi menjadi tiga kategori (A, B, C) yang ditentukan oleh status PTKP pada awal tahun pajak:</p>
                
                <div class="card-grid">
                    <div class="info-card">
                        <h3>TER Kategori A</h3>
                        <p>Wajib Pajak dengan status PTKP:</p>
                        <ul>
                            <li><strong>TK/0</strong> (Lajang, tanpa tanggungan)</li>
                            <li><strong>TK/1</strong> (Lajang, 1 tanggungan)</li>
                            <li><strong>K/0</strong> (Menikah, tanpa tanggungan)</li>
                        </ul>
                        <p>Tarif mulai dari <strong>0%</strong> (gaji &le; 5,4jt) hingga <strong>34%</strong>.</p>
                    </div>
                    <div class="info-card">
                        <h3>TER Kategori B</h3>
                        <p>Wajib Pajak dengan status PTKP:</p>
                        <ul>
                            <li><strong>TK/2</strong> (Lajang, 2 tanggungan)</li>
                            <li><strong>TK/3</strong> (Lajang, 3 tanggungan)</li>
                            <li><strong>K/1</strong> (Menikah, 1 tanggungan)</li>
                            <li><strong>K/2</strong> (Menikah, 2 tanggungan)</li>
                        </ul>
                        <p>Tarif mulai dari <strong>0%</strong> (gaji &le; 6,2jt) hingga <strong>34%</strong>.</p>
                    </div>
                    <div class="info-card">
                        <h3>TER Kategori C</h3>
                        <p>Wajib Pajak dengan status PTKP:</p>
                        <ul>
                            <li><strong>K/3</strong> (Menikah, 3 tanggungan)</li>
                        </ul>
                        <p>Tarif mulai dari <strong>0%</strong> (gaji &le; 6,6jt) hingga <strong>34%</strong>.</p>
                    </div>
                </div>

                <h2>C. Rumus Akhir Tahun (Masa Desember)</h2>
                <p>Skema TER hanya digunakan untuk memotong pajak bulanan periode Januari s.d November. Pada masa pajak **Desember**, pemotongan PPh 21 dikembalikan menggunakan metode tradisional setahun penuh dengan rumus:</p>
                <div class="alert alert-info">
                    <div class="alert-content">
                        <strong>Formula PPh 21 Desember:</strong><br>
                        PPh 21 Masa Desember = PPh 21 Terutang Setahun (Tarif Pasal 17) - Total PPh 21 yang Dipotong (Jan-Nov)
                    </div>
                </div>

                <h2>D. Tarif Progresif PPh Badan/OP (Pasal 17 UU PPh HPP)</h2>
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Lapisan Penghasilan Kena Pajak (PKP) Setahun</th>
                                <th>Tarif Pajak</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td>Sampai dengan Rp 60.000.000</td>
                                <td><strong>5%</strong></td>
                            </tr>
                            <tr>
                                <td>Diatas Rp 60.000.000 s.d Rp 250.000.000</td>
                                <td><strong>15%</strong></td>
                            </tr>
                            <tr>
                                <td>Diatas Rp 250.000.000 s.d Rp 500.000.000</td>
                                <td><strong>25%</strong></td>
                            </tr>
                            <tr>
                                <td>Diatas Rp 500.000.000 s.d Rp 5.000.000.000</td>
                                <td><strong>30%</strong></td>
                            </tr>
                            <tr>
                                <td>Di atas Rp 5.000.000.000</td>
                                <td><strong>35%</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        3: {
            title: "Withholding Tax (Pajak Pemotongan & Pemungutan)",
            badge: "Bab 03",
            html: `
                <div class="chapter-header">
                    <span class="chapter-badge">Bab 03</span>
                    <h1>Withholding Tax (Pajak Pemotongan & Pemungutan)</h1>
                    <p class="chapter-intro">Kupas tuntas konsep dan klasifikasi PPh Pasal 21, 22, 23, 26, dan PPh Final 4(2) yang dipotong/dipungut oleh pihak ketiga.</p>
                </div>
                <hr class="section-divider">

                <h2>A. Apa itu Withholding Tax?</h2>
                <p>**Withholding Tax** adalah metode pemungutan pajak di mana pihak ketiga (pemberi kerja, bendahara pemerintah, atau badan usaha tertentu) ditunjuk oleh undang-undang untuk memotong atau memungut pajak atas penghasilan atau transaksi yang dilakukan wajib pajak penerima uang, lalu menyetorkannya langsung ke kas negara.</p>

                <h2>B. Klasifikasi Withholding Tax Indonesia</h2>
                <div class="card-grid">
                    <div class="info-card">
                        <h3>PPh Pasal 21</h3>
                        <p>Dikenakan atas penghasilan berupa gaji, upah, honorarium, tunjangan, dan pembayaran lain sehubungan dengan pekerjaan/jasa yang dilakukan oleh <strong>Orang Pribadi Dalam Negeri</strong>.</p>
                    </div>
                    <div class="info-card">
                        <h3>PPh Pasal 22</h3>
                        <p>Pemungutan pajak atas kegiatan di bidang impor barang, transaksi pembelian barang oleh bendahara pemerintah, atau penjualan barang mewah oleh badan usaha tertentu.</p>
                    </div>
                    <div class="info-card">
                        <h3>PPh Pasal 23</h3>
                        <p>Pemotongan pajak atas penghasilan bermotif investasi/jasa selain yang dipotong PPh 21, seperti dividen, bunga, royalti, sewa harta (selain tanah/bangunan), dan jasa yang dilakukan oleh <strong>WP Badan/OP DN</strong>.</p>
                    </div>
                </div>

                <div class="card-grid">
                    <div class="info-card">
                        <h3>PPh Pasal 26</h3>
                        <p>Pemotongan pajak atas penghasilan yang bersumber dari Indonesia yang diterima oleh Wajib Pajak **Luar Negeri** (baik Orang Pribadi maupun Badan).</p>
                    </div>
                    <div class="info-card">
                        <h3>PPh Pasal 4(2) - Final</h3>
                        <p>Pemotongan pajak atas objek tertentu yang bersifat final, artinya pajak yang sudah dipotong tidak dapat dikreditkan pada akhir tahun. Contoh: Sewa tanah/bangunan, hadiah undian, bunga deposito, dan PPh UMKM.</p>
                    </div>
                </div>

                <div class="alert alert-warning">
                    <div class="alert-icon"><i class="fa-solid fa-circle-exclamation"></i></div>
                    <div class="alert-content">
                        <h4>Sanksi Tidak Memiliki NPWP:</h4>
                        <p>Wajib Pajak yang tidak memiliki NPWP dikenakan tarif pemotongan yang lebih tinggi secara signifikan:</p>
                        <ul>
                            <li><strong>PPh 21:</strong> Dikenakan tarif 120% (atau +20% lebih tinggi).</li>
                            <li><strong>PPh 22 & PPh 23:</strong> Dikenakan tarif 200% (atau +100% lebih tinggi/dua kali lipat).</li>
                        </ul>
                    </div>
                </div>
            `
        },
        4: {
            title: "Pajak Pertambahan Nilai (PPN)",
            badge: "Bab 04",
            html: `
                <div class="chapter-header">
                    <span class="chapter-badge">Bab 04</span>
                    <h1>Pajak Pertambahan Nilai (PPN)</h1>
                    <p class="chapter-intro">Materi dasar PPN, mekanisme pengkreditan Pajak Masukan-Pajak Keluaran, dan ketentuan Wajib Pungut (Wapu).</p>
                </div>
                <hr class="section-divider">

                <h2>A. Karakteristik & Tarif PPN</h2>
                <p>PPN adalah pajak konsumsi atas Barang Kena Pajak (BKP) dan Jasa Kena Pajak (JKP) di dalam Daerah Pabean yang bersifat objektif, multi-stage non-kumulatif, dan tidak langsung. Pihak yang wajib memungut PPN adalah Pengusaha yang telah dikukuhkan sebagai **Pengusaha Kena Pajak (PKP)** (omzet &gt; Rp 4,8 Miliar/tahun).</p>
                <p>Berdasarkan **Undang-Undang Harmonisasi Peraturan Perpajakan (UU HPP)**, tarif PPN Indonesia diatur sebagai berikut:</p>
                <ul>
                    <li>Tarif PPN saat ini adalah sebesar <strong>11%</strong>.</li>
                    <li>Sesuai undang-undang, tarif direncanakan naik menjadi <strong>12%</strong> selambat-lambatnya pada tanggal 1 Januari 2025.</li>
                    <li>Ekspor BKP dan JKP dikenakan tarif <strong>0%</strong> (insentif ekspor).</li>
                </ul>

                <h2>B. Mekanisme Pengkreditan PPN (Masa Pajak)</h2>
                <p>PKP menghitung kewajiban PPN bulanan mereka dengan cara menandingkan PPN yang mereka pungut saat menjual barang (Pajak Keluaran) dengan PPN yang mereka bayar saat membeli bahan baku (Pajak Masukan):</p>
                
                <div class="alert alert-info">
                    <div class="alert-content">
                        <strong>Formula Selisih PPN Bulanan:</strong><br>
                        PPN Akhir Masa = Pajak Keluaran (PK) - Pajak Masukan (PM)
                    </div>
                </div>

                <div class="card-grid">
                    <div class="info-card">
                        <h3>Jika Pajak Keluaran &gt; Pajak Masukan</h3>
                        <p>Terjadi **PPN Kurang Bayar**. Selisih tersebut harus disetorkan oleh PKP ke kas negara paling lambat akhir bulan berikutnya (sebelum pelaporan SPT PPN Masa).</p>
                    </div>
                    <div class="info-card">
                        <h3>Jika Pajak Keluaran &lt; Pajak Masukan</h3>
                        <p>Terjadi **PPN Lebih Bayar**. Kelebihan pembayaran ini dapat dikompensasikan ke masa pajak berikutnya, atau dimohonkan pengembalian kembali (restitusi) pada akhir tahun buku.</p>
                    </div>
                </div>

                <h2>C. Ketentuan PPN Wapu (Wajib Pungut)</h2>
                <p>Jika PKP bertransaksi dengan instansi pemerintah, BUMN, Kontraktor Migas, atau pihak-pihak yang ditunjuk sebagai **Wajib Pungut (Wapu)**:</p>
                <ul>
                    <li>PPN 11% tetap dikenakan atas transaksi tersebut.</li>
                    <li>Namun, PPN tersebut tidak diserahkan kepada PKP Penjual, melainkan disetor langsung oleh Instansi Wapu ke kas negara menggunakan NPWP/SSP atas nama PKP Penjual.</li>
                    <li>Faktur pajak yang diterbitkan menggunakan kode transaksi khusus **020** (untuk Bendahara Pemerintah) atau **030** (untuk BUMN/Wapu Lainnya).</li>
                </ul>
            `
        },
        5: {
            title: "Coretax System & PMK 01/2026",
            badge: "Bab 05",
            html: `
                <div class="chapter-header">
                    <span class="chapter-badge">Bab 05</span>
                    <h1>Coretax System & PMK 01/2026</h1>
                    <p class="chapter-intro">Mempelajari modernisasi IT perpajakan DJP serta aturan terhangat mengenai restrukturisasi BUMN dan penggunaan Nilai Buku.</p>
                </div>
                <hr class="section-divider">

                <h2>A. Apa itu Coretax System?</h2>
                <p>**Coretax System** (Sistem Inti Administrasi Perpajakan) adalah pembaruan sistem teknologi informasi perpajakan nasional yang mengintegrasikan seluruh proses bisnis perpajakan di Indonesia secara terpadu. Regulasi dasarnya diatur dalam **PMK Nomor 81 Tahun 2024**.</p>
                <p>Beberapa fitur penting Coretax yang mengubah cara kerja administrasi wajib pajak:</p>
                <ul>
                    <li><strong>Taxpayer Portal:</strong> Portal terpadu yang memadukan pendaftaran NPWP, e-billing, e-filing pelaporan SPT, pengajuan permohonan, hingga layanan bantuan fiskus.</li>
                    <li><strong>Taxpayer Account System:</strong> Buku rekening koran pajak wajib pajak secara *real-time*. Semua transaksi setoran, pembayaran, denda, dan restitusi tercatat dalam mutasi mutakhir.</li>
                    <li><strong>Deposit Pajak:</strong> WP bisa menyetor uang ke akun deposit pajak terlebih dahulu, lalu menggunakannya kemudian untuk membayar berbagai jenis ketetapan pajak terutang saat jatuh tempo.</li>
                </ul>

                <h2>B. PMK Nomor 1 Tahun 2026: Restrukturisasi BUMN</h2>
                <p>**PMK 1/2026** diterbitkan sebagai penyesuaian aturan dalam rangka implementasi Coretax System, khususnya yang mengatur tentang pengalihan aset/harta dalam rangka penggabungan, peleburan, pemekaran, atau pengambilalihan usaha bagi BUMN.</p>
                
                <div class="alert alert-warning">
                    <div class="alert-content">
                        <strong>Perluasan Definisi BUMN di PMK 1/2026:</strong><br>
                        BUMN kini didefinisikan sebagai badan usaha yang modalnya dimiliki negara secara langsung, ATAU memiliki **hak istimewa (special rights)** yang dipegang oleh Negara RI (misalnya pemilikan Saham Seri A Dwiwarna meskipun saham biasa negara telah terdilusi).
                    </div>
                </div>

                <h2>C. Insentif Nilai Buku (Book Value) vs Nilai Pasar (Market Value)</h2>
                <p>Dalam restrukturisasi usaha, penilaian kembali (revaluasi) aset dapat menimbulkan pajak besar. PMK 1/2026 memberikan insentif pajak berupa penangguhan dengan menggunakan Nilai Buku:</p>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Kriteria Penilaian</th>
                                <th>Metode Nilai Pasar (Market Value)</th>
                                <th>Metode Nilai Buku (Book Value)</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>Pencatatan Nilai Aset</strong></td>
                                <td>Aset dicatat berdasarkan harga pasar wajar saat pengalihan.</td>
                                <td>Aset tetap dicatat berdasarkan nilai sisa buku fiskal asli.</td>
                            </tr>
                            <tr>
                                <td><strong>Pengaruh PPh Badan</strong></td>
                                <td>Selisih revaluasi dianggap Capital Gain dan kena PPh Badan 22%.</td>
                                <td><strong>Bebas PPh Pengalihan Harta (Pajak ditangguhkan)</strong>.</td>
                            </tr>
                            <tr>
                                <td><strong>Dampak Likuiditas</strong></td>
                                <td>Membebani arus kas (cash flow) perusahaan karena harus bayar pajak seketika.</td>
                                <td>Mendukung efisiensi dan perputaran restrukturisasi/holding BUMN.</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            `
        },
        6: {
            title: "Cheat-Sheet & Trik Cepat Ujian Perpajakan",
            badge: "Bab 06",
            html: `
                <div class="chapter-header">
                    <span class="chapter-badge">Bab 06</span>
                    <h1>Cheat-Sheet & Trik Cepat Ujian Perpajakan</h1>
                    <p class="chapter-intro">Kumpulan jembatan keledai, cara cepat menghitung PTKP, dan trik menjawab pertanyaan ujian perpajakan dasar.</p>
                </div>
                <hr class="section-divider">

                <h2>A. Jembatan Keledai Mengingat Withholding Tax</h2>
                <p>Gunakan trik asosiasi kata berikut untuk mengingat pasal-pasal pemotongan pajak tanpa tertukar:</p>
                <ul>
                    <li><strong class="text-accent">PPh 21 — "Orang Kerja":</strong> Mengatur pajak atas gaji, honor, upah yang diterima oleh Orang Pribadi (OP) Dalam Negeri.</li>
                    <li><strong class="text-accent">PPh 22 — "Impor & Belanja Negara":</strong> Dikenakan atas impor barang (bea cukai) dan transaksi belanja barang menggunakan dana APBN oleh Bendahara Pemerintah.</li>
                    <li><strong class="text-accent">PPh 23 — "Investasi & Jasa Badan":</strong> Dikenakan atas dividen, bunga, royalti, sewa alat, dan jasa yang diserahkan oleh Wajib Pajak Badan DN.</li>
                    <li><strong class="text-accent">PPh 26 — "Orang Asing":</strong> Dikenakan atas segala jenis penghasilan wajib pajak luar negeri yang mengalir keluar dari Indonesia.</li>
                    <li><strong class="text-accent">PPh 4(2) — "Uang Diam / Pajak Final":</strong> Bersifat final atas properti (sewa tanah/bangunan), bunga tabungan deposito, dan hadiah undian.</li>
                </ul>

                <h2>B. Trik Menghitung PTKP Tahunan Tanpa Tabel</h2>
                <p>Ingat angka dasar untuk Wajib Pajak Sendiri (TK/0) sebesar **Rp 54.000.000**. Setiap ada perubahan status (menikah) atau penambahan tanggungan (anak), cukup tambahkan **Rp 4.500.000** per tanggungan (maksimal 3 tanggungan):</p>
                
                <div class="table-container">
                    <table>
                        <thead>
                            <tr>
                                <th>Status PTKP</th>
                                <th>Cara Menghitung</th>
                                <th>Batas PTKP Setahun</th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td><strong>TK/0 (Dasar Lajang)</strong></td>
                                <td>Nilai Dasar</td>
                                <td><strong>Rp 54.000.000</strong></td>
                            </tr>
                            <tr>
                                <td><strong>TK/1 (Lajang + 1 Anak)</strong></td>
                                <td>Rp 54.000.000 + Rp 4.500.000</td>
                                <td><strong>Rp 58.500.000</strong></td>
                            </tr>
                            <tr>
                                <td><strong>K/0 (Kawin, 0 Anak)</strong></td>
                                <td>Rp 54.000.000 + Rp 4.500.000</td>
                                <td><strong>Rp 58.500.000</strong></td>
                            </tr>
                            <tr>
                                <td><strong>K/1 (Kawin + 1 Anak)</strong></td>
                                <td>Rp 54.000.000 + Rp 4.500.000 + Rp 4.500.000</td>
                                <td><strong>Rp 63.000.000</strong></td>
                            </tr>
                            <tr>
                                <td><strong>K/3 (Kawin + 3 Anak)</strong></td>
                                <td>Rp 54.000.000 + Rp 4.500.000 + (3 &times; Rp 4.500.000)</td>
                                <td><strong>Rp 72.000.000</strong></td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <h2>C. Trik Menguji "Business Purpose Test" (Soal Merger)</h2>
                <p>Dalam soal ujian manajemen perpajakan, sering muncul pertanyaan: *"Apakah merger diperbolehkan menggunakan Nilai Buku?"*</p>
                <p><strong>Jawabannya:</strong> Diperbolehkan asalkan lolos **Business Purpose Test**. Artinya merger dilakukan untuk melahirkan sinergi usaha (efisiensi operasional, ekspansi pasar), bukan semata-mata trik akuntansi untuk melakukan *pembulatan sisa rugi fiskal* atau *penghindaran sanksi utang pajak*.</p>
            `
        }
    };

    const WITHHOLDING_DATABASE = [
        { type: "21", name: "Gaji & Upah Karyawan Tetap", rate: "TER (Bulanan)", desc: "Pemotongan PPh Pasal 21 masa Januari-November atas penghasilan bruto bulanan wajib pajak dalam negeri sehubungan dengan pekerjaan.", penalty: "+20% (Tarif dikali 120% bagi yang tidak memiliki NPWP)" },
        { type: "21", name: "Honorarium Pembicara Orang Pribadi", rate: "Tarif Pasal 17 progresif", desc: "Dihitung dari 50% jumlah bruto penghasilan kumulatif atau non-kumulatif yang dibayarkan kepada penerima honor non-karyawan.", penalty: "+20% (Tarif dikali 120% bagi yang tidak memiliki NPWP)" },
        { type: "22", name: "Impor Barang (Kepemilikan API)", rate: "2.5% dari Nilai Impor", desc: "Dipungut oleh Direktorat Jenderal Bea dan Cukai pada saat wajib pajak mengimpor barang dan memiliki Angka Pengenal Importir (API).", penalty: "+100% (Tarif menjadi 5% bagi yang tidak memiliki NPWP)" },
        { type: "22", name: "Impor Barang (Tanpa API)", rate: "7.5% dari Nilai Impor", desc: "Dipungut oleh Ditjen Bea Cukai saat wajib pajak mengimpor barang tetapi tidak memiliki Angka Pengenal Importir (API).", penalty: "+100% (Tarif menjadi 15% bagi yang tidak memiliki NPWP)" },
        { type: "22", name: "Pembelian Barang oleh Bendahara APBN/APBD", rate: "1.5% dari Harga Beli", desc: "Dipungut oleh bendahara pemerintah (satuan kerja kementerian/daerah) atas pembelian barang/belanja yang didanai anggaran negara.", penalty: "+100% (Tarif menjadi 3.0% bagi yang tidak memiliki NPWP)" },
        { type: "23", name: "Dividen (Penerima Wajib Pajak Badan DN)", rate: "0% (Bebas Pajak)", desc: "Sejak berlakunya UU Cipta Kerja & UU HPP, dividen yang dibayarkan kepada wajib pajak badan dalam negeri dikecualikan dari objek PPh.", penalty: "Tidak dikenakan pajak" },
        { type: "23", name: "Dividen (Penerima WP Orang Pribadi DN)", rate: "10% (Final)", desc: "Dikenakan pemotongan PPh bersifat final jika diinvestasikan kembali di wilayah NKRI dalam kurun waktu tertentu dibebaskan pajak.", penalty: "Tarif tetap 10%" },
        { type: "23", name: "Bunga & Royalti (WP Badan/OP DN)", rate: "15% dari Jumlah Bruto", desc: "Dipotong atas penghasilan bunga (selain bunga deposito) dan penggunaan hak paten/merek/royalti wajib pajak DN.", penalty: "+100% (Tarif menjadi 30% bagi yang tidak memiliki NPWP)" },
        { type: "23", name: "Sewa Harta (Selain Tanah & Bangunan)", rate: "2% dari Jumlah Bruto", desc: "Dipotong atas transaksi sewa alat transportasi, sewa mesin, komputer, sound system, tenda, atau aset peralatan operasional lainnya.", penalty: "+100% (Tarif menjadi 4% bagi yang tidak memiliki NPWP)" },
        { type: "23", name: "Jasa Teknik, Manajemen, Konsultan", rate: "2% dari Jumlah Bruto", desc: "Dipotong atas penyerahan jasa keahlian seperti jasa konsultan akuntansi, jasa hukum, jasa instalasi AC, jasa perbaikan mesin.", penalty: "+100% (Tarif menjadi 4% bagi yang tidak memiliki NPWP)" },
        { type: "26", name: "Penghasilan Mengalir ke Luar Negeri (WP LN)", rate: "20% dari Jumlah Bruto", desc: "Dipotong atas dividen, bunga, royalti, gaji, atau honorarium yang dikirimkan kepada Wajib Pajak Luar Negeri.", penalty: "Dapat diturunkan jika ada P3B (Tax Treaty) yang sah antara Indonesia dengan negara penerima." },
        { type: "4(2)", name: "Sewa Tanah dan/atau Bangunan", rate: "10% (Final)", desc: "Dikenakan PPh bersifat final atas transaksi sewa ruko, sewa rumah dinas, kantor, tanah, gudang, maupun gedung pertemuan.", penalty: "Bersifat final, tarif tetap 10%" },
        { type: "4(2)", name: "Hadiah Undian", rate: "25% (Final)", desc: "Dipotong oleh penyelenggara undian/promosi atas nilai bruto hadiah undian yang dimenangkan oleh wajib pajak.", penalty: "Bersifat final, tarif tetap 25%" },
        { type: "4(2)", name: "Bunga Deposito / Tabungan", rate: "20% (Final)", desc: "Dipotong secara otomatis oleh pihak bank atas perolehan bunga tabungan dan deposito di atas Rp 7,5 juta.", penalty: "Bersifat final, tarif tetap 20%" },
        { type: "4(2)", name: "Penghasilan Usaha UMKM (PP 55/2022)", rate: "0.5% (Final)", desc: "Dikenakan atas omzet penjualan bruto UMKM (baik OP maupun Badan) yang memiliki peredaran bruto di bawah Rp 4,8 Miliar/tahun.", penalty: "Untuk WP OP, omzet s.d Rp 500 Juta setahun bebas pajak (0%)." }
    ];

    const QUIZ_QUESTIONS = [
        {
            question: "Budi memiliki status PTKP TK/1 (Lajang dengan 1 tanggungan). Pada bulan Maret 2026, ia memperoleh gaji bruto sebesar Rp 7.200.000. Manakah kategori TER dan persentase tarif bulanan yang harus digunakan oleh pemberi kerja untuk memotong PPh 21 Budi?",
            options: [
                "Kategori A, Tarif 1.00%",
                "Kategori B, Tarif 0.75%",
                "Kategori B, Tarif 1.00%",
                "Kategori A, Tarif 1.25%"
            ],
            correctIndex: 1,
            explanation: "Status PTKP TK/1 masuk ke dalam **TER Kategori A** (terdiri dari TK/0, TK/1, K/0). Di tabel TER Kategori A, penghasilan bruto di atas Rp 6.750.000 s.d Rp 7.500.000 dikenakan tarif efektif bulanan sebesar **1.25%**. Maka opsi yang benar adalah Kategori A, Tarif 1.25%. (Catatan: Pilihan Kategori B salah karena TK/1 bukan anggota Kategori B)."
        },
        {
            question: "Wajib Pajak PT Maju Terus (memiliki NPWP) menggunakan jasa PT Solusi Kreatif (memiliki NPWP) untuk merancang software akuntansi internal dengan nilai kontrak bruto sebesar Rp 50.000.000. Berapa PPh Pasal 23 yang wajib dipotong oleh PT Maju Terus?",
            options: [
                "Rp 1.000.000 (Tarif 2%)",
                "Rp 2.500.000 (Tarif 5%)",
                "Rp 7.500.000 (Tarif 15%)",
                "Rp 2.000.000 (Tarif 4% karena non-NPWP)"
            ],
            correctIndex: 0,
            explanation: "Jasa perancangan software masuk ke dalam kategori Jasa Teknik/Teknologi Informasi, objek **PPh Pasal 23** dengan tarif normal **2%** dari jumlah bruto. Penghitungannya: 2% &times; Rp 50.000.000 = **Rp 1.000.000**. Karena kedua belah pihak memiliki NPWP, sanksi kenaikan tarif tidak berlaku."
        },
        {
            question: "CV Prima (PKP) menjual barang elektronik seharga Rp 20.000.000 (belum termasuk PPN) kepada Dinas Pendidikan Kota Pontianak (Wajib Pungut PPN). Manakah pernyataan berikut yang paling tepat mengenai perlakuan PPN atas transaksi ini?",
            options: [
                "CV Prima memungut PPN 11% (Rp 2.200.000) dan menyetorkannya sendiri ke kas negara.",
                "Dinas Pendidikan memungut PPN 11% (Rp 2.200.000) dan menyetorkannya langsung ke kas negara atas nama CV Prima.",
                "Transaksi tersebut dibebaskan dari pengenaan PPN (tarif 0%) karena pembelinya adalah instansi pemerintah.",
                "Dinas Pendidikan memotong PPh Pasal 23 sebesar 10% atas pembelian barang tersebut."
            ],
            correctIndex: 1,
            explanation: "Dinas Pendidikan berstatus sebagai bendahara pemerintah / **Wajib Pungut (Wapu) PPN**. Oleh karena itu, PPN sebesar 11% (Rp 2.200.000) dipungut dan disetorkan langsung oleh instansi Wapu tersebut ke kas negara. CV Prima hanya membuat Faktur Pajak dengan kode **020** dan melaporkannya dalam SPT PPN Masa."
        },
        {
            question: "Dalam implementasi Coretax System di PMK 1/2026, terdapat penyesuaian insentif perpajakan atas restrukturisasi BUMN. Apa keuntungan utama bagi BUMN yang melakukan merger usaha menggunakan metode Nilai Buku (Book Value) dibandingkan Nilai Pasar (Market Value)?",
            options: [
                "Nilai buku membuat aset perusahaan terdepresiasi lebih cepat sehingga laba naik.",
                "Selisih keuntungan pengalihan harta tidak diakui sebagai capital gain, sehingga bebas dari tagihan PPh Badan seketika (pajak ditangguhkan).",
                "BUMN penerima pengalihan aset diperbolehkan melunasi denda pajak masa lalu menggunakan voucher holding.",
                "Nilai buku secara otomatis membebaskan BUMN dari seluruh kewajiban memungut PPN keluaran atas penjualan produk retail."
            ],
            correctIndex: 1,
            explanation: "Penggunaan **Nilai Buku (Book Value)** dalam merger/restrukturisasi BUMN membuat transaksi pengalihan aset dicatat sebesar nilai sisa buku fiskal asli. Keuntungannya adalah **tidak timbul capital gain** saat revaluasi pengalihan, sehingga BUMN terhindar dari kewajiban menyetor PPh Badan 22% seketika (pajak ditangguhkan)."
        },
        {
            question: "Berapakah nilai Batas Penghasilan Tidak Kena Pajak (PTKP) setahun untuk Wajib Pajak Orang Pribadi dengan status K/2 (Menikah dengan 2 tanggungan)?",
            options: [
                "Rp 58.500.000",
                "Rp 63.000.000",
                "Rp 67.500.000",
                "Rp 72.000.000"
            ],
            correctIndex: 2,
            explanation: "Rumus cepat PTKP: Nilai dasar TK/0 (Rp 54.000.000) + Tambahan status Menikah (Rp 4.500.000) + Tambahan 2 tanggungan (2 &times; Rp 4.500.000 = Rp 9.000.000). Total PTKP K/2: Rp 54.000.000 + Rp 4.500.000 + Rp 9.000.000 = **Rp 67.500.000**."
        }
    ];

    // ==========================================================================
    // 1. STATE VARIABLES & DOM ELEMENTS
    // ==========================================================================
    let currentChapter = 1;
    let bookmarks = JSON.parse(localStorage.getItem('tax_bookmarks')) || [];
    
    // Sidebar / Nav elements
    const sidebarToggleBtn = document.getElementById('sidebar-toggle-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const appSidebar = document.getElementById('app-sidebar');
    const navItems = document.querySelectorAll('.nav-item');
    const chapterPane = document.getElementById('chapter-pane');
    const currentSectionTitle = document.getElementById('current-section-title');
    const contentBody = document.getElementById('content-body');
    
    // Search elements
    const searchInput = document.getElementById('search-input');
    const searchResultsPanel = document.getElementById('search-results-panel');
    const searchResultsList = document.getElementById('search-results-list');
    const searchQueryText = document.getElementById('search-query-text');
    const btnCloseSearch = document.getElementById('btn-close-search');

    // Theme / Bookmark elements
    const btnToggleTheme = document.getElementById('btn-toggle-theme');
    const btnBookmark = document.getElementById('btn-bookmark');
    const btnShowBookmarks = document.getElementById('btn-show-bookmarks');
    const bookmarkDropdown = document.getElementById('bookmark-dropdown');
    const bookmarksList = document.getElementById('bookmarks-list');

    // ==========================================================================
    // 2. THEME INITIALIZATION & ACTION
    // ==========================================================================
    const currentTheme = localStorage.getItem('tax_theme') || 'light';
    document.documentElement.setAttribute('data-theme', currentTheme);
    updateThemeIcon(currentTheme);

    btnToggleTheme.addEventListener('click', () => {
        const theme = document.documentElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        localStorage.setItem('tax_theme', theme);
        updateThemeIcon(theme);
    });

    function updateThemeIcon(theme) {
        const icon = btnToggleTheme.querySelector('i');
        if (theme === 'dark') {
            icon.className = 'fa-solid fa-sun';
        } else {
            icon.className = 'fa-solid fa-moon';
        }
    }

    // ==========================================================================
    // 3. BOOKMARK SYSTEM
    // ==========================================================================
    updateBookmarkButtonUI();
    renderBookmarksList();

    btnBookmark.addEventListener('click', () => {
        const isTool = !CHAPTERS_DATA[currentChapter];
        const pageId = currentChapter;
        const pageTitle = isTool ? getToolTitle(pageId) : CHAPTERS_DATA[pageId].title;
        
        const index = bookmarks.findIndex(b => b.id === pageId);
        
        if (index > -1) {
            // Already bookmarked -> remove it
            bookmarks.splice(index, 1);
            btnBookmark.querySelector('i').className = 'fa-regular fa-bookmark';
        } else {
            // Add to bookmarks
            bookmarks.push({ id: pageId, title: pageTitle, isTool: isTool });
            btnBookmark.querySelector('i').className = 'fa-solid fa-bookmark';
        }
        
        localStorage.setItem('tax_bookmarks', JSON.stringify(bookmarks));
        renderBookmarksList();
    });

    btnShowBookmarks.addEventListener('click', (e) => {
        e.stopPropagation();
        bookmarkDropdown.classList.toggle('active');
    });

    document.addEventListener('click', (e) => {
        if (!bookmarkDropdown.contains(e.target) && e.target !== btnShowBookmarks) {
            bookmarkDropdown.classList.remove('active');
        }
    });

    function getToolTitle(id) {
        if (id === 'calculator') return "Simulator PTKP & TER PPh 21";
        if (id === 'withholding') return "Cari Tarif Withholding Tax";
        if (id === 'quiz') return "Uji Kompetensi Perpajakan";
        return "Alat Interaktif";
    }

    function updateBookmarkButtonUI() {
        const hasBookmark = bookmarks.some(b => b.id === currentChapter);
        btnBookmark.querySelector('i').className = hasBookmark ? 'fa-solid fa-bookmark' : 'fa-regular fa-bookmark';
    }

    function renderBookmarksList() {
        bookmarksList.innerHTML = '';
        if (bookmarks.length === 0) {
            bookmarksList.innerHTML = '<li class="empty-msg">Belum ada halaman ditandai</li>';
            return;
        }

        bookmarks.forEach(b => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span>${b.title}</span>
                <button class="delete-bookmark-btn" data-id="${b.id}"><i class="fa-solid fa-trash-can"></i></button>
            `;
            li.addEventListener('click', (e) => {
                if (e.target.closest('.delete-bookmark-btn')) return; // let button handler do it
                navigateToChapter(b.id);
                bookmarkDropdown.classList.remove('active');
            });
            bookmarksList.appendChild(li);
        });

        // Attach delete listeners
        bookmarksList.querySelectorAll('.delete-bookmark-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.stopPropagation();
                const id = btn.getAttribute('data-id');
                // Parse integer if it is chapter number
                const parsedId = isNaN(id) ? id : parseInt(id);
                bookmarks = bookmarks.filter(b => b.id !== parsedId);
                localStorage.setItem('tax_bookmarks', JSON.stringify(bookmarks));
                renderBookmarksList();
                updateBookmarkButtonUI();
            });
        });
    }

    // ==========================================================================
    // 4. NAVIGATION SYSTEM & SIDEBAR TOGGLE
    // ==========================================================================
    // Desktop & Mobile Sidebar Toggle
    sidebarToggleBtn.addEventListener('click', () => {
        appSidebar.classList.add('active');
    });

    sidebarCloseBtn.addEventListener('click', () => {
        appSidebar.classList.remove('active');
    });

    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            e.preventDefault();
            
            navItems.forEach(n => n.classList.remove('active'));
            item.classList.add('active');
            
            // Check if it's a chapter or tool
            const chapterNum = item.getAttribute('data-chapter');
            const toolId = item.getAttribute('data-tool');

            if (chapterNum) {
                navigateToChapter(parseInt(chapterNum));
            } else if (toolId) {
                navigateToChapter(toolId);
            }
            
            // Close mobile sidebar
            appSidebar.classList.remove('active');
        });
    });

    function navigateToChapter(id) {
        currentChapter = id;
        updateBookmarkButtonUI();
        closeSearchResults();
        
        // Hide all chapter blocks in pane
        const chapterSections = chapterPane.querySelectorAll('.chapter-section');
        chapterSections.forEach(sec => sec.classList.add('hidden'));

        if (typeof id === 'number') {
            // Swap standard content chapter
            const targetSection = document.getElementById(`chapter-${id}`);
            if (targetSection) {
                // If it is chapter 1, it's statically rendered
                if (id === 1) {
                    targetSection.classList.remove('hidden');
                } else {
                    // Populate other chapters dynamically
                    targetSection.innerHTML = CHAPTERS_DATA[id].html;
                    targetSection.classList.remove('hidden');
                }
                currentSectionTitle.textContent = CHAPTERS_DATA[id].title;
            }
        } else {
            // Swap interactive tools
            const targetToolSection = document.getElementById(`tool-${id}`);
            if (targetToolSection) {
                targetToolSection.classList.remove('hidden');
                currentSectionTitle.textContent = getToolTitle(id);

                // Run specific tool init logic if needed
                if (id === 'withholding') {
                    initWithholdingFinder();
                } else if (id === 'quiz') {
                    initQuizEngine();
                }
            }
        }
        
        // Scroll content body to top
        contentBody.scrollTop = 0;
        
        // Sync active state in sidebar nav items
        navItems.forEach(n => {
            const chapAttr = n.getAttribute('data-chapter');
            const toolAttr = n.getAttribute('data-tool');
            n.classList.remove('active');
            if (typeof id === 'number' && chapAttr && parseInt(chapAttr) === id) {
                n.classList.add('active');
            } else if (typeof id === 'string' && toolAttr && toolAttr === id) {
                n.classList.add('active');
            }
        });
    }

    // ==========================================================================
    // 5. SEARCH ENGINE
    // ==========================================================================
    // Construct search index from chapters data
    const searchIndex = [];
    
    // Add statically rendered chapter 1 to index
    searchIndex.push({
        chapter: 1,
        title: "Ketentuan Umum & Tata Cara Perpajakan (KUP)",
        header: "Sistem Pemungutan Pajak",
        text: "Self Assessment System, Official Assessment System, Withholding Tax System."
    });
    searchIndex.push({
        chapter: 1,
        title: "Ketentuan Umum & Tata Cara Perpajakan (KUP)",
        header: "Batas Setor & Lapor Pajak",
        text: "Kalender Pajak PPh Masa tanggal 10 dan 20, PPN Masa akhir bulan berikutnya. SPT Tahunan Orang Pribadi 31 Maret, Badan 30 April. Sanksi denda denda terlambat lapor Rp 100 ribu dan Rp 1 juta."
    });

    // Parse dynamic chapters into index
    for (const [id, data] of Object.entries(CHAPTERS_DATA)) {
        if (id === '1') continue; // already added
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = data.html;
        
        const h2Elements = tempDiv.querySelectorAll('h2');
        h2Elements.forEach(h2 => {
            let pText = "";
            let nextEl = h2.nextElementSibling;
            while (nextEl && nextEl.tagName !== 'H2') {
                pText += " " + nextEl.textContent;
                nextEl = nextEl.nextElementSibling;
            }
            searchIndex.push({
                chapter: parseInt(id),
                title: data.title,
                header: h2.textContent,
                text: pText.trim()
            });
        });
    }

    // Input Search Listener
    searchInput.addEventListener('input', () => {
        const query = searchInput.value.trim().toLowerCase();
        if (query.length < 2) {
            closeSearchResults();
            return;
        }

        searchQueryText.textContent = searchInput.value;
        searchResultsPanel.classList.remove('hidden');
        
        const matches = searchIndex.filter(item => 
            item.title.toLowerCase().includes(query) || 
            item.header.toLowerCase().includes(query) || 
            item.text.toLowerCase().includes(query)
        );

        searchResultsList.innerHTML = '';
        if (matches.length === 0) {
            searchResultsList.innerHTML = '<div class="no-results-msg">Tidak ditemukan hasil pencarian yang cocok.</div>';
            return;
        }

        matches.forEach(match => {
            const item = document.createElement('div');
            item.className = 'search-match-item';
            
            // Generate match snippet with highlighted mark
            const rawText = match.text;
            const qIdx = rawText.toLowerCase().indexOf(query);
            let snippet = "";
            if (qIdx > -1) {
                const start = Math.max(0, qIdx - 40);
                const end = Math.min(rawText.length, qIdx + query.length + 60);
                const rawSnippet = rawText.substring(start, end);
                const highlightSnippet = rawSnippet.replace(new RegExp(query, 'gi'), (str) => `<mark>${str}</mark>`);
                snippet = `... ${highlightSnippet} ...`;
            } else {
                snippet = rawText.substring(0, 100) + '...';
            }

            item.innerHTML = `
                <div class="match-chapter">Bab 0${match.chapter} • ${match.header}</div>
                <h4>${match.title}</h4>
                <p class="match-snippet">${snippet}</p>
            `;
            item.addEventListener('click', () => {
                navigateToChapter(match.chapter);
            });
            searchResultsList.appendChild(item);
        });
    });

    btnCloseSearch.addEventListener('click', closeSearchResults);

    function closeSearchResults() {
        searchResultsPanel.classList.add('hidden');
        searchInput.value = '';
    }

    // ==========================================================================
    // 6. CALCULATOR LOGIC (PTKP & TER PPh 21)
    // ==========================================================================
    // Attach listener for calculator button (init happens once on demand or automatically)
    document.addEventListener('click', (e) => {
        if (e.target && e.target.id === 'btn-run-calc') {
            runCalculator();
        }
    });

    const getTerCategory = (ptkp) => {
        const catA = ['TK/0', 'TK/1', 'K/0'];
        const catB = ['TK/2', 'TK/3', 'K/1', 'K/2'];
        const catC = ['K/3'];

        if (catA.includes(ptkp)) return 'A';
        if (catB.includes(ptkp)) return 'B';
        if (catC.includes(ptkp)) return 'C';
        return 'A';
    };

    const getPTKPValue = (ptkp) => {
        const values = {
            'TK/0': 54000000,
            'TK/1': 58500000,
            'K/0': 58500000,
            'TK/2': 63000000,
            'TK/3': 67500000,
            'K/1': 63000000,
            'K/2': 67500000,
            'K/3': 72000000
        };
        return values[ptkp] || 54000000;
    };

    const getTerRate = (category, salary) => {
        if (category === 'A') {
            if (salary <= 5400000) return 0;
            if (salary <= 5650000) return 0.0025;
            if (salary <= 5950000) return 0.005;
            if (salary <= 6300000) return 0.0075;
            if (salary <= 6750000) return 0.01;
            if (salary <= 7500000) return 0.0125;
            if (salary <= 8500000) return 0.015;
            if (salary <= 9650000) return 0.0175;
            if (salary <= 10050000) return 0.02;
            if (salary <= 10350000) return 0.0225;
            if (salary <= 10700000) return 0.025;
            if (salary <= 11050000) return 0.03;
            if (salary <= 11600000) return 0.035;
            if (salary <= 12500000) return 0.04;
            if (salary <= 13750000) return 0.05;
            if (salary <= 15100000) return 0.06;
            if (salary <= 16950000) return 0.07;
            if (salary <= 19100000) return 0.08;
            if (salary <= 21100000) return 0.09;
            if (salary <= 23300000) return 0.10;
            if (salary <= 25300000) return 0.11;
            if (salary <= 29000000) return 0.12;
            if (salary <= 34300000) return 0.13;
            if (salary <= 40000000) return 0.14;
            if (salary <= 46200000) return 0.15;
            if (salary <= 53500000) return 0.16;
            if (salary <= 66200000) return 0.17;
            if (salary <= 84400000) return 0.18;
            if (salary <= 112200000) return 0.19;
            if (salary <= 158100000) return 0.20;
            if (salary <= 224400000) return 0.21;
            if (salary <= 321900000) return 0.22;
            if (salary <= 439700000) return 0.23;
            if (salary <= 595400000) return 0.24;
            if (salary <= 809700000) return 0.25;
            if (salary <= 1033800000) return 0.26;
            if (salary <= 1400000000) return 0.30;
            return 0.34;
        } else if (category === 'B') {
            if (salary <= 6200000) return 0;
            if (salary <= 6500000) return 0.0025;
            if (salary <= 6850000) return 0.005;
            if (salary <= 7300000) return 0.0075;
            if (salary <= 7800000) return 0.01;
            if (salary <= 8550000) return 0.0125;
            if (salary <= 9650000) return 0.015;
            if (salary <= 10050000) return 0.0175;
            if (salary <= 10450000) return 0.02;
            if (salary <= 10900000) return 0.0225;
            if (salary <= 11200000) return 0.025;
            if (salary <= 11850000) return 0.03;
            if (salary <= 12600000) return 0.035;
            if (salary <= 13600000) return 0.04;
            if (salary <= 14950000) return 0.05;
            if (salary <= 16400000) return 0.06;
            if (salary <= 18450000) return 0.07;
            if (salary <= 20800000) return 0.08;
            if (salary <= 23000000) return 0.09;
            if (salary <= 25200000) return 0.10;
            if (salary <= 27400000) return 0.11;
            if (salary <= 31400000) return 0.12;
            if (salary <= 37000000) return 0.13;
            if (salary <= 43100000) return 0.14;
            if (salary <= 49800000) return 0.15;
            if (salary <= 57700000) return 0.16;
            if (salary <= 71400000) return 0.17;
            if (salary <= 91000000) return 0.18; // correctly fixed zero
            if (salary <= 121000000) return 0.19;
            if (salary <= 170500000) return 0.20;
            if (salary <= 242000000) return 0.21;
            if (salary <= 347100000) return 0.22;
            if (salary <= 474000000) return 0.23;
            if (salary <= 641900000) return 0.24;
            if (salary <= 872700000) return 0.25;
            if (salary <= 1114300000) return 0.26;
            if (salary <= 1510000000) return 0.30;
            return 0.34;
        } else if (category === 'C') {
            if (salary <= 6600000) return 0;
            if (salary <= 6950000) return 0.0025;
            if (salary <= 7350000) return 0.005;
            if (salary <= 7800000) return 0.0075;
            if (salary <= 8350000) return 0.01;
            if (salary <= 9050000) return 0.0125;
            if (salary <= 10050000) return 0.015;
            if (salary <= 10550000) return 0.0175;
            if (salary <= 10950000) return 0.02;
            if (salary <= 11350000) return 0.0225;
            if (salary <= 11800000) return 0.025;
            if (salary <= 12500000) return 0.03;
            if (salary <= 13350000) return 0.035;
            if (salary <= 14450000) return 0.04;
            if (salary <= 15900000) return 0.05;
            if (salary <= 17450000) return 0.06;
            if (salary <= 19600000) return 0.07;
            if (salary <= 22100000) return 0.08;
            if (salary <= 24400000) return 0.09;
            if (salary <= 26800000) return 0.10;
            if (salary <= 29100000) return 0.11;
            if (salary <= 33400000) return 0.12;
            if (salary <= 39300000) return 0.13;
            if (salary <= 45800000) return 0.14;
            if (salary <= 52900000) return 0.15;
            if (salary <= 61300000) return 0.16;
            if (salary <= 75900000) return 0.17;
            if (salary <= 96700000) return 0.18;
            if (salary <= 128600000) return 0.19;
            if (salary <= 181200000) return 0.20;
            if (salary <= 257100000) return 0.21;
            if (salary <= 368800000) return 0.22;
            if (salary <= 503600000) return 0.23;
            if (salary <= 682000000) return 0.24;
            if (salary <= 927200000) return 0.25;
            if (salary <= 1183900000) return 0.26;
            if (salary <= 1600000000) return 0.30;
            return 0.34;
        }
        return 0;
    };

    const formatRupiah = (number) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(number);
    };

    function runCalculator() {
        const grossVal = parseFloat(document.getElementById('calc-gross-salary').value);
        const ptkpVal = document.getElementById('calc-ptkp-status').value;

        if (isNaN(grossVal) || grossVal < 0) {
            alert('Masukkan jumlah gaji bruto bulanan yang valid.');
            return;
        }
        if (!ptkpVal) {
            alert('Pilih status PTKP terlebih dahulu.');
            return;
        }

        const category = getTerCategory(ptkpVal);
        const ptkpAmount = getPTKPValue(ptkpVal);
        const rate = getTerRate(category, grossVal);
        const taxPaid = Math.floor(grossVal * rate);

        // Update DOM
        document.getElementById('res-ptkp').textContent = ptkpVal;
        document.getElementById('res-ptkp-val').textContent = formatRupiah(ptkpAmount);
        document.getElementById('res-ter-cat').textContent = `Kategori ${category}`;
        document.getElementById('res-ter-rate').textContent = `${(rate * 100).toFixed(2)}%`;
        document.getElementById('res-tax-amount').textContent = formatRupiah(taxPaid);

        // Switch visible panels
        document.getElementById('calc-empty-state').classList.add('hidden');
        document.getElementById('calc-actual-results').classList.remove('hidden');
    }

    // ==========================================================================
    // 7. WITHHOLDING TAX FINDER ENGINE
    // ==========================================================================
    function initWithholdingFinder() {
        const selectType = document.getElementById('wht-select-type');
        const searchText = document.getElementById('wht-search-text');
        
        // Render initial view
        renderWithholdingCards("ALL", "");

        // Event listeners
        selectType.removeEventListener('change', handleWhtFilter);
        selectType.addEventListener('change', handleWhtFilter);

        searchText.removeEventListener('input', handleWhtFilter);
        searchText.addEventListener('input', handleWhtFilter);
    }

    function handleWhtFilter() {
        const type = document.getElementById('wht-select-type').value;
        const query = document.getElementById('wht-search-text').value.trim().toLowerCase();
        renderWithholdingCards(type, query);
    }

    function renderWithholdingCards(type, query) {
        const grid = document.getElementById('wht-results-grid');
        if (!grid) return;

        grid.innerHTML = '';
        
        const filtered = WITHHOLDING_DATABASE.filter(item => {
            const matchesType = (type === "ALL" || item.type === type);
            const matchesQuery = (
                item.name.toLowerCase().includes(query) || 
                item.desc.toLowerCase().includes(query) ||
                item.rate.toLowerCase().includes(query)
            );
            return matchesType && matchesQuery;
        });

        if (filtered.length === 0) {
            grid.innerHTML = '<div class="no-results-msg" style="grid-column: 1/-1">Tidak ada objek pajak yang sesuai filter.</div>';
            return;
        }

        filtered.forEach(item => {
            const card = document.createElement('div');
            card.className = 'wht-card';
            card.innerHTML = `
                <div class="wht-card-header">
                    <span class="wht-tag">PPh ${item.type}</span>
                    <span class="wht-rate">${item.rate}</span>
                </div>
                <h4>${item.name}</h4>
                <p class="wht-desc">${item.desc}</p>
                <div class="wht-penalty"><i class="fa-solid fa-circle-exclamation"></i> Sanksi: ${item.penalty}</div>
            `;
            grid.appendChild(card);
        });
    }

    // ==========================================================================
    // 8. INTERACTIVE QUIZ ENGINE
    // ==========================================================================
    let quizState = {
        currentIndex: 0,
        score: 0,
        selectedOptionIndex: null,
        answered: false
    };

    function initQuizEngine() {
        // Reset states
        quizState.currentIndex = 0;
        quizState.score = 0;
        quizState.selectedOptionIndex = null;
        quizState.answered = false;

        document.getElementById('quiz-score-indicator').textContent = "Skor: 0";
        renderQuizQuestion();
        
        // Attach action button listeners
        const btnSubmit = document.getElementById('btn-submit-answer');
        const btnNext = document.getElementById('btn-next-question');
        const btnRestart = document.getElementById('btn-restart-quiz');

        btnSubmit.classList.remove('hidden');
        btnNext.classList.add('hidden');
        btnRestart.classList.add('hidden');

        btnSubmit.removeEventListener('click', submitQuizAnswer);
        btnSubmit.addEventListener('click', submitQuizAnswer);

        btnNext.removeEventListener('click', nextQuizQuestion);
        btnNext.addEventListener('click', nextQuizQuestion);

        btnRestart.removeEventListener('click', initQuizEngine);
        btnRestart.addEventListener('click', initQuizEngine);
    }

    function renderQuizQuestion() {
        const qData = QUIZ_QUESTIONS[quizState.currentIndex];
        
        // Update progress UI
        const percent = ((quizState.currentIndex + 1) / QUIZ_QUESTIONS.length) * 100;
        document.getElementById('quiz-progress-fill').style.width = `${percent}%`;
        document.getElementById('quiz-question-count').textContent = `Soal ${quizState.currentIndex + 1} dari ${QUIZ_QUESTIONS.length}`;

        // Question text
        document.getElementById('quiz-question').textContent = qData.question;
        
        // Options list
        const optionsList = document.getElementById('quiz-options-list');
        optionsList.innerHTML = '';

        qData.options.forEach((opt, idx) => {
            const div = document.createElement('div');
            div.className = 'quiz-option';
            div.innerHTML = `
                <div class="quiz-option-radio"></div>
                <span>${opt}</span>
            `;
            div.addEventListener('click', () => {
                if (quizState.answered) return; // disable clicks after submit
                
                // Set state
                quizState.selectedOptionIndex = idx;
                
                // Update active class UI
                optionsList.querySelectorAll('.quiz-option').forEach(el => el.classList.remove('selected'));
                div.classList.add('selected');
            });
            optionsList.appendChild(div);
        });

        // Hide explanation pane
        document.getElementById('quiz-explanation').classList.add('hidden');
    }

    function submitQuizAnswer() {
        if (quizState.selectedOptionIndex === null) {
            alert('Pilih salah satu jawaban terlebih dahulu.');
            return;
        }

        const qData = QUIZ_QUESTIONS[quizState.currentIndex];
        const optionsList = document.getElementById('quiz-options-list');
        const optionsEls = optionsList.querySelectorAll('.quiz-option');

        quizState.answered = true;

        // Visual validation feedback
        if (quizState.selectedOptionIndex === qData.correctIndex) {
            quizState.score += 20;
            optionsEls[quizState.selectedOptionIndex].classList.add('correct');
            document.getElementById('quiz-score-indicator').textContent = `Skor: ${quizState.score}`;
        } else {
            optionsEls[quizState.selectedOptionIndex].classList.add('wrong');
            optionsEls[qData.correctIndex].classList.add('correct');
        }

        // Display explanation
        const explanationPanel = document.getElementById('quiz-explanation');
        document.getElementById('quiz-explanation-text').innerHTML = qData.explanation;
        explanationPanel.classList.remove('hidden');

        // Swap navigation buttons
        document.getElementById('btn-submit-answer').classList.add('hidden');
        
        if (quizState.currentIndex < QUIZ_QUESTIONS.length - 1) {
            document.getElementById('btn-next-question').classList.remove('hidden');
        } else {
            // Last question completed -> show restart options after 1s or immediately
            setTimeout(showQuizEndSummary, 800);
        }
    }

    function nextQuizQuestion() {
        quizState.currentIndex++;
        quizState.selectedOptionIndex = null;
        quizState.answered = false;

        document.getElementById('btn-submit-answer').classList.remove('hidden');
        document.getElementById('btn-next-question').classList.add('hidden');
        
        renderQuizQuestion();
    }

    function showQuizEndSummary() {
        const quizCard = document.getElementById('quiz-card');
        
        // Set quiz-card html structure for completion state
        let greeting = "";
        let icon = "";
        if (quizState.score >= 80) {
            greeting = "Luar biasa! Lo udah menguasai materi pajak dasar dengan sangat baik!";
            icon = "fa-trophy";
        } else if (quizState.score >= 60) {
            greeting = "Cukup bagus! Nilai kelulusan tercapai, tapi masih ada materi yang perlu lo baca lagi.";
            icon = "fa-circle-check";
        } else {
            greeting = "Nilai lo masih kurang, Cuk. Coba baca ulang cheat-sheet perpajakan di Bab 6 ya.";
            icon = "fa-circle-xmark";
        }

        quizCard.innerHTML = `
            <div class="quiz-complete-state">
                <i class="fa-solid ${icon}"></i>
                <h2>Kuis Selesai!</h2>
                <div class="quiz-score-box">
                    <span>Skor Akhir Anda</span>
                    <strong>${quizState.score}</strong>
                </div>
                <p class="quiz-msg">${greeting}</p>
                <button class="btn-primary" id="btn-restart-quiz-inline"><i class="fa-solid fa-rotate-left"></i> Ulangi Kuis</button>
            </div>
        `;

        // Attach listener to new inline restart button
        document.getElementById('btn-restart-quiz-inline').addEventListener('click', () => {
            // Restore quiz-card default structure first
            restoreQuizCardMarkup();
            initQuizEngine();
        });
    }

    function restoreQuizCardMarkup() {
        const quizCard = document.getElementById('quiz-card');
        quizCard.innerHTML = `
            <div class="quiz-question" id="quiz-question">Loading pertanyaan...</div>
            <div class="quiz-options-list" id="quiz-options-list"></div>
            <div class="quiz-explanation hidden" id="quiz-explanation">
                <h4><i class="fa-solid fa-circle-info"></i> Pembahasan Jawaban:</h4>
                <p id="quiz-explanation-text">Pembahasan lengkap kasus...</p>
            </div>
            <div class="quiz-nav">
                <button class="btn-primary" id="btn-submit-answer">Verifikasi Jawaban</button>
                <button class="btn-primary hidden" id="btn-next-question">Soal Selanjutnya <i class="fa-solid fa-arrow-right"></i></button>
                <button class="btn-primary hidden" id="btn-restart-quiz"><i class="fa-solid fa-rotate-left"></i> Ulangi Kuis</button>
            </div>
        `;
    }

});
