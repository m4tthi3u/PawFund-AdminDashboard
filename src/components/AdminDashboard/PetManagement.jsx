import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import './admin-dashboard.scss';

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [petsPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
const [selectedPet, setSelectedPet] = useState(null);
  const [editingPet, setEditingPet] = useState({
    name: "",
    species: "",
    breed: "",
    age: 0,
    gender: "",
    description: "",
    imageUrl: "",
    status: "Available",
    shelterId: 0
  });

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
const [newPet, setNewPet] = useState({
  name: "",
  species: "",
  breed: "",
  age: 0,
  gender: "",
  description: "",
  imageUrl: "",
  shelterId: 0
});

  useEffect(() => {
    fetchPets();
  }, []);

  const fetchPets = async () => {
    try {
      const response = await api.get('/api/Pets/GetPets');
      setPets(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch pets');
      setLoading(false);
    }
  };

  const filteredPets = pets.filter(pet => 
    pet.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);

  const handleDeletePet = async (petId) => {
    if (window.confirm('Are you sure you want to delete this pet?')) {
      try {
        await api.delete(`/api/Pets/DeletePet/${petId}`);
        setPets(pets.filter(pet => pet.id !== petId));
      } catch (err) {
        setError('Failed to delete pet');
      }
    }
  };

  const handleEditClick = (pet) => {
    setEditingPet(pet);
    setIsEditModalOpen(true);
  };

  const handleDetailsClick = (pet) => {
    setSelectedPet(pet);
    setIsDetailsModalOpen(true);
  };

  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/Pets/AddPet', newPet);
      setIsAddModalOpen(false);
      setNewPet({
        name: "",
  species: "",
  breed: "",
  age: 0,
  gender: "",
  description: "",
  imageUrl: "",
  shelterId: 0
      });
      fetchPets();
  } catch (err) {
    setError('Failed to add pet');
  }
};

const handleStatusUpdate = async (petId, newStatus) => {
    try {
      await api.post(`/api/Pets/AdoptPet/${petId}`, { status: newStatus });
      fetchPets(); // Refresh the pet list
    } catch (err) {
      setError('Failed to update pet status');
    }
  };


  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/Pets/UpdatePet/${editingPet.id}`, editingPet);
      setIsEditModalOpen(false);
      fetchPets(); // Refresh the pet list
    } catch (err) {
      setError('Failed to update pet');
    }
  };

  const renderPagination = () => {
    const pageNumbers = [];
    for (let i = 1; i <= totalPages; i++) {
      pageNumbers.push(i);
    }
  
    return (
      <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
        <div className="flex-1 flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-700">
              Showing{' '}
              <span className="font-medium">{indexOfFirstPet + 1}</span>{' '}
              to{' '}
              <span className="font-medium">
                {Math.min(indexOfLastPet, filteredPets.length)}
              </span>{' '}
              of{' '}
              <span className="font-medium">{filteredPets.length}</span>{' '}
              results
            </p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">First</span>
              ⟪
            </button>
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Previous</span>
              ⟨
            </button>
            {pageNumbers.map(number => (
              <button
                key={number}
                onClick={() => setCurrentPage(number)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium rounded-md
                  ${currentPage === number 
                    ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                    : 'border-gray-300 bg-white text-gray-500 hover:bg-gray-50'
                  }`}
              >
                {number}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Next</span>
              ⟩
            </button>
            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
            >
              <span className="sr-only">Last</span>
              ⟫
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderDetailsModal = () => {
    if (!isDetailsModalOpen || !selectedPet) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-[900px] max-h-[80vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">Pet Details</h2>
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="text-gray-400 hover:text-gray-500"
            >
              <span className="sr-only">Close</span>
              ×
            </button>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            {/* Left column - Image */}
            <div className="h-full">
              <img 
                src={selectedPet.imageUrl} 
                alt={selectedPet.name}
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400';
                  e.target.onerror = null;
                }}
              />
            </div>
  
            {/* Right column - Details */}
            <div className="grid grid-cols-2 gap-4 content-start">
              {Object.entries(selectedPet).map(([key, value]) => (
                <div key={key} className="col-span-2 flex items-center border-b border-gray-200 py-2">
                  <span className="font-medium text-gray-600 w-1/3 capitalize">
                    {key}:
                  </span>
                  <span className="text-gray-800 w-2/3">
                    {typeof value === 'boolean' ? value.toString() : value}
                  </span>
                </div>
              ))}
            </div>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={() => setIsDetailsModalOpen(false)}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Close
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderAddModal = () => {
    if (!isAddModalOpen) return null;
  
    return (
      <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-96">
          <h2 className="text-xl font-bold mb-4">Add New Pet</h2>
          <form onSubmit={handleAddPet}>
            {Object.keys(newPet).map(key => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">{key}</label>
                <input
                  type={key === 'age' ? 'number' : 'text'}
                  value={newPet[key]}
                  onChange={(e) => setNewPet({
                    ...newPet,
                    [key]: key === 'age' ? parseInt(e.target.value) : e.target.value
                  })}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
                Add Pet
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
          <h2 className="text-xl font-bold mb-4">Edit Pet</h2>
          <form onSubmit={handleUpdateSubmit}>
            {Object.keys(editingPet).map(key => (
              key !== 'id' && (
                <div key={key} className="mb-4">
                  <label className="block text-sm font-medium text-gray-700">{key}</label>
                  <input
                    type={key === 'age' ? 'number' : 'text'}
                    value={editingPet[key]}
                    onChange={(e) => setEditingPet({
                      ...editingPet,
                      [key]: key === 'age' ? parseInt(e.target.value) : e.target.value
                    })}
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
        <h2 className="text-2xl font-bold">Pet Management</h2>
        <div className="flex space-x-4">
        <button
      onClick={() => setIsAddModalOpen(true)}
      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
    >
      Add Pet
    </button>
          <input
            type="text"
            placeholder="Search pets..."
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {currentPets.map((pet) => (
              <tr key={pet.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap">
                  <img 
                    src={pet.imageUrl} 
                    alt={pet.name} 
                    className="h-16 w-16 rounded-full object-cover"
                  />
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{pet.name}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                    {pet.status}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                <button
    onClick={() => handleDetailsClick(pet)}
    className="text-purple-600 hover:text-purple-900 px-3 py-1 rounded-md text-sm font-medium"
  >
    Details
  </button>
                  <button
                    onClick={() => handleDeletePet(pet.id)}
                    className="text-red-600 hover:text-red-900 px-3 py-1 rounded-md text-sm font-medium"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEditClick(pet)}
                    className="text-blue-600 hover:text-blue-900 px-3 py-1 rounded-md text-sm font-medium"
                    >
                    Update
                </button>
                {pet.status === 'Available' && (
    <>
      <button
        onClick={() => handleStatusUpdate(pet.id, 'Pending')}
        className="text-yellow-600 hover:text-yellow-900 px-3 py-1 rounded-md text-sm font-medium"
      >
        Mark as Pending
      </button>
      <button
        onClick={() => handleStatusUpdate(pet.id, 'Adopted')}
        className="text-green-600 hover:text-green-900 px-3 py-1 rounded-md text-sm font-medium"
      >
        Mark as Adopted
      </button>
    </>
  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        
      </div>
      {renderEditModal()}
      {renderPagination()}
      {renderAddModal()}
      {renderDetailsModal()}
    </div>
  );
};

export default PetManagement;