import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import "./Drawer.css";

function Drawer() {
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    const home = document.querySelector(".Home");
    if (home) {
      home.style.gridTemplateColumns = isOpen ? "20dvw auto" : "0 auto";
    }
  }, [isOpen]);

  const handleToggle = () => {
    setIsOpen((prev) => !prev);
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
            duration: 0.3 
          }
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
            <i className={`fa-solid ${isOpen ? 'fa-xmark' : 'fa-bars'}`}></i>
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
                stiffness: 100 
              }}
            >
              {/* Add drawer content here */}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </>
  );
}

export default Drawer;