import React, { useEffect, useState } from "react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon } from "@heroicons/react/solid";
import { Fragment } from "react";
import { api } from "../../services/api";
import "./admin-dashboard.scss";

const PetManagement = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [petsPerPage] = useState(10);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedPet, setSelectedPet] = useState(null);
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  const PET_STATUSES = {
    APPROVED: {
      label: "Approved",
      color: "bg-blue-100 text-blue-800",
    },
    AVAILABLE: {
      label: "Available",
      color: "bg-green-100 text-green-800",
    },
    PENDING: {
      label: "Pending",
      color: "bg-yellow-100 text-yellow-800",
    },
    ADOPTED: {
      label: "Adopted",
      color: "bg-purple-100 text-purple-800",
    },
  };
  const [editingPet, setEditingPet] = useState({
    name: "",
    species: "",
    breed: "",
    age: 0,
    gender: "",
    description: "",
    imageUrl: "",
    status: "Available",
    shelterId: 0,
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
    shelterId: 0,
  });

  useEffect(() => {
    fetchPets();
  });

  const fetchPets = async () => {
    try {
      const response = await api.get("/api/Pets/GetPets");
      setPets(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to fetch pets");
      setLoading(false);
    }
  };
  const fetchUserPetDetails = async (petId) => {
    try {
      const response = await api.get("/api/UserPet/mypets");
      const userPetData = response.data.find((up) => up.petId === petId);
      return userPetData; // Now includes user object directly
    } catch (err) {
      console.error("Failed to fetch user pet details:", err);
      return null;
    }
  };

  const filteredPets = pets.filter((pet) =>
    pet.name.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const indexOfLastPet = currentPage * petsPerPage;
  const indexOfFirstPet = indexOfLastPet - petsPerPage;
  const currentPets = filteredPets.slice(indexOfFirstPet, indexOfLastPet);
  const totalPages = Math.ceil(filteredPets.length / petsPerPage);

  const handleDeletePet = async (petId) => {
    if (window.confirm("Are you sure you want to delete this pet?")) {
      try {
        await api.delete(`/api/Pets/DeletePet/${petId}`);
        setPets(pets.filter((pet) => pet.id !== petId));
      } catch (err) {
        setError("Failed to delete pet");
      }
    }
  };

  const handleEditClick = (pet) => {
    setEditingPet(pet);
    setIsEditModalOpen(true);
  };

  const handleDetailsClick = async (pet) => {
    setSelectedPet(pet);
    const userPetDetails = await fetchUserPetDetails(pet.id);
    setSelectedPet((prev) => ({
      ...prev,
      userId: userPetDetails?.userId || "No owner",
      username: userPetDetails?.user?.username || "Unknown",
      email: userPetDetails?.user?.email || "No email",
      adoptionDate: userPetDetails?.adoptionDate || "Not adopted",
      adoptionStatus: userPetDetails?.status || "No status",
    }));
    setIsDetailsModalOpen(true);
  };
  const handleAddPet = async (e) => {
    e.preventDefault();
    try {
      await api.post("/api/Pets/AddPet", newPet);
      setIsAddModalOpen(false);
      setNewPet({
        name: "",
        species: "",
        breed: "",
        age: 0,
        gender: "",
        description: "",
        imageUrl: "",
        shelterId: 0,
      });
      fetchPets();
    } catch (err) {
      setError("Failed to add pet");
    }
  };

  const handleStatusUpdate = async (petId, newStatus) => {
    try {
      await api.post(
        `/api/Pets/MarkPetAs/${petId}`,
        JSON.stringify(newStatus),
        {
          headers: {
            "Content-Type": "application/json",
          },
        },
      );
      fetchPets();
    } catch (err) {
      setError("Failed to update pet status");
      console.error("Status update error:", err);
    }
  };

  const handleUpdateSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put(`/api/Pets/UpdatePet/${editingPet.id}`, editingPet);
      setIsEditModalOpen(false);
      fetchPets(); // Refresh the pet list
    } catch (err) {
      setError("Failed to update pet");
    }
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
            className={`px-3 py-1 rounded-md ${currentPage === index + 1 ? "bg-blue-500 text-white" : "bg-gray-200"}`}
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
              <span className="sr-only">Close</span>×
            </button>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="h-full">
              <img
                src={selectedPet.imageUrl}
                alt={selectedPet.name}
                className="w-full h-[400px] object-cover rounded-lg shadow-md"
                onError={(e) => {
                  e.target.src = "https://via.placeholder.com/400";
                  e.target.onerror = null;
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-4 content-start">
              {/* Owner Information Section */}
              <div className="col-span-2 bg-gray-50 p-4 rounded-lg mb-4">
                <h3 className="font-bold text-lg mb-2">Owner Information</h3>
                <div className="grid gap-2">
                  <div className="flex justify-between">
                    <span className="font-medium">User ID:</span>
                    <span>{selectedPet.userId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Username:</span>
                    <span>{selectedPet.username}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Email:</span>
                    <span>{selectedPet.email}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Adoption Date:</span>
                    <span>
                      {new Date(selectedPet.adoptionDate).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="font-medium">Adoption Status:</span>
                    <span>{selectedPet.adoptionStatus}</span>
                  </div>
                </div>
              </div>
              {/* Existing pet details */}
              {Object.entries(selectedPet).map(
                ([key, value]) =>
                  !["userId", "adoptionDate", "adoptionStatus"].includes(
                    key,
                  ) && (
                    <div
                      key={key}
                      className="col-span-2 flex items-center border-b border-gray-200 py-2"
                    >
                      <span className="font-medium text-gray-600 w-1/3 capitalize">
                        {key}:
                      </span>
                      <span className="text-gray-800 w-2/3">
                        {typeof value === "boolean" ? value.toString() : value}
                      </span>
                    </div>
                  ),
              )}
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
            {Object.keys(newPet).map((key) => (
              <div key={key} className="mb-4">
                <label className="block text-sm font-medium text-gray-700">
                  {key}
                </label>
                <input
                  type={key === "age" ? "number" : "text"}
                  value={newPet[key]}
                  onChange={(e) =>
                    setNewPet({
                      ...newPet,
                      [key]:
                        key === "age"
                          ? parseInt(e.target.value)
                          : e.target.value,
                    })
                  }
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
            {Object.keys(editingPet).map(
              (key) =>
                key !== "id" && (
                  <div key={key} className="mb-4">
                    <label className="block text-sm font-medium text-gray-700">
                      {key}
                    </label>
                    <input
                      type={key === "age" ? "number" : "text"}
                      value={editingPet[key]}
                      onChange={(e) =>
                        setEditingPet({
                          ...editingPet,
                          [key]:
                            key === "age"
                              ? parseInt(e.target.value)
                              : e.target.value,
                        })
                      }
                      className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
                    />
                  </div>
                ),
            )}
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

  if (loading)
    return (
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Image
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
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
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-semibold ${
                        PET_STATUSES[pet.status.toUpperCase()]?.color
                      }`}
                    >
                      {pet.status}
                    </span>
                    <Menu as="div" className="relative">
                      <div>
                        <Menu.Button className="inline-flex justify-center items-center px-2 py-1 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none">
                          Change
                          <ChevronDownIcon
                            className="w-5 h-5 ml-1"
                            aria-hidden="true"
                          />
                        </Menu.Button>
                      </div>

                      <Transition
                        as={Fragment}
                        enter="transition ease-out duration-100"
                        enterFrom="transform opacity-0 scale-95"
                        enterTo="transform opacity-100 scale-100"
                        leave="transition ease-in duration-75"
                        leaveFrom="transform opacity-100 scale-100"
                        leaveTo="transform opacity-0 scale-95"
                      >
                        <Menu.Items
                          className={`fixed transform z-50 w-40 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none`}
                          style={{
                            top: "auto",
                            left: (event) => {
                              const rect = event.target.getBoundingClientRect();
                              return `${rect.left}px`;
                            },
                            bottom: (event) => {
                              const rect = event.target.getBoundingClientRect();
                              const windowHeight = window.innerHeight;
                              return rect.bottom + 180 > windowHeight
                                ? `${windowHeight - rect.bottom + 40}px`
                                : "auto";
                            },
                          }}
                        >
                          <div className="py-1">
                            {Object.values(PET_STATUSES).map(({ label }) => (
                              <Menu.Item key={label}>
                                {({ active }) => (
                                  <button
                                    onClick={() =>
                                      handleStatusUpdate(pet.id, label)
                                    }
                                    className={`${
                                      active ? "bg-gray-100" : ""
                                    } block w-full text-left px-4 py-2 text-sm text-gray-700`}
                                  >
                                    Mark as {label}
                                  </button>
                                )}
                              </Menu.Item>
                            ))}
                          </div>
                        </Menu.Items>
                      </Transition>
                    </Menu>
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap space-x-2">
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
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {renderPagination()}
      {renderEditModal()}
      {renderAddModal()}
      {renderDetailsModal()}
    </div>
  );
};

export default PetManagement;
