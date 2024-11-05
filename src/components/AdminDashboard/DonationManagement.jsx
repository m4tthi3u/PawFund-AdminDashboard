import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const DonationManagement = () => {
    const [donations, setDonations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchTerm, setSearchTerm] = useState('');
    const donationsPerPage = 10;
    const [editingDonation, setEditingDonation] = useState(null);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [newDonation, setNewDonation] = useState({
        userId: 0,
        shelterId: 0,
        petId: 0,
        amount: 0,
        paymentMethod: "CreditCard"
    });

    // Status styling configuration
    const DONATION_STATUSES = {
        PENDING: {
            label: 'Pending',
            color: 'bg-yellow-100 text-yellow-800'
        },
        COMPLETED: {
            label: 'Completed',
            color: 'bg-green-100 text-green-800'
        },
        FAILED: {
            label: 'Failed',
            color: 'bg-red-100 text-red-800'
        }
    };

    useEffect(() => {
        fetchDonations();
    }, []);

    const fetchDonations = async () => {
        try {
            const response = await api.get('/api/Donation/GetDonations');
            setDonations(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch donations');
            setLoading(false);
        }
    };

    const handleAddDonation = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/Donation/AddDonation', newDonation);
            setIsAddModalOpen(false);
            setNewDonation({
                userId: 0,
                shelterId: 0,
                petId: 0,
                amount: 0,
                paymentMethod: "CreditCard"
            });
            fetchDonations(); // Refresh the donations list
        } catch (err) {
            setError('Failed to add donation');
        }
    };


    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/Donation/UpdateDonation/${editingDonation.id}`, editingDonation);
            setIsEditModalOpen(false);
            fetchDonations();
        } catch (err) {
            setError('Failed to update donation');
        }
    };

    // Filter and pagination
    const filteredDonations = donations.filter(donation =>
        donation.userId.toString().includes(searchTerm.toLowerCase())
    );

    const indexOfLastDonation = currentPage * donationsPerPage;
    const indexOfFirstDonation = indexOfLastDonation - donationsPerPage;
    const currentDonations = filteredDonations.slice(indexOfFirstDonation, indexOfLastDonation);
    const totalPages = Math.ceil(filteredDonations.length / donationsPerPage);

    const paginate = (pageNumber) => {
        setCurrentPage(pageNumber);
    };

    const renderAddModal = () => {
        if (!isAddModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h2 className="text-xl font-bold mb-4">Add New Donation</h2>
                    <form onSubmit={handleAddDonation}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">User ID</label>
                            <input
                                type="number"
                                value={newDonation.userId}
                                onChange={(e) => setNewDonation({
                                    ...newDonation,
                                    userId: parseInt(e.target.value)
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Shelter ID</label>
                            <input
                                type="number"
                                value={newDonation.shelterId}
                                onChange={(e) => setNewDonation({
                                    ...newDonation,
                                    shelterId: parseInt(e.target.value)
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Pet ID</label>
                            <input
                                type="number"
                                value={newDonation.petId}
                                onChange={(e) => setNewDonation({
                                    ...newDonation,
                                    petId: parseInt(e.target.value)
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                value={newDonation.amount}
                                onChange={(e) => setNewDonation({
                                    ...newDonation,
                                    amount: parseFloat(e.target.value)
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            />
                        </div>

                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                            <select
                                value={newDonation.paymentMethod}
                                onChange={(e) => setNewDonation({
                                    ...newDonation,
                                    paymentMethod: e.target.value
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                required
                            >
                                <option value="CreditCard">Credit Card</option>
                                <option value="DebitCard">Debit Card</option>
                                <option value="BankTransfer">Bank Transfer</option>
                                <option value="PayPal">PayPal</option>
                            </select>
                        </div>

                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsAddModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Add Donation
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderPagination = () => {
        return (
            <div className="flex justify-center mt-4 space-x-2">
                <button
                    onClick={() => paginate(1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
                >
                    First
                </button>
                <button
                    onClick={() => paginate(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
                >
                    Previous
                </button>
                {[...Array(totalPages)].map((_, index) => (
                    <button
                        key={index + 1}
                        onClick={() => paginate(index + 1)}
                        className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}
                    >
                        {index + 1}
                    </button>
                ))}
                <button
                    onClick={() => paginate(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
                >
                    Next
                </button>
                <button
                    onClick={() => paginate(totalPages)}
                    disabled={currentPage === totalPages}
                    className="px-3 py-1 rounded-md bg-gray-200 disabled:opacity-50"
                >
                    Last
                </button>
            </div>
        );
    };

    const renderEditModal = () => {
        if (!isEditModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h2 className="text-xl font-bold mb-4">Edit Donation</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Amount</label>
                            <input
                                type="number"
                                value={editingDonation.amount}
                                onChange={(e) => setEditingDonation({
                                    ...editingDonation,
                                    amount: parseFloat(e.target.value)
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Status</label>
                            <select
                                value={editingDonation.status}
                                onChange={(e) => setEditingDonation({
                                    ...editingDonation,
                                    status: e.target.value
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="Pending">Pending</option>
                                <option value="Completed">Completed</option>
                                <option value="Failed">Failed</option>
                            </select>
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium text-gray-700">Payment Method</label>
                            <select
                                value={editingDonation.paymentMethod}
                                onChange={(e) => setEditingDonation({
                                    ...editingDonation,
                                    paymentMethod: e.target.value
                                })}
                                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                            >
                                <option value="CreditCard">Credit Card</option>
                                <option value="PayPal">PayPal</option>
                                <option value="BankTransfer">Bank Transfer</option>
                            </select>
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                            <button
                                type="button"
                                onClick={() => setIsEditModalOpen(false)}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700"
                            >
                                Save Changes
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    if (loading) return (
        <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
    );

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold">Donation Management</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Donation
                    </button>
                    <input
                        type="text"
                        placeholder="Search by user ID..."
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User ID</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Method</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentDonations.map((donation) => (
                            <tr key={donation.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{donation.id}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{donation.userId}</td>
                                <td className="px-6 py-4 whitespace-nowrap">${donation.amount.toFixed(2)}</td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    {new Date(donation.donationDate).toLocaleDateString()}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">
                                    <span className={`px-3 py-1 rounded-full text-sm font-semibold ${DONATION_STATUSES[donation.status.toUpperCase()]?.color
                                        }`}>
                                        {donation.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap">{donation.paymentMethod}</td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                    <button
                                        onClick={() => {
                                            setEditingDonation(donation);
                                            setIsEditModalOpen(true);
                                        }}
                                        className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md text-sm font-medium"
                                    >
                                        Edit
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
            {renderPagination()}
            {renderAddModal()}
            {renderEditModal()}
        </div>
    );
};

export default DonationManagement;