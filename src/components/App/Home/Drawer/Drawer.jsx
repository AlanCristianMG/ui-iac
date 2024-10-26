import React, { useState } from 'react';
import './Drawer.css';
import ArrowRight from '../../../../assets/img/icons/arrow-right.png'
import ArrowLeft from '../../../../assets/img/icons/arrow-left.png'
import logo from '../../../../assets/img/icons/logo_gray.png'
import home from '../../../../assets/img/icons/home.png'
import settings from '../../../../assets/img/icons/settings.png'
import logout from '../../../../assets/img/icons/logout.png'


function Drawer() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`drawer ${isOpen ? 'open' : ''}`}>
            <button className="drawer-toggle" onClick={toggleDrawer}>
                {isOpen ? <img src={ArrowLeft} alt="" /> : <img src={ArrowRight} alt="" />}
            </button>
            <div className="drawer-content">
                <img src={logo} alt="" />
                <h2>IAC Assistant</h2>
                <ul>
                    <li><a href=""><img src={home} alt="" />Home</a></li>
                    <li><a href=""><img src={settings} alt="" />Settings</a></li>
                    <li className='logout'><a href=""><img src={logout} alt="" />Logout</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Drawer;