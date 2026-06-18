# SIMKIM — Sistem Informasi Manajemen Keimigrasian

## Definisi
SIMKIM adalah sistem teknologi informasi dan komunikasi yang dikembangkan oleh Direktorat Jenderal Imigrasi untuk mengintegrasikan seluruh data keimigrasian nasional Indonesia. Berdasarkan Pasal 1 angka 31 UU Nomor 6 Tahun 2011, SIMKIM digunakan untuk mengumpulkan, mengolah, dan menyajikan informasi guna mendukung pelayanan dan pengawasan keimigrasian.

## Arsitektur
- **Basis Data Terpusat** (*centralized database*) di server Ditjenim Jakarta
- Koneksi *real-time* ke seluruh UPT: Kantor Imigrasi, TPI, dan Rudenim di Indonesia
- Dikembangkan dan dipelihara oleh Pusdatin Ditjenim

## Modul-Modul di Rudenim
| Modul | Fungsi |
|-------|--------|
| **Pendataan Deteni** | Input biodata, foto wajah, sidik jari |
| **Pengawasan & Cekal** | Pencocokan biometrik vs database cekal nasional |
| **Manifest & Pelaporan** | Data aktual jumlah/status deteni per blok |
| **Deportasi** | Pencatatan proses pengeluaran, SKPD, status akhir |

## Kendala Umum di UPT Daerah
1. Gangguan koneksi jaringan ke server pusat (*latency*)
2. Perangkat keras usang (scanner, kamera)
3. Pencatatan ganda (*double entry*) — logbook fisik vs SIMKIM
4. Rotasi pegawai tanpa pelatihan memadai

## Referensi Terkait
- [[Source_Makalah_SIM]] — Analisis penerapan SIMKIM di Rudenim Pontianak
- [[Leavitt_Diamond_Model]] — Kerangka teori analisis
