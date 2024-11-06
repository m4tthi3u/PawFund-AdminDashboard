import React, { useState, useEffect } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { api } from "../../services/api";
import { FaUserCircle } from "react-icons/fa";
import Sidebar from "./Sidebar";
import UserManagement from "./UserManagement";
import PetManagement from "./PetManagement";
import EventManagement from "./EventManagement";
import DonationManagement from "./DonationManagement";
import StatisticsManagement from "./StatisticsManagement";
import ShelterManagement from "./ShelterManagement";

const AdminDashboard = ({ user }) => {
  const [isSidebarMinimized, setIsSidebarMinimized] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get("/api/User/GetUsers");
        console.log("API Response:", response.data);
        if (response.data && response.data.length > 0) {
          // Get user from localStorage
          const currentUser = JSON.parse(localStorage.getItem("user"));

          if (currentUser && currentUser.role === "Admin") {
            // Find the current user's data from the API response
            const userData = response.data.find(
              (user) =>
                user.id === currentUser.id ||
                user.username === currentUser.username,
            );
            if (userData) {
              setUsername(userData.username);
            }
          }
        } else {
          console.error("Failed to fetch user data");
        }
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, []);

  // Animation variants
  const pageTransition = {
    initial: { opacity: 0, x: -10 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: 10 },
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    window.location.href = "/login";
  };

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <Sidebar
        isMinimized={isSidebarMinimized}
        setIsMinimized={setIsSidebarMinimized}
      />
      <div
        className={`flex-1 transition-all duration-300 ease-in-out ${isSidebarMinimized ? "ml-20" : "ml-64"}`}
      >
        {/* Header */}
        <header className="bg-white shadow-sm sticky top-0 z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
            <div className="flex justify-end items-center">
              {/* User Profile */}
              <div className="flex items-center gap-6">
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium text-gray-700">
                    Welcome, {username || "Admin"}
                  </span>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="rounded-full bg-gray-100 p-1"
                  >
                    <FaUserCircle className="h-6 w-6 text-gray-600" />
                  </motion.button>
                </div>

                {/* Logout Button */}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleLogout}
                  className="px-3 py-1.5 text-sm font-medium text-white bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Logout
                </motion.button>
              </div>
            </div>
          </div>
        </header>

        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          <AnimatePresence mode="wait">
            <motion.div
              initial="initial"
              animate="animate"
              exit="exit"
              variants={pageTransition}
              transition={{ duration: 0.2 }}
            >
              <Routes>
                <Route path="/" element={<Navigate to="users" replace />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="pets" element={<PetManagement />} />
                <Route path="events" element={<EventManagement />} />
                <Route path="donations" element={<DonationManagement />} />
                <Route path="statistics" element={<StatisticsManagement />} />
                <Route path="shelters" element={<ShelterManagement />} />
              </Routes>
            </motion.div>
          </AnimatePresence>
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;
