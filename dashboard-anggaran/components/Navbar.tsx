import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <header className="navbar glass-panel">
      <div className="container nav-container">
        <div className="logo">
          <span className="logo-icon">📊</span>
          <span className="logo-text">Dash<span className="text-gradient">Anggaran</span></span>
        </div>
        <nav className="nav-links">
          <a href="#fitur">Fitur</a>
          <a href="#keunggulan">Keunggulan</a>
          <a href="#cara-kerja">Cara Kerja</a>
        </nav>
        <div className="nav-actions">
          <button className="btn-primary">Masuk</button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
