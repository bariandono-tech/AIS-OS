import logging
from telegram import Update
from telegram.ext import ApplicationBuilder, ContextTypes, CommandHandler, MessageHandler, filters
import config
import ai_agent

# Konfigurasi Logging
logging.basicConfig(
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    level=logging.INFO
)
logger = logging.getLogger(__name__)

# Menyimpan riwayat chat per pengguna di memori ram (In-Memory)
# key: user_id (int), value: chat_history (list)
sessions = {}

def check_access(user_id: int) -> bool:
    """Memvalidasi apakah ID pengguna terdaftar di whitelist .env."""
    return user_id in config.ALLOWED_USERS

async def start(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Mengirim pesan pembuka saat pengguna mengetik /start."""
    user = update.effective_user
    if not check_access(user.id):
        logger.warning(f"Akses tidak sah dicoba oleh User ID: {user.id} (@{user.username})")
        await update.message.reply_text("Maaf, Anda tidak terdaftar sebagai pengguna botkeu. Hubungi administrator.")
        return
        
    logger.info(f"User sah memulai chat: User ID {user.id} (@{user.username})")
    await update.message.reply_text(
        f"Halo {user.first_name}! Saya **botkeu**, asisten keuangan kantor Anda.\n\n"
        "Saya bisa membantu Anda mencari aturan/SOP kantor lokal atau memproses data Excel anggaran di Google Drive.\n\n"
        "Silakan kirimkan pertanyaan Anda!"
    )

async def handle_message(update: Update, context: ContextTypes.DEFAULT_TYPE) -> None:
    """Memproses semua pesan teks dari pengguna sah dan mengirimkannya ke Gemini."""
    user = update.effective_user
    user_id = user.id
    
    if not check_access(user_id):
        logger.warning(f"Pesan ditolak dari User ID tidak sah: {user_id} (@{user.username})")
        await update.message.reply_text("Akses ditolak. ID Telegram Anda tidak terdaftar di sistem.")
        return
        
    user_text = update.message.text
    logger.info(f"Pesan diterima dari User ID {user_id}: {user_text}")
    
    # Beri indikasi ke Telegram bahwa bot sedang mengetik jawaban
    await context.bot.send_chat_action(chat_id=update.effective_chat.id, action="typing")
    
    # Ambil atau inisialisasi riwayat chat user
    if user_id not in sessions:
        sessions[user_id] = []
        
    # Panggil Gemini untuk memproses pertanyaan beserta riwayatnya
    try:
        reply_text, updated_history = ai_agent.ask_gemini(user_text, sessions[user_id])
        # Batasi riwayat chat maksimal 20 pertukaran agar tidak membebani memori
        sessions[user_id] = updated_history[-20:]
    except Exception as e:
        logger.error(f"Error memproses pesan via Gemini: {e}")
        reply_text = f"Terjadi kesalahan saat memproses permintaan Anda: {e}"
        
    # Kirim balasan ke Telegram
    try:
        await update.message.reply_text(reply_text, parse_mode="Markdown")
    except Exception as telegram_error:
        # Fallback jika markdown hasil Gemini mengandung karakter ilegal bagi Telegram parser
        logger.warning(f"Gagal mengirim dalam parse_mode Markdown, mengirim teks biasa. Detail: {telegram_error}")
        await update.message.reply_text(reply_text)

def main():
    """Menjalankan botkeu."""
    print("Memulai inisialisasi botkeu...")
    
    # Validasi file konfigurasi di awal startup
    if not config.validate_config():
        print("Error: Konfigurasi lingkungan .env tidak lengkap. Program dihentikan.")
        return
        
    # Inisialisasi Aplikasi Telegram Bot
    application = ApplicationBuilder().token(config.TELEGRAM_TOKEN).build()
    
    # Pasang handler untuk perintah dan pesan teks
    application.add_handler(CommandHandler("start", start))
    application.add_handler(MessageHandler(filters.TEXT & ~filters.COMMAND, handle_message))
    
    # Jalankan bot dengan polling
    print("Botkeu berhasil berjalan. Menunggu pesan masuk...")
    application.run_polling()

if __name__ == "__main__":
    main()
