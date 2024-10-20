import React from 'react';
import './Card_1.css';
import { useNavigate } from 'react-router-dom';

function Card_1({ text, textButton, target }) {
    const navigate = useNavigate();

    const handleNavigate = (target) => {
        navigate(target);
    };

    return (
        <div className="card_1">
            <div className="card_1-details">
                <p className="card_1-text-body">{text}</p>
            </div>
            <button
                className="card_1-button"
                onClick={() => handleNavigate(target)}
            >
                {textButton}
            </button>
        </div>
    );
}

export default Card_1;
