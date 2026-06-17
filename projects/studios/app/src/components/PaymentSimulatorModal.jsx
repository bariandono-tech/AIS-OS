import { useState, useEffect } from "react";

export default function PaymentSimulatorModal({ 
  stack, 
  user, 
  onSuccess, 
  onClose 
}) {
  const [paymentMethod, setPaymentMethod] = useState("va"); // 'va' | 'qris' | 'gopay'
  const [selectedBank, setSelectedBank] = useState("bca"); // 'bca' | 'mandiri' | 'bni'
  const [copied, setCopied] = useState(false);
  const [timeLeft, setTimeLeft] = useState(900); // 15 minutes
  const [isProcessing, setIsProcessing] = useState(false);

  // Formatting countdown timer MM:SS
  useEffect(() => {
    if (timeLeft <= 0) return;
    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleCopyVA = () => {
    const vaNumber = selectedBank === "bca" ? "89108123456789" : selectedBank === "mandiri" ? "89108987654321" : "89108555544433";
    navigator.clipboard.writeText(vaNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSimulatePayment = async (status) => {
    if (status === "fail") {
      alert("Simulasi: Pembayaran dibatalkan/gagal.");
      onClose();
      return;
    }

    setIsProcessing(true);
    // Simulate network delay
    setTimeout(async () => {
      try {
        await onSuccess();
      } catch (err) {
        alert("Simulasi pembayaran sukses gagal dieksekusi: " + err.message);
      } finally {
        setIsProcessing(false);
      }
    }, 1500);
  };

  const vaNumber = selectedBank === "bca" ? "89108123456789" : selectedBank === "mandiri" ? "89108987654321" : "89108555544433";

  return (
    <div className="payment-modal-overlay">
      <div className="payment-modal animate-in" id="payment-gateway-modal">
        {isProcessing ? (
          <div className="payment-modal__processing">
            <div className="payment-modal__spinner"></div>
            <h3>Memverifikasi Pembayaran...</h3>
            <p>Sistem sedang memverifikasi transaksi simulasi Anda.</p>
          </div>
        ) : (
          <>
            {/* Modal Header */}
            <div className="payment-modal__header">
              <div className="payment-modal__logo-brand">
                <span>⚡</span> StudiOS Pay
              </div>
              <button className="payment-modal__close-btn" onClick={onClose} id="btn-close-payment">
                &times;
              </button>
            </div>

            {/* Modal Info Row */}
            <div className="payment-modal__info-row">
              <div className="payment-modal__info-item">
                <span className="payment-modal__info-label">TOTAL PEMBAYARAN</span>
                <span className="payment-modal__info-value">Rp 49.000</span>
              </div>
              <div className="payment-modal__info-item" style={{ textAlign: "right" }}>
                <span className="payment-modal__info-label">BATAS PEMBAYARAN</span>
                <span className="payment-modal__info-value payment-modal__info-value--timer">
                  ⏳ {formatTime(timeLeft)}
                </span>
              </div>
            </div>

            <div className="payment-modal__details-box">
              <span className="payment-modal__details-title">Order ID: STK-{stack.id.substring(0, 8).toUpperCase()}</span>
              <span className="payment-modal__details-subtitle">Materi: {stack.title}</span>
            </div>

            {/* Payment Method Selector */}
            <div className="payment-modal__tabs">
              <button 
                className={`payment-modal__tab ${paymentMethod === "va" ? "payment-modal__tab--active" : ""}`}
                onClick={() => setPaymentMethod("va")}
              >
                Virtual Account
              </button>
              <button 
                className={`payment-modal__tab ${paymentMethod === "qris" ? "payment-modal__tab--active" : ""}`}
                onClick={() => setPaymentMethod("qris")}
              >
                QRIS
              </button>
              <button 
                className={`payment-modal__tab ${paymentMethod === "gopay" ? "payment-modal__tab--active" : ""}`}
                onClick={() => setPaymentMethod("gopay")}
              >
                GoPay
              </button>
            </div>

            {/* Content for Virtual Account */}
            {paymentMethod === "va" && (
              <div className="payment-modal__content">
                <div className="payment-modal__bank-selector">
                  <button 
                    className={`payment-modal__bank-btn ${selectedBank === "bca" ? "payment-modal__bank-btn--active" : ""}`}
                    onClick={() => setSelectedBank("bca")}
                  >
                    BCA
                  </button>
                  <button 
                    className={`payment-modal__bank-btn ${selectedBank === "mandiri" ? "payment-modal__bank-btn--active" : ""}`}
                    onClick={() => setSelectedBank("mandiri")}
                  >
                    Mandiri
                  </button>
                  <button 
                    className={`payment-modal__bank-btn ${selectedBank === "bni" ? "payment-modal__bank-btn--active" : ""}`}
                    onClick={() => setSelectedBank("bni")}
                  >
                    BNI
                  </button>
                </div>
                <div className="payment-modal__va-box">
                  <div className="payment-modal__va-num-container">
                    <span className="payment-modal__va-label">NOMOR VIRTUAL ACCOUNT</span>
                    <span className="payment-modal__va-number" id="va-number-display">{vaNumber}</span>
                  </div>
                  <button className="payment-modal__copy-btn" onClick={handleCopyVA}>
                    {copied ? "Tersalin!" : "Salin"}
                  </button>
                </div>
                <ul className="payment-modal__instructions">
                  <li>Pilih menu <strong>Transfer ➔ Virtual Account</strong> di ATM atau m-Banking Anda.</li>
                  <li>Masukkan nomor Virtual Account di atas.</li>
                  <li>Pastikan nama tagihan adalah <strong>StudiOS - {stack.title}</strong>.</li>
                </ul>
              </div>
            )}

            {/* Content for QRIS */}
            {paymentMethod === "qris" && (
              <div className="payment-modal__content" style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
                <div className="payment-modal__qris-wrapper">
                  <svg width="180" height="180" viewBox="0 0 100 100" style={{ background: "#fff", padding: "10px", borderRadius: "12px" }}>
                    {/* Mock QR graphic */}
                    <rect x="10" y="10" width="25" height="25" fill="#000" />
                    <rect x="15" y="15" width="15" height="15" fill="#fff" />
                    <rect x="18" y="18" width="9" height="9" fill="#000" />

                    <rect x="65" y="10" width="25" height="25" fill="#000" />
                    <rect x="70" y="15" width="15" height="15" fill="#fff" />
                    <rect x="73" y="18" width="9" height="9" fill="#000" />

                    <rect x="10" y="65" width="25" height="25" fill="#000" />
                    <rect x="15" y="70" width="15" height="15" fill="#fff" />
                    <rect x="18" y="73" width="9" height="9" fill="#000" />

                    <rect x="45" y="45" width="10" height="10" fill="#000" />
                    <rect x="60" y="45" width="15" height="5" fill="#000" />
                    <rect x="45" y="60" width="5" height="15" fill="#000" />
                    <rect x="60" y="60" width="15" height="15" fill="#000" />
                    <rect x="70" y="70" width="5" height="5" fill="#fff" />
                    
                    <rect x="40" y="10" width="15" height="5" fill="#000" />
                    <rect x="45" y="20" width="5" height="15" fill="#000" />
                    <rect x="10" y="45" width="15" height="5" fill="#000" />
                    <rect x="20" y="55" width="5" height="5" fill="#000" />
                  </svg>
                  <div className="payment-modal__qris-scan-line"></div>
                </div>
                <p className="payment-modal__instruction-text" style={{ marginTop: "12px", textAlign: "center" }}>
                  Pindai QR Code di atas menggunakan aplikasi e-Wallet atau m-Banking Anda.
                </p>
              </div>
            )}

            {/* Content for GoPay */}
            {paymentMethod === "gopay" && (
              <div className="payment-modal__content" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "180px" }}>
                <div className="payment-modal__gopay-logo">
                  Go<span>Pay</span>
                </div>
                <p className="payment-modal__instruction-text" style={{ textAlign: "center", maxWidth: "280px" }}>
                  Anda akan diarahkan secara otomatis ke aplikasi Gojek di ponsel Anda untuk menyelesaikan pembayaran.
                </p>
              </div>
            )}

            {/* Simulation controls */}
            <div className="payment-modal__simulator-controls">
              <span className="payment-modal__simulator-tag">PILIHAN SIMULASI</span>
              <div className="payment-modal__action-buttons">
                <button 
                  className="payment-modal__btn-success"
                  onClick={() => handleSimulatePayment("success")}
                  id="btn-simulate-pay-success"
                >
                  🟢 Simulasi Bayar Sukses
                </button>
                <button 
                  className="payment-modal__btn-fail"
                  onClick={() => handleSimulatePayment("fail")}
                  id="btn-simulate-pay-fail"
                >
                  🔴 Batalkan / Gagal
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
