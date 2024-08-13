import React, { useState, useEffect } from 'react';
import { createLocation, fetchLocations } from '../../../services/api.js';
import './adminPage.css'; 

const LocationsPage = ({ openSheet, isSheetOpen }) => {
  const [locations, setLocations] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredLocations, setFilteredLocations] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newLocationName, setNewLocationName] = useState('');

  useEffect(() => {
    const fetchArea = async () => {
      const response = await fetchLocations();
      setLocations(response.payload);
      setFilteredLocations(response.payload);
    };

    fetchArea();
  }, []);

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
      </div>
    );
  };

  const handleAddLocation = () => {
    setIsModalOpen(true);
};

const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewLocationName('');
};

const handleSaveLocation = async () => {
    const newLocation = { name: newLocationName };
    await createLocation(newLocation);
    const response = await fetchLocations();
    setLocations(response.payload);
    setFilteredLocations(response.payload);
    handleCloseModal();
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
                        <div className="modal-buttons">
                            <button onClick={handleSaveLocation} className="save-button">Save</button>
                            <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
    </div>
  );
};

export default LocationsPage;
