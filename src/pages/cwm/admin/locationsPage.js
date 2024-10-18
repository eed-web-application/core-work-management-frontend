import React, { useState, useEffect } from 'react';
import { createLocation, fetchAllLocation, fetchUsers } from '../../../services/api.js';
import { toast, ToastContainer } from 'react-toastify'; // Import toast and ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toastify CSS
import './adminPage.css';

const LocationsPage = ({ openSheet, isSheetOpen, selectedDomain }) => {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // To prevent double API calls

  // New state fields for the location form
  const [newLocationName, setNewLocationName] = useState('');
  const [newLocationDescription, setNewLocationDescription] = useState('');
  const [newExternalLocationIdentifier, setNewExternalLocationIdentifier] = useState('');
  const [newLocationManagerUserId, setNewLocationManagerUserId] = useState('');

  // State for fetched users
  const [users, setUsers] = useState([]);

  // Fetch locations based on the selected domain
  useEffect(() => {
    const fetchLocations = async () => {
      if (selectedDomain) {
        try {
          const response = await fetchAllLocation(selectedDomain);
          setLocations(response.payload);
          setFilteredLocations(response.payload);
        } catch (error) {
          console.error("Error fetching locations:", error);
        }
      }
    };
    fetchLocations();
  }, [selectedDomain]);

  // Fetch users for the location manager dropdown
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const response = await fetchUsers(); // Adjust this if needed
        setUsers(response.payload); // Assume the response structure has a payload
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    fetchAllUsers();
  }, []);

  // Update filtered locations based on search query
  useEffect(() => {
    setFilteredLocations(
      locations.filter(location =>
        location.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, locations]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenSheet = (location) => {
    openSheet(
      <div>
        <h3>Location Details</h3>
        <p><strong>Name:</strong> {location.name}</p>
        <p><strong>Description:</strong> {location.description}</p>
        {/* <p><strong>External Location Identifier:</strong> {location.externalLocationIdentifier}</p> */}
        <p><strong>Manager:</strong> {location.locationManagerUserId}</p>
      </div>
    );
  };

  const handleAddLocation = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    // Reset form fields when closing modal
    setNewLocationName('');
    setNewLocationDescription('');
    setNewExternalLocationIdentifier('');
    setNewLocationManagerUserId('');
  };

  // Handle the creation of a new location
  const handleSaveLocation = async () => {
    if (!selectedDomain) {
      console.error("No domain selected, cannot create location");
      return;
    }

    // Prevent double-click or re-triggering of the API call
    if (isSaving) return;

    setIsSaving(true); // Set saving state

    const newLocation = {
      name: newLocationName,
      description: newLocationDescription,
      externalLocationIdentifier: newExternalLocationIdentifier,
      locationManagerUserId: newLocationManagerUserId,
    };

    try {
      await createLocation(selectedDomain, newLocation);
      toast.success("Location created successfully!");

      // Fetch updated locations list
      const response = await fetchAllLocation(selectedDomain); // Use selectedDomain here
      setLocations(response.payload);
      setFilteredLocations(response.payload);
      handleCloseModal();
    } catch (error) {
      console.error("Error creating location:", error);
      toast.error("Error creating location. Please try again.");
    } finally {
      setIsSaving(false); // Reset saving state after the operation completes
    }
  };

  return (
    <div className={`user-list-container ${isSheetOpen ? 'shifted' : ''}`}>
      <div className="user-list-header">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="user-search"
        />
        <button onClick={handleAddLocation} className="add-user-button">+ Location</button>
      </div>

      <ul className="user-list">
        {locations.length > 0 ? (
          locations.map((location) => (
            <li key={location.id} onClick={() => handleOpenSheet(location)} className="user-item">
              {location.name}
            </li>
          ))
        ) : (
          <li>No locations found.</li>
        )}
      </ul>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Location</h3>
            <input
              type="text"
              placeholder="Location Name"
              value={newLocationName}
              onChange={(e) => setNewLocationName(e.target.value)}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Description"
              value={newLocationDescription}
              onChange={(e) => setNewLocationDescription(e.target.value)}
              className="modal-input"
            />
            {/* <input
              type="text"
              placeholder="External Location Identifier"
              value={newExternalLocationIdentifier}
              onChange={(e) => setNewExternalLocationIdentifier(e.target.value)}
              className="modal-input"
            /> */}
            <select
              value={newLocationManagerUserId}
              onChange={(e) => setNewLocationManagerUserId(e.target.value)}
              className="modal-select"
            >
              <option value="" disabled>Select Location Manager</option>
              {users.map(user => (
                <option key={user.mail} value={user.mail}>{user.uid}</option> // Adjust user properties based on your response structure
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={handleSaveLocation} className="save-button" disabled={isSaving}>
                {isSaving ? 'Saving...' : 'Save'}
              </button>
              <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default LocationsPage;
