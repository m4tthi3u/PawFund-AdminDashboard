import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';

const ShelterManagement = () => {
    const [shelters, setShelters] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [currentPage, setCurrentPage] = useState(1);
    const [isAddModalOpen, setIsAddModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const sheltersPerPage = 10;

    const [newShelter, setNewShelter] = useState({
        name: '',
        address: '',
        phoneNumber: '',
        email: ''
    });

    const [editingShelter, setEditingShelter] = useState({
        id: 0,
        name: '',
        address: '',
        phoneNumber: '',
        email: ''
    });

    useEffect(() => {
        fetchShelters();
    }, []);

    const fetchShelters = async () => {
        try {
            const response = await api.get('/api/Shelter/GetShelters');
            setShelters(response.data);
            setLoading(false);
        } catch (err) {
            setError('Failed to fetch shelters');
            setLoading(false);
        }
    };

    const handleAddShelter = async (e) => {
        e.preventDefault();
        try {
            await api.post('/api/Shelter/CreateShelter', newShelter);
            setIsAddModalOpen(false);
            setNewShelter({
                name: '',
                address: '',
                phoneNumber: '',
                email: ''
            });
            fetchShelters();
        } catch (err) {
            setError('Failed to add shelter');
        }
    };

    const handleEditClick = (shelter) => {
        setEditingShelter(shelter);
        setIsEditModalOpen(true);
    };

    const handleUpdateSubmit = async (e) => {
        e.preventDefault();
        try {
            await api.put(`/api/Shelter/UpdateShelter/${editingShelter.id}`, editingShelter);
            setIsEditModalOpen(false);
            fetchShelters();
        } catch (err) {
            setError('Failed to update shelter');
        }
    };

    const handleDeleteShelter = async (shelterId) => {
        if (window.confirm('Are you sure you want to delete this shelter?')) {
            try {
                await api.delete(`/api/Shelter/DeleteShelter/${shelterId}`);
                setShelters(shelters.filter(shelter => shelter.id !== shelterId));
            } catch (err) {
                setError('Failed to delete shelter');
            }
        }
    };

    const filteredShelters = shelters.filter(shelter =>
        shelter.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        shelter.address.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const indexOfLastShelter = currentPage * sheltersPerPage;
    const indexOfFirstShelter = indexOfLastShelter - sheltersPerPage;
    const currentShelters = filteredShelters.slice(indexOfFirstShelter, indexOfLastShelter);
    const totalPages = Math.ceil(filteredShelters.length / sheltersPerPage);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderAddModal = () => {
        if (!isAddModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h2 className="text-xl font-bold mb-4">Add New Shelter</h2>
                    <form onSubmit={handleAddShelter}>
                        {Object.entries(newShelter).map(([key, value]) => (
                            <div key={key} className="mb-4">
                                <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                                <input
                                    type={key === 'email' ? 'email' : 'text'}
                                    value={value}
                                    onChange={(e) => setNewShelter({ ...newShelter, [key]: e.target.value })}
                                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                    required
                                />
                            </div>
                        ))}
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
                                Add Shelter
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        );
    };

    const renderEditModal = () => {
        if (!isEditModalOpen) return null;

        return (
            <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
                <div className="bg-white p-6 rounded-lg shadow-xl w-96">
                    <h2 className="text-xl font-bold mb-4">Edit Shelter</h2>
                    <form onSubmit={handleUpdateSubmit}>
                        {Object.entries(editingShelter).map(([key, value]) => (
                            key !== 'id' && (
                                <div key={key} className="mb-4">
                                    <label className="block text-sm font-medium text-gray-700 capitalize">{key}</label>
                                    <input
                                        type={key === 'email' ? 'email' : 'text'}
                                        value={value}
                                        onChange={(e) => setEditingShelter({ ...editingShelter, [key]: e.target.value })}
                                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                                        required
                                    />
                                </div>
                            )
                        ))}
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
                <h2 className="text-2xl font-bold">Shelter Management</h2>
                <div className="flex space-x-4">
                    <button
                        onClick={() => setIsAddModalOpen(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                        Add Shelter
                    </button>
                    <input
                        type="text"
                        placeholder="Search shelters..."
                        className="px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && (
                <div className="mb-4 p-4 bg-red-100 border-l-4 border-red-500 text-red-700">
                    <p>{error}</p>
                </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Address</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {currentShelters.map((shelter) => (
                            <tr key={shelter.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 whitespace-nowrap">{shelter.name}</td>
                                <td className="px-6 py-4">{shelter.address}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{shelter.phoneNumber}</td>
                                <td className="px-6 py-4 whitespace-nowrap">{shelter.email}</td>
                                <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                    <button
                                        onClick={() => handleDeleteShelter(shelter.id)}
                                        className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md text-sm font-medium"
                                    >
                                        Delete
                                    </button>
                                    <button
                                        onClick={() => handleEditClick(shelter)}
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

            {renderEditModal()}
            {renderAddModal()}
        </div>
    );
};

export default ShelterManagement;