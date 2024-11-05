import React, { useState, useEffect } from 'react';
import { FaChartBar, FaPaw, FaUsers, FaCalendar, FaMoneyBill } from 'react-icons/fa';
import { api } from '../../services/api';

const StatisticsManagement = () => {
    const [stats, setStats] = useState({
        totalPets: 0,
        adoptedPets: 0,
        availablePets: 0,
        totalUsers: 0,
        totalEvents: 0,
        totalDonations: 0,
        monthlyAdoptions: [],
        monthlyDonations: []
    });
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchStatistics();
    }, []);

    const fetchStatistics = async () => {
        try {
            // Fetch pets statistics
            const petsResponse = await api.get('/api/Pets/GetPets');
            const pets = petsResponse.data;
            const adoptedCount = pets.filter(pet => pet.status === 'ADOPTED').length;
            const availableCount = pets.filter(pet => pet.status === 'AVAILABLE').length;

            // Fetch users
            const usersResponse = await api.get('/api/User/GetUsers');

            // Fetch events
            const eventsResponse = await api.get('/api/Event/GetEvents');

            // Fetch donations
            const donationsResponse = await api.get('/api/Donation/GetDonations');

            setStats({
                totalPets: pets.length,
                adoptedPets: adoptedCount,
                availablePets: availableCount,
                totalUsers: usersResponse.data.length,
                totalEvents: eventsResponse.data.length,
                totalDonations: donationsResponse.data.reduce((acc, curr) => acc + curr.amount, 0),
                monthlyAdoptions: calculateMonthlyStats(pets.filter(pet => pet.status === 'ADOPTED')),
                monthlyDonations: calculateMonthlyStats(donationsResponse.data)
            });

            setLoading(false);
        } catch (err) {
            setError('Failed to fetch statistics');
            setLoading(false);
        }
    };

    const calculateMonthlyStats = (data) => {
        // Group data by month
        const monthlyData = data.reduce((acc, item) => {
            const date = new Date(item.date);
            const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
            acc[monthYear] = (acc[monthYear] || 0) + 1;
            return acc;
        }, {});

        return Object.entries(monthlyData).map(([month, count]) => ({
            month,
            count
        }));
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
                <h1 className="text-2xl font-bold text-gray-800">Statistics Dashboard</h1>
            </div>

            {/* Statistics Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <StatCard
                    icon={<FaPaw className="w-8 h-8 text-blue-500" />}
                    title="Total Pets"
                    value={stats.totalPets}
                    subtitle={`${stats.adoptedPets} Adopted • ${stats.availablePets} Available`}
                    color="blue"
                />
                <StatCard
                    icon={<FaUsers className="w-8 h-8 text-green-500" />}
                    title="Total Users"
                    value={stats.totalUsers}
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

            {/* Monthly Statistics */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Monthly Adoptions</h2>
                    <div className="space-y-2">
                        {stats.monthlyAdoptions.map(({ month, count }) => (
                            <div key={month} className="flex justify-between items-center">
                                <span>{month}</span>
                                <span className="font-semibold">{count} adoptions</span>
                            </div>
                        ))}
                    </div>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-lg">
                    <h2 className="text-lg font-semibold mb-4">Monthly Donations</h2>
                    <div className="space-y-2">
                        {stats.monthlyDonations.map(({ month, count }) => (
                            <div key={month} className="flex justify-between items-center">
                                <span>{month}</span>
                                <span className="font-semibold">{count} donations</span>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

const StatCard = ({ icon, title, value, subtitle, color }) => (
    <div className={`bg-white p-6 rounded-lg shadow-lg border-l-4 border-${color}-500`}>
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