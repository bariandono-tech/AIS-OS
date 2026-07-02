import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container footer-container">
        <div className="footer-brand">
          <div className="logo">
            <span className="logo-icon">📊</span>
            <span className="logo-text">Dash<span className="text-gradient">Anggaran</span></span>
          </div>
          <p className="footer-desc">
            Sistem manajemen anggaran modern terintegrasi Google Sheets.
          </p>
        </div>
        <div className="footer-links">
          <div className="link-group">
            <h4>Produk</h4>
            <a href="#">Fitur</a>
            <a href="#">Keamanan</a>
            <a href="#">Harga</a>
          </div>
          <div className="link-group">
            <h4>Perusahaan</h4>
            <a href="#">Tentang Kami</a>
            <a href="#">Kontak</a>
          </div>
        </div>
      </div>
      <div className="footer-bottom text-center">
        <p>&copy; {new Date().getFullYear()} DashAnggaran. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
