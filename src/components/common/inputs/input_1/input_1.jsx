import React from 'react'
import './input_1.css'

function Input_1({text, type, name, placeholder}) {
    return (

        <div className="form__group field">
            <input name={name} type={type} className="form__field" placeholder={placeholder} required/>
            <label htmlFor={name} className="form__label">{text}</label>
        </div>


    )
}

export default Input_1
