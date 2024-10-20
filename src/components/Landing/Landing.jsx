import React from 'react';
import Header from './Header/Header';
import Footer from './Footer/Footer';
import Main from './Main/Main';
import './Landing.css';

function Landing() {
    return (
        <div className='land-container'>
            <Header />
            <Main />
            <Footer />
        </div>
    )
}

export default Landing
