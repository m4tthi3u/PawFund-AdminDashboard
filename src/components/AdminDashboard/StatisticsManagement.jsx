import React, { useState, useEffect } from "react";
import {
  FaChartBar,
  FaPaw,
  FaUsers,
  FaCalendar,
  FaMoneyBill,
} from "react-icons/fa";
import {
  PieChart,
  Pie,
  Tooltip,
  Legend,
  Cell,
  ResponsiveContainer,
} from "recharts";
import { api } from "../../services/api";

const StatisticsManagement = () => {
  const [stats, setStats] = useState({
    totalPets: 0,
    adoptedPets: 0,
    availablePets: 0,
    totalUsers: 0,
    adminUsers: 0,
    standardUsers: 0,
    staffUsers: 0,
    totalEvents: 0,
    totalDonations: 0,
    monthlyAdoptions: [],
    monthlyDonations: [],
  });
  const [loading, setLoading] = useState(true);
  const [setError] = useState(null);
  const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042"];
  const petStatusData = [
    { name: "Adopted", value: stats.adoptedPets },
    { name: "Available", value: stats.availablePets },
    { name: "Pending", value: stats.pendingPets },
    { name: "Approved", value: stats.approvedPets },
  ];
  const userRolesData = [
    { name: "Admins", value: stats.adminUsers },
    { name: "Staff", value: stats.staffUsers },
    { name: "Users", value: stats.standardUsers },
  ];

  useEffect(() => {
    fetchStatistics();
  });

  const fetchStatistics = async () => {
    try {
      // Fetch pets statistics
      const petsResponse = await api.get("/api/Pets/GetPets");
      const pets = petsResponse.data;
      const adoptedCount = pets.filter(
        (pet) => pet.status === "Adopted",
      ).length;
      const availableCount = pets.filter(
        (pet) => pet.status === "Available",
      ).length;
      const pendingCount = pets.filter(
        (pet) => pet.status === "Pending",
      ).length;
      const approvedCount = pets.filter(
        (pet) => pet.status === "Approved",
      ).length;

      // Fetch events
      const eventsResponse = await api.get("/api/Event/GetEvents");

      // Fetch donations
      const donationsResponse = await api.get("/api/Donation/GetDonations");

      const usersResponse = await api.get("/api/User/GetUsers");
      const users = usersResponse.data;

      const adminCount = users.filter((user) => user.role === "Admin").length;
      const standardCount = users.filter((user) => user.role === "User").length;
      const staffCount = users.filter((user) => user.role === "Staff").length;

      setStats({
        totalPets: pets.length,
        adoptedPets: adoptedCount,
        availablePets: availableCount,
        pendingPets: pendingCount,
        approvedPets: approvedCount,
        totalUsers: usersResponse.data.length,
        adminUsers: adminCount,
        standardUsers: standardCount,
        staffUsers: staffCount,
        totalEvents: eventsResponse.data.length,
        totalDonations: donationsResponse.data.reduce(
          (acc, curr) => acc + curr.amount,
          0,
        ),
        monthlyAdoptions: calculateMonthlyStats(
          pets.filter((pet) => pet.status === "Adopted"),
        ),
        monthlyDonations: calculateMonthlyStats(donationsResponse.data),
      });

      setLoading(false);
    } catch (err) {
      setError("Failed to fetch statistics");
      setLoading(false);
    }
  };

  const calculateMonthlyStats = (data) => {
    // Group data by month
    const monthlyData = data.reduce((acc, item) => {
      // Ensure the date is valid
      const date = new Date(item.createdAt || item.date); // Try createdAt first, fall back to date
      if (date instanceof Date && !isNaN(date)) {
        // Format month and year
        const monthYear = `${date.toLocaleString("default", { month: "short" })} ${date.getFullYear()}`;
        if (item.amount) {
          // For donations, sum the amounts
          acc[monthYear] = (acc[monthYear] || 0) + item.amount;
        } else {
          // For adoptions, count occurrences
          acc[monthYear] = (acc[monthYear] || 0) + 1;
        }
      }
      return acc;
    }, {});

    return Object.entries(monthlyData)
      .map(([month, value]) => ({
        month,
        count: value,
      }))
      .sort((a, b) => {
        // Sort by date (most recent first)
        const [aMonth, aYear] = a.month.split(" ");
        const [bMonth, bYear] = b.month.split(" ");
        return (
          new Date(`${bMonth} 1, ${bYear}`) - new Date(`${aMonth} 1, ${aYear}`)
        );
      });
  };

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white p-2 shadow-lg rounded-lg border">
          <p className="text-sm">{`${payload[0].name}: ${payload[0].value}`}</p>
          <p className="text-sm text-gray-600">
            {`(${((payload[0].value / stats.totalPets) * 100).toFixed(1)}%)`}
          </p>
        </div>
      );
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="flex items-center mb-6">
        <FaChartBar className="w-6 h-6 text-blue-600 mr-2" />
        <h1 className="text-2xl font-bold text-gray-800">
          Statistics Dashboard
        </h1>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <StatCard
          icon={<FaPaw className="w-8 h-8 text-blue-500" />}
          title="Total Pets"
          value={stats.totalPets}
          subtitle={
            <span>
              {stats.adoptedPets} Adopted • {stats.availablePets} Available
              <br /> {/* Add line break here */}
              {stats.pendingPets} Pending • {stats.approvedPets} Approved
            </span>
          }
          color="blue"
        />
        <StatCard
          icon={<FaUsers className="w-8 h-8 text-green-500" />}
          title="Total Users"
          value={stats.totalUsers}
          subtitle={
            <span>
              {stats.adminUsers} Admins • {stats.staffUsers} Staff
              <br />
              {stats.standardUsers} Standard Users
            </span>
          }
          color="green"
        />
        <StatCard
          icon={<FaCalendar className="w-8 h-8 text-purple-500" />}
          title="Total Events"
          value={stats.totalEvents}
          color="purple"
        />
        <StatCard
          icon={<FaMoneyBill className="w-8 h-8 text-yellow-500" />}
          title="Total Donations"
          value={`$${stats.totalDonations.toLocaleString()}`}
          color="yellow"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        {/* Pet Status Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            Pet Status Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={petStatusData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {petStatusData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* User Roles Distribution */}
        <div className="bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-lg font-semibold mb-4">
            User Roles Distribution
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={userRolesData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {userRolesData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

const StatCard = ({ icon, title, value, subtitle, color }) => (
  <div
    className={`bg-white p-6 rounded-lg shadow-lg border-l-4 border-${color}-500`}
  >
    <div className="flex justify-between items-start">
      <div>
        <p className="text-sm text-gray-600 mb-1">{title}</p>
        <h3 className="text-2xl font-bold text-gray-800">{value}</h3>
        {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
      </div>
      {icon}
    </div>
  </div>
);

export default StatisticsManagement;
