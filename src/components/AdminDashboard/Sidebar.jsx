import React from "react";
import { NavLink } from "react-router-dom";
import {
  FaPaw,
  FaUsers,
  FaDog,
  FaCalendarAlt,
  FaHandHoldingHeart,
  FaChartBar,
  FaHome,
  FaChevronLeft,
} from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";
import "./sidebar.scss";

const navItems = [
  { name: "Users", path: "users", icon: FaUsers },
  { name: "Pets", path: "pets", icon: FaDog },
  { name: "Events", path: "events", icon: FaCalendarAlt },
  { name: "Donations", path: "donations", icon: FaHandHoldingHeart },
  { name: "Statistics", path: "statistics", icon: FaChartBar },
  { name: "Shelters", path: "shelters", icon: FaHome },
];

const Sidebar = ({ isMinimized, setIsMinimized }) => {
  const sidebarVariants = {
    expanded: { width: "16rem" },
    minimized: { width: "5rem" },
  };

  const toggleMinimize = () => {
    setIsMinimized(!isMinimized);
  };

  return (
    <motion.div
      initial="expanded"
      animate={isMinimized ? "minimized" : "expanded"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
      className="fixed left-0 top-0 h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 text-white shadow-xl overflow-hidden"
    >
      {/* Toggle Button */}
      <motion.button
        onClick={toggleMinimize}
        className="absolute top-4 -right-3 z-50 bg-blue-600 p-2 rounded-full shadow-lg hover:bg-blue-700 transition-colors"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
      >
        <motion.div
          animate={{ rotate: isMinimized ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          <FaChevronLeft className="w-4 h-4" />
        </motion.div>
      </motion.button>

      {/* Logo Section */}
      <div className="relative h-20 flex items-center justify-center border-b border-blue-700/30">
        <motion.div
          className="absolute inset-0 bg-blue-800/30 backdrop-blur-sm"
          animate={{
            opacity: [0.3, 0.4, 0.3],
            scale: [1, 1.02, 1],
          }}
          transition={{
            duration: 3,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <div className="relative flex items-center space-x-3 px-6 py-4">
          <div className="relative">
            <motion.div
              className="absolute -inset-1 bg-blue-400 rounded-full blur-sm"
              animate={{
                opacity: [0.5, 0.8, 0.5],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
            <FaPaw className="relative w-10 h-10 text-white" />
          </div>
          <AnimatePresence>
            {!isMinimized && (
              <motion.div
                className="flex flex-col"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.2 }}
              >
                <span className="text-2xl font-bold tracking-wider text-transparent bg-clip-text bg-gradient-to-r from-blue-200 to-white">
                  PawFund
                </span>
                <span className="text-xs text-blue-200 tracking-wider">
                  Admin
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {navItems.map((item, index) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `
                group relative flex items-center px-4 py-3 rounded-xl
                transition-all duration-300 ease-in-out
                ${
                  isActive
                    ? "bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg shadow-blue-900/50"
                    : "text-blue-100 hover:bg-blue-800/50"
                }
              `}
            >
              {({ isActive }) => (
                <>
                  <motion.div
                    className={`
                      absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100
                      transition-opacity duration-300 ease-in-out
                      bg-gradient-to-r from-blue-600/20 to-transparent
                    `}
                    whileHover={{ scale: 1.02 }}
                  />
                  <motion.div
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{
                      type: "spring",
                      stiffness: 260,
                      damping: 20,
                      delay: index * 0.1,
                    }}
                  >
                    <item.icon
                      className={`
                      relative w-5 h-5 transition-all duration-300
                      ${
                        isActive
                          ? "text-blue-200 transform rotate-6"
                          : "text-blue-300 group-hover:text-blue-200"
                      }
                    `}
                    />
                  </motion.div>
                  <AnimatePresence>
                    {!isMinimized && (
                      <motion.span
                        className="relative ml-3 font-medium tracking-wide"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.2 }}
                      >
                        {item.name}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {isActive && (
                    <motion.div
                      className="absolute right-4 w-2 h-2 rounded-full bg-blue-200"
                      initial={{ scale: 0 }}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [1, 0.8, 1],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-0 w-full">
        <motion.div
          className="px-6 py-4 border-t border-blue-700/30 bg-blue-900/30 backdrop-blur-sm"
          whileHover={{ backgroundColor: "rgba(30, 58, 138, 0.4)" }}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{
                  y: [0, -4, 0],
                  rotate: [0, 10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <FaPaw className="w-4 h-4 text-blue-400" />
              </motion.div>
              <AnimatePresence>
                {!isMinimized && (
                  <motion.span
                    className="text-sm text-blue-200 font-medium"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.2 }}
                  >
                    © 2024
                  </motion.span>
                )}
              </AnimatePresence>
            </div>
            <motion.div
              className="h-2 w-2 rounded-full bg-green-400"
              animate={{
                scale: [1, 1.2, 1],
                opacity: [1, 0.6, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            />
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default Sidebar;
