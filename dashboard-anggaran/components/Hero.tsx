import React from 'react';
import './Hero.css';

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-background">
        <div className="glow glow-1"></div>
        <div className="glow glow-2"></div>
      </div>
      <div className="container hero-container text-center">
        <div className="hero-badge animate-fade-up">
          <span className="badge-dot"></span>
          V1.0 Sinkronisasi Real-time
        </div>
        <h1 className="hero-title animate-fade-up delay-1">
          Kelola Anggaran dengan Lebih Cerdas,<br/>
          <span className="text-gradient">Sinkron dengan Google Sheets</span>
        </h1>
        <p className="hero-subtitle animate-fade-up delay-2">
          Platform modern untuk manajemen anggaran. Didukung oleh kecepatan Supabase dan fleksibilitas Google Sheets. Tanpa ribet, data aman, dan selalu up-to-date.
        </p>
        <div className="hero-actions animate-fade-up delay-3">
          <button className="btn-primary btn-lg">Mulai Sekarang</button>
          <button className="btn-secondary btn-lg">Pelajari Lebih Lanjut</button>
        </div>
        
        <div className="hero-dashboard-preview animate-fade-up delay-3 glass-panel">
          <div className="browser-mockup">
            <div className="browser-dots">
              <span></span><span></span><span></span>
            </div>
            <div className="browser-url">dashboard.anggaran.app</div>
          </div>
          <div className="preview-content">
            <div className="preview-chart">
               {/* Placeholder for chart visualization */}
               <div className="chart-bar" style={{height: '60%'}}></div>
               <div className="chart-bar" style={{height: '80%', background: 'var(--accent-primary)'}}></div>
               <div className="chart-bar" style={{height: '40%'}}></div>
               <div className="chart-bar" style={{height: '90%'}}></div>
               <div className="chart-bar" style={{height: '70%'}}></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
