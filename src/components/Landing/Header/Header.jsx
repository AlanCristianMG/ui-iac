import React, { useState, useEffect } from 'react';
import './Header.css';
import facebookIcon from '../../../assets/img/icons/facebook.png';
import githubIcon from '../../../assets/img/icons/github.png';
import gmailIcon from '../../../assets/img/icons/gmail-logo.png';
import instagramIcon from '../../../assets/img/icons/instagram.png';
import logoIcon from '../../../assets/img/icons/logo_green.png';

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => setWindowWidth(window.innerWidth);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const closeMenu = () => {
    if (windowWidth < 770) {
      setIsMenuOpen(false);
    }
  };

  return (
    <header className='animate__animated animate__bounceInLeft animate_faster'>
      <nav className={isMenuOpen ? 'open' : ''}>
        <div className="nav-wrapper">
          <div className="logo">
            <img src={logoIcon} alt="Company Logo" />
          </div>
          <button className="menu-toggle" onClick={toggleMenu}>
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>
        <div className={`nav-content ${isMenuOpen ? 'show' : ''}`}>
          <div className="link-sections">
            <div className="section">
              <a href="#home" className="home" onClick={closeMenu}>Home Edited</a>
            </div>
            <div className="section">
              <a href="#about" className="about" onClick={closeMenu}>About Us</a>
            </div>
            <div className="section">
              <a href="#contact" className="contact" onClick={closeMenu}>Contact</a>
            </div>
          </div>
          <div className="social">
            <a className='animate__animated animate__backInRight animate__fast'
              href="https://www.instagram.com" aria-label="Instagram" target="_blank" rel="noopener noreferrer">
              <img src={instagramIcon} alt="Instagram" />
            </a>
            <a className='animate__animated animate__backInRight animate__fast'
              href="https://www.facebook.com" aria-label="Facebook" target="_blank" rel="noopener noreferrer">
              <img src={facebookIcon} alt="Facebook" />
            </a>
            <a className='animate__animated animate__backInRight animate__fast'
              href="https://www.github.com" aria-label="GitHub" target="_blank" rel="noopener noreferrer">
              <img src={githubIcon} alt="GitHub" />
            </a>
            <a  className='animate__animated animate__backInRight animate__fast'  
              href="mailto:example@gmail.com" aria-label="Gmail">
              <img src={gmailIcon} alt="Gmail" />
            </a>
          </div>
        </div>
      </nav>
    </header>
  );
};

export default Header;
