import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaDog, FaMoneyBill, FaChartBar, FaPaw, FaCalendar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const navItems = [
  { name: 'Dashboard', path: '/admin', icon: FaHome },
  { name: 'Users', path: '/admin/users', icon: FaUsers },
  { name: 'Pets', path: '/admin/pets', icon: FaDog },
  { name: 'Donations', path: '/admin/donations', icon: FaMoneyBill },
  { name: 'Events', path: '/admin/events', icon: FaCalendar },
  { name: 'Statistics', path: '/admin/statistics', icon: FaChartBar },
];

const Sidebar = ({ isOpen, setIsOpen }) => {
  return (
    <div className="fixed left-0 w-64 h-screen bg-gradient-to-b from-blue-900 via-blue-800 to-blue-900 shadow-xl">
      {/* Logo/Header Section */}
      <div className="flex items-center justify-center h-20 border-b border-blue-700/50">
        <div className="flex items-center space-x-3">
          <FaPaw className="w-8 h-8 text-blue-400" />
          <span className="text-white text-xl font-bold tracking-wider">PawFund</span>
        </div>
      </div>

      {/* Navigation Section */}
      <nav className="mt-8 px-4">
        <div className="space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-150 ease-in-out
      ${isActive
                  ? 'bg-blue-700/50 text-white shadow-lg transform scale-105'
                  : 'text-blue-100 hover:bg-blue-700/30 hover:text-white hover:translate-x-1'
                }`
              }
            >
              <item.icon
                className={({ isActive }) => `w-5 h-5 mr-3 transition-colors duration-150
        ${isActive ? 'text-blue-300' : 'text-blue-400'}`
                }
              />
              <span className="font-medium">{item.name}</span>
            </NavLink>
          ))}
        </div>
      </nav>

      {/* Footer Section */}
      <div className="absolute bottom-0 w-full p-4 border-t border-blue-700/50">
        <div className="flex items-center px-4 py-2 text-blue-200 text-sm">
          <FaPaw className="w-4 h-4 mr-2 text-blue-400" />
          <span>© 2024 PawFund</span>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;