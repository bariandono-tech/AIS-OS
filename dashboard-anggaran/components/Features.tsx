import React from 'react';
import './Features.css';

const Features = () => {
  const features = [
    {
      title: "Sinkronisasi Dua Arah",
      description: "Data yang diubah di web akan langsung terupdate di Google Sheets, dan sebaliknya. Tidak perlu entri data ganda.",
      icon: "🔄"
    },
    {
      title: "PostgreSQL by Supabase",
      description: "Aman, terstruktur, dan super cepat. Backend menggunakan Supabase untuk memastikan data anggaran Anda tidak pernah corrupt.",
      icon: "⚡"
    },
    {
      title: "Pemantauan Real-time",
      description: "Dashboard langsung memperbarui grafik saat ada pengeluaran atau pemasukan baru yang diinput oleh tim Anda.",
      icon: "📈"
    }
  ];

  return (
    <section id="fitur" className="features">
      <div className="container">
        <div className="features-header text-center animate-fade-up">
          <h2 className="section-title">Mengapa Memilih <span className="text-gradient">DashAnggaran</span>?</h2>
          <p className="section-subtitle">Kelemahan spreadsheet manual sudah kami atasi.</p>
        </div>
        
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className={`feature-card glass-panel animate-fade-up delay-${index + 1}`}>
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-desc">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
