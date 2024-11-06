import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { FaPaw, FaUser, FaLock } from "react-icons/fa";
import { api } from "../../services/api";

const Login = () => {
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    try {
      const authResponse = await api.post("/api/Auth/login", credentials);
      const token = authResponse.data.token;

      // Store the token
      localStorage.setItem("token", token);
      api.defaults.headers.common["Authorization"] = `Bearer ${token}`;

      // Get user details to check role
      const usersResponse = await api.get("/api/User/GetUsers");
      const currentUser = usersResponse.data.find(
        (user) =>
          user.username.toLowerCase() === credentials.username.toLowerCase(),
      );

      if (!currentUser) {
        setError("User not found.");
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setIsLoading(false);
        return;
      }

      if (currentUser.role !== "Admin") {
        setError(
          "You are not authorised to access the Admin Dashboard, please contact your Admin for more information",
        );
        localStorage.removeItem("token");
        delete api.defaults.headers.common["Authorization"];
        setIsLoading(false);
        return;
      }

      // Store user info
      localStorage.setItem("user", JSON.stringify(currentUser));

      setIsLoading(false);
      navigate("/admin");
    } catch (err) {
      setError("Invalid username or password");
      setIsLoading(false);
    }
  };

  return (
    <motion.div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute inset-0">
          <motion.div
            animate={{
              backgroundPosition: ["0% 0%", "100% 100%"],
              opacity: [0.3, 0.5],
            }}
            transition={{
              duration: 20,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,_rgba(255,255,255,0.1),transparent)] opacity-30"
          />
        </div>
      </div>

      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", duration: 0.8 }}
        className="relative max-w-md w-full mx-4"
      >
        <motion.div
          className="bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl overflow-hidden"
          whileHover={{ boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
          transition={{ duration: 0.3 }}
        >
          {/* Header */}
          <div className="px-8 pt-8 pb-6 text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1, rotate: 360 }}
              transition={{ type: "spring", duration: 1.5, bounce: 0.5 }}
              className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white mb-6"
            >
              <motion.div
                animate={{
                  scale: [1, 1.2, 1],
                  rotate: [0, 10, -10, 0],
                }}
                transition={{
                  duration: 2,
                  repeat: Infinity,
                  repeatType: "reverse",
                }}
              >
                <FaPaw className="w-10 h-10" />
              </motion.div>
            </motion.div>
            <motion.h2
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
              className="text-3xl font-bold text-white mb-2"
            >
              Admin Login
            </motion.h2>
          </div>

          {/* Form Section */}
          <div className="p-8">
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-6 p-4 rounded-lg bg-red-500/10 backdrop-blur-sm border-l-4 border-red-500"
                >
                  <div className="flex items-center text-red-200">
                    <FaLock className="w-5 h-5 mr-3" />
                    <p className="text-sm">{error}</p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <motion.form onSubmit={handleSubmit} className="space-y-6">
              {/* Username field */}
              <motion.div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaUser className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="text"
                  className="block w-full pl-10 pr-3 py-4 bg-white/10 border border-blue-300/30 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Username"
                  value={credentials.username}
                  onChange={(e) =>
                    setCredentials({ ...credentials, username: e.target.value })
                  }
                  required
                />
              </motion.div>

              {/* Password field */}
              <motion.div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                  <FaLock className="h-5 w-5 text-blue-300" />
                </div>
                <input
                  type="password"
                  className="block w-full pl-10 pr-3 py-4 bg-white/10 border border-blue-300/30 text-white rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Password"
                  value={credentials.password}
                  onChange={(e) =>
                    setCredentials({ ...credentials, password: e.target.value })
                  }
                  required
                />
              </motion.div>

              <motion.button
                type="submit"
                disabled={isLoading}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="w-full flex items-center justify-center py-4 px-4 rounded-xl text-white bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform transition-all duration-200"
              >
                {isLoading ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{
                      duration: 1,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  >
                    <svg className="h-5 w-5" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                  </motion.div>
                ) : (
                  "Sign In"
                )}
              </motion.button>
            </motion.form>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-center mt-6"
        >
          <p className="text-sm text-blue-200">
            Copyright &copy; {new Date().getFullYear()} PawFund
          </p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default Login;
