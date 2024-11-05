import React, { useState } from 'react'; 
import './Drawer.css';
import ArrowRight from '../../../../assets/img/icons/arrow-right.png';
import ArrowLeft from '../../../../assets/img/icons/arrow-left.png';
import logo from '../../../../assets/img/icons/logo_gray.png';
import conversationIcon from '../../../../assets/img/icons/conversation.png'; // Asegúrate de tener un ícono para Nueva Conversación
import historyIcon from '../../../../assets/img/icons/history.png'; // Asegúrate de tener un ícono para Historia

function Drawer() {
    const [isOpen, setIsOpen] = useState(false);

    const toggleDrawer = () => {
        setIsOpen(!isOpen);
    };

    return (
        <div className={`drawer ${isOpen ? 'open' : ''}`}>
            <button className="drawer-toggle" onClick={toggleDrawer}>
                {isOpen ? <img src={ArrowLeft} alt="Cerrar menú" /> : <img src={ArrowRight} alt="Abrir menú" />}
            </button>
            <div className="drawer-content">
                <img src={logo} alt="Logo" />
                <h2>IAC Assistant</h2>
                <ul>
                    <li><a href=""><img src={conversationIcon} alt="Nueva Conversación" />Nueva Conversación</a></li>
                    <li><a href=""><img src={historyIcon} alt="Historia" />Historial</a></li>
                </ul>
            </div>
        </div>
    );
}

export default Drawer;
