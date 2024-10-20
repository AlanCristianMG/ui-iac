import React from 'react'
import './input_1.css'

function Input_1({text, type, name, placeholder}) {
    return (

        <div class="form__group field">
            <input name={name} type={type} class="form__field" placeholder={placeholder} required/>
            <label for={name} class="form__label">{text}</label>
        </div>


    )
}

export default Input_1
