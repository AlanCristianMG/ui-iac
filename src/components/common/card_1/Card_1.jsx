import React from 'react'
import './Card_1.css'

function Card_1({text,textButton, onClick, target}) {
    return (
        /* From Uiverse.io by alexruix */
        <div className="card_1">
            <div className="card_1-details">
                <p className="card_1-text-body">{text}</p>
            </div>
            <a href={target}>
            <button className="card_1-button" onClick={onClick}>{textButton}</button>
            </a>
        </div>
    )
}

export default Card_1
