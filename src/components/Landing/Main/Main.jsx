import React, { useEffect } from 'react';
import './Main.css';
import Card_1 from '../../common/card_1/Card_1';
import Logo_g from '../../../assets/img/icons/logo_gray.png';
import Logo from '../../../assets/img/icons/logo.png';
import world from '../../../assets/img/tech/world.png';
import Computer from '../../common/computer/Computer';

function Main() {
  let data = {
    text: "Descubre IAC, tu asistente virtual inteligente que entiende tus necesidades y responde con precisión. Aumenta tu productividad con el poder de los modelos de lenguaje más avanzados del mercado, mientras disfrutas de una experiencia única y personalizada. ¡Haz que cada interacción cuente con IAC!",
    whoWeAre: "En IAC Voice, somos un equipo apasionado por la tecnología y la inteligencia artificial, dedicado a revolucionar cómo interactúas con el mundo digital. Diseñamos soluciones innovadoras de asistentes virtuales para simplificar tu vida y llevar tu productividad al siguiente nivel. ¡Conéctate con el futuro y transforma tu día a día con IAC Voice!",
    mision: "Desarrollar, gestionar y crear soluciones innovadoras de software multiplataforma que incorporen inteligencia artificial para mejorar la interacción con la tecnología y la experiencia del usuario.",
    vision: "Convertirnos en líderes globales en el desarrollo de software inteligente accesible, integrando inteligencia artificial avanzada con un impacto positivo en la vida de nuestros usuarios.",
    valores: ["Colaboración", "Adaptabilidad", "Compromiso", "Seguridad", "Responsabilidad", "Ética"],
  };

  useEffect(() => {
    const elementosAnimar = document.querySelectorAll('.animate-on-scroll');

    const observer = new IntersectionObserver((entradas) => {
      entradas.forEach(entrada => {
        if (entrada.isIntersecting) {
          if (entrada.target.classList.contains('vision')) {
            entrada.target.classList.add('animate__animated', 'animate__fadeInRight');
          } else {
            entrada.target.classList.add('animate__animated', 'animate__fadeInLeft');
          }
          observer.unobserve(entrada.target);
        }
      });
    }, {
      threshold: 0.0001
    });

    elementosAnimar.forEach((elemento) => {
      observer.observe(elemento);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <main>
      <div className="cont-land">
        <div className="brand-text">
          <h1 className='title animate__animated animate__slideInLeft animate__faster'>IAC</h1>
          <h1 className='title animate__animated animate__slideInLeft'>VIRTUAL</h1>
          <h1 className='title animate__animated animate__slideInLeft'>ASISTENTE</h1>
          <div className="brand-info animate__animated animate__rotateInUpLeft">
            <Card_1
              text={data.text}
              textButton={"¡Comienza ahora!"}
              target={"/auth"}
            />
          </div>
        </div>
        <div className="brand-img">
          <div className="bgl-shape animate__animated animate__bounceInRight">
            <div className="card-img">
              <img src={Logo_g} alt="" />
              <div className="talkbubble"></div>
            </div>
          </div>
        </div>
      </div>
      <div className="main-sections">
        <h1>Somos IAC</h1>
        <p>{data.whoWeAre}</p>
        <img src={Logo} alt="" />
        <section id='about'>
          <div className="mision animate-on-scroll">
            <h1>Tenemos la misión de: </h1>
            <p>{data.mision}</p>
            <Computer />
          </div>
          <div className="vision animate-on-scroll">
            <h1>Y la visión de: </h1>
            <p>{data.vision}</p>
            <img src={world} alt="" />
          </div>
          <div className="values animate-on-scroll">
            <h1>Nuestros valores: </h1>
            <div className="valores">
              {data.valores.map((valor, index) => (
                <div key={index} className="val">{valor}</div>
              ))}
            </div>
          </div>
        </section>
        <section id='manual'>
  <h1>Manual de Usuario</h1>
  <p>Consulta y descarga nuestro manual de usuario para obtener información detallada sobre cómo aprovechar al máximo IAC.</p>
  <a href="/pdf/Manualusuario.pdf" download className="manual-download">
    Descargar Manual de Usuario
  </a>
</section>

        <section id='contact'>
          <h1>Contáctanos</h1>
          <form action="">
            <div className="inp">
              <input type="text" placeholder='Escribe tu nombre' />
              <input type="email" placeholder='Escribe tu correo' />
              <button>Enviar</button>
            </div>
            <textarea name="" id="" placeholder='¡Di hola!'></textarea>
          </form>
        </section>
      </div>
    </main>
  );
}

export default Main;
