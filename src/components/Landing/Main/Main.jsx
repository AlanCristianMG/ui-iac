import React, { useEffect } from 'react';
import './Main.css';
import Card_1 from '../../common/card_1/Card_1';
import Logo_g from '../../../assets/img/icons/logo_gray.png';
import Logo from '../../../assets/img/icons/logo.png';
import world from '../../../assets/img/tech/world.png';
import Computer from '../../common/computer/Computer';

function Main() {
  let data = {
    text: "Discover IAC, your intelligent virtual assistant that understands your needs and responds with precision. Boost your productivity with the power of the most advanced language models on the market, while enjoying a unique and personalized experience. Make every interaction count with IAC!",
    whoWeAre: "At IAC Voice, we are a team passionate about technology and artificial intelligence, dedicated to revolutionizing how you interact with the digital world. We design innovative virtual assistant solutions to simplify your life and take your productivity to the next level. Connect with the future and transform your everyday with IAC Voice!",
    mision: "Develop, manage and create innovative multi-platform software solutions that incorporate artificial intelligence to improve interaction with technology and user experience.",
    vision: "To become global leaders in the development of accessible intelligent software, integrating advanced AI with a positive impact on the lives of our users.",
    valores: ["Colaboración", "Adaptabilidad", "Compromiso", "Seguridad", "Responsabilidad", "Ética"],
  };

  useEffect(() => {
    const elementsToAnimate = document.querySelectorAll('.animate-on-scroll');
  
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if (entry.target.classList.contains('vision')) {
            entry.target.classList.add('animate__animated', 'animate__fadeInRight');
          } else {
            entry.target.classList.add('animate__animated', 'animate__fadeInLeft');
          }
          observer.unobserve(entry.target); 
        }
      });
    }, {
      threshold: 0.0001
    });
  
    elementsToAnimate.forEach((element) => {
      observer.observe(element);
    });
  
    return () => observer.disconnect(); // Limpiar el observer al desmontar el componente
  }, []);
  

  return (
    <main>
      <div className="brand-text">
        <h1 className='animate__animated animate__slideInLeft animate__faster'>IAC</h1>
        <h1 className='animate__animated animate__slideInLeft'>VIRTUAL</h1>
        <h1 className='animate__animated animate__slideInLeft'>ASISSTANT</h1>
        <div className="brand-info animate__animated animate__rotateInUpLeft">
          <Card_1
            text={data.text}
            textButton={"Start now!"}
            target={"/auth"}
          />
        </div>
      </div>
      <div className="brand-img">
        <div className="bg-shape animate__animated animate__bounceInRight">
          <div className="card-img">
            <img src={Logo_g} alt="" />
            <div className="talkbubble"></div>
          </div>
        </div>
      </div>
      <div className="main-sections">
        <h1>We are IAC</h1>
        <p>{data.whoWeAre}</p>
        <img src={Logo} alt="" />
        <section id='about'>
          <div className="mision animate-on-scroll">
            <h1>We have the mission of: </h1>
            <p>{data.mision}</p>
            <Computer />
          </div>
          <div className="vision animate-on-scroll">
            <h1>And the vision of: </h1>
            <p>{data.vision}</p>
            <img src={world} alt="" />
          </div>
          <div className="values animate-on-scroll">
            <h1>Our values: </h1>
            <div className="valores">
              {data.valores.map((valor, index) => (
                <div key={index} className="val">{valor}</div>
              ))}
            </div>
          </div>
        </section>
        <section id='contact'>
          <h1>Contact us</h1>
          <form action="">
            <div className="inp">
              <input type="text" placeholder='Write your name' />
              <input type="email" placeholder='Write your email'/>
              <button>Send</button>
            </div>
            <textarea name="" id="" placeholder='Say hello!'></textarea>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Main;
