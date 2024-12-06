import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom"; // Importa useNavigate
import "./Drawer.css";
import LOGO from "../../../../assets/img/icons/logo.png"

function Drawer() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate(); // Define navigate

  useEffect(() => {
    const home = document.querySelector(".Home");
    if (home) {
      home.style.gridTemplateColumns = isOpen ? "20dvw auto" : "0 auto";
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
  };

  const handleLogout = () => {
    console.log("Saliendo...");
    navigate("/"); // Redirige a la pantalla de autenticación
  };

  return (
    <>
      {!isOpen && (
        <motion.button
          className="openBtn"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ type: "spring", stiffness: 300 }}
          onClick={handleToggle}
        >
          <i className="fa-solid fa-bars"></i>
        </motion.button>
      )}

      <motion.div
        className={`drawer ${isOpen ? "open" : "closed"}`}
        initial={{ width: 0 }}
        animate={{
          width: isOpen ? "20dvw" : 0,
          transition: {
            type: "tween",
            duration: 0.3,
          },
        }}
        exit={{ width: 0 }}
      >
        <div className="head-drawer">
          <motion.button
            className="drawer-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleToggle}
          >
            <i className={`fa-solid ${isOpen ? "fa-xmark" : "fa-bars"}`}></i>
          </motion.button>
        </div>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="content-drawer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
            >
              <img src={LOGO} alt="" style={{width:"80%", margin:"90% 10%"}} />
            </motion.div>
          )}
        </AnimatePresence>
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="content-drawer"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{
                delay: 0.2,
                type: "spring",
                stiffness: 100,
              }}
            >
              <button className="logout-btn" onClick={handleLogout} style={{  backgroundColor: "transparent", border: "none", margin:"15px"}}>
                <i
                  className="fa-solid fa-right-from-bracket fa-2xl"
                  style={{ color: "#ffffff" }}
                ></i>
              </button>
            </motion.div>
          )}
        </AnimatePresence>
        
      </motion.div>

    </>
  );
}

export default Drawer;
