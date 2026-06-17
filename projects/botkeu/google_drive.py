import os
import io
from pathlib import Path
import pandas as pd
from google.oauth2 import service_account
from googleapiclient.discovery import build
from googleapiclient.http import MediaIoBaseDownload
import config

# Paths
BASE_DIR = Path(__file__).resolve().parent
SERVICE_ACCOUNT_FILE = config.SERVICE_ACCOUNT_PATH
FOLDER_ID = config.GOOGLE_DRIVE_FOLDER_ID

# Create a local tmp download directory inside workspace to conform to workspace rules
TMP_DOWNLOAD_DIR = BASE_DIR / "tmp_downloads"
TMP_DOWNLOAD_DIR.mkdir(exist_ok=True)

def get_drive_service():
    """Initializes and returns the Google Drive API service client."""
    if not SERVICE_ACCOUNT_FILE.exists():
        raise FileNotFoundError(f"Service account file key json tidak ditemukan di: {SERVICE_ACCOUNT_FILE.resolve()}. Silakan letakkan file service account key tersebut di folder proyek.")
        
    credentials = service_account.Credentials.from_service_account_file(
        str(SERVICE_ACCOUNT_FILE),
        scopes=['https://www.googleapis.com/auth/drive.readonly']
    )
    return build('drive', 'v3', credentials=credentials)

def list_excel_files() -> str:
    """
    Menampilkan daftar file Excel (.xlsx, .xls) di dalam folder Google Drive yang ditentukan.
    
    Returns:
        String daftar file berserta ID-nya.
    """
    try:
        service = get_drive_service()
    except Exception as e:
        return f"Error menginisialisasi Google Drive API: {e}"
        
    if not FOLDER_ID:
        return "GOOGLE_DRIVE_FOLDER_ID belum dikonfigurasi di file .env."
        
    query = f"'{FOLDER_ID}' in parents and (mimeType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' or mimeType = 'application/vnd.ms-excel') and trashed = false"
    
    try:
        results = service.files().list(
            q=query,
            spaces='drive',
            fields='files(id, name, modifiedTime)',
            pageSize=20
        ).execute()
        files = results.get('files', [])
        
        if not files:
            return "Tidak ditemukan file Excel di folder Google Drive yang ditentukan."
            
        lines = ["=== BERKAS EXCEL KEUANGAN DI GOOGLE DRIVE ==="]
        for f in files:
            lines.append(f"- Nama: {f['name']} | ID: {f['id']} | Diubah: {f['modifiedTime']}")
        return "\n".join(lines)
    except Exception as e:
        return f"Gagal mengambil daftar file dari Google Drive: {e}"

def download_excel_file(file_id: str) -> str:
    """
    Mengunduh file Excel dari Google Drive ke folder lokal tmp_downloads di workspace.
    
    Args:
        file_id: ID File di Google Drive.
        
    Returns:
        Path lokal hasil unduhan atau pesan error jika gagal.
    """
    try:
        service = get_drive_service()
        # Dapatkan nama file terlebih dahulu
        file_metadata = service.files().get(fileId=file_id, fields='name').execute()
        filename = file_metadata.get('name', 'downloaded_file.xlsx')
        
        # Simpan di workspace local folder
        dest_path = TMP_DOWNLOAD_DIR / filename
        
        request = service.files().get_media(fileId=file_id)
        fh = io.BytesIO()
        downloader = MediaIoBaseDownload(fh, request)
        done = False
        while done is False:
            status, done = downloader.next_chunk()
            
        # Simpan byte stream ke file lokal
        with open(dest_path, 'wb') as f:
            f.write(fh.getvalue())
            
        return str(dest_path.resolve())
    except Exception as e:
        return f"ERROR_DOWNLOAD: Gagal mengunduh file {file_id}. Detail: {e}"

def read_excel_sheets(local_file_path: str) -> str:
    """
    Membaca daftar nama sheet yang tersedia di dalam file Excel lokal.
    
    Args:
        local_file_path: Path lokal file Excel.
        
    Returns:
        String daftar nama sheet.
    """
    try:
        xl = pd.ExcelFile(local_file_path)
        sheets = xl.sheet_names
        lines = [f"File: {Path(local_file_path).name}", "Lembar kerja (Sheet) yang tersedia:"]
        for idx, sheet in enumerate(sheets, 1):
            lines.append(f"{idx}. {sheet}")
        return "\n".join(lines)
    except Exception as e:
        return f"Error membaca sheet Excel: {e}"

def query_excel_data(local_file_path: str, sheet_name: str, nrows: int = 50) -> str:
    """
    Membaca baris data pada sheet tertentu di file Excel lokal dan memformatnya sebagai markdown tabel.
    
    Args:
        local_file_path: Path lokal file Excel.
        sheet_name: Nama sheet yang ingin dibaca.
        nrows: Batas jumlah baris yang dibaca untuk menghemat token LLM.
        
    Returns:
        String markdown berisi tabel data Excel.
    """
    try:
        # Load the excel sheet
        df = pd.read_excel(local_file_path, sheet_name=sheet_name, nrows=nrows)
        
        # Bersihkan spasi di nama kolom
        df.columns = [str(col).strip() for col in df.columns]
        
        # Isi NaN dengan string kosong atau strip
        df = df.fillna("")
        
        row_count = len(df)
        col_names = list(df.columns)
        
        # Format ke bentuk string sederhana atau markdown table
        # Jika library tabulate tidak terinstal, kita gunakan format CSV sederhana agar aman
        try:
            md_table = df.to_markdown(index=False)
        except ImportError:
            # Fallback jika tabulate tidak terpasang
            md_table = df.to_csv(index=False, sep="|")
            
        result = [
            f"=== DATA EXCEL SHEET: {sheet_name} ===",
            f"Total Baris Terbaca: {row_count}",
            f"Kolom: {', '.join(col_names)}",
            "\n" + md_table
        ]
        return "\n".join(result)
    except Exception as e:
        return f"Error membaca data sheet '{sheet_name}': {e}"
