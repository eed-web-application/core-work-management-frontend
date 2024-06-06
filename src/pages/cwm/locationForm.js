import React, { useState, useEffect } from 'react';
import { createLocation, fetchUsers, fetchAllElements, fetchWorkDomain } from '../../services/api';
import './locationForm.css';

function LocationForm({ showLocationForm, setShowLocationForm, selectedDomain }) {
  console.log(selectedDomain);
  const [formData, setFormData] = useState({
    domainId: selectedDomain,
    name: '',
    description: '',
    externalLocationIdentifier: '',
    locationManagerUserId: '',
  });
  const [users, setUsers] = useState([]);
  const [depotItems, setDepotItems] = useState([]);
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetchUsers("surname");
        const elementsResponse = await fetchAllElements(20);
        if (usersResponse.errorCode === 0) {
          setUsers(usersResponse.payload);
        }
        if (elementsResponse.errorCode === 0) {
          setDepotItems(elementsResponse.payload);
        } else {
          throw new Error("Error fetching data");
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchDomains = async () => {
      try {
        const workDomainData = await fetchWorkDomain(); // Fetch work domains
        setSelectedDomain(selectedDomain); // Set default domain
        setDomains(workDomainData.payload);
        console.log(domains);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchDomains();
  }, [selectedDomain]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value.trim() === '' ? null : value
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createLocation(formData);
      alert("Location created successfully!");
      window.location.reload();
    } catch (error) {
      console.error('Error creating location:', error);
      alert("Error creating location. Please try again.");
    }
  };

  return (
    <div className={`modal ${showLocationForm ? "show" : "hide"}`}>
      <div className="form-content">
        <span className="close" onClick={() => setShowLocationForm(false)}>&times;</span>
        <h1 className="form-title">NEW LOCATION</h1>
        
        <form onSubmit={handleSubmit} className="location-form">
          
          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={formData.name} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input type="text" id="description" name="description" value={formData.description} onChange={handleInputChange} />
          </div>

          <div className="form-group">
            <label htmlFor="locationManagerUserId">Manager</label>
            <select id="locationManagerUserId" name="locationManagerUserId" value={formData.locationManagerUserId} onChange={handleInputChange}>
              <option value="">Select Manager</option>
              {users.map(user => (
                <option key={user.uid} value={user.mail}>{`${user.commonName}`}</option>
              ))}
            </select>
          </div>

          <button type="submit" className="form-button">Create Location</button>
        </form>
      </div>
    </div>
  );
}

export default LocationForm;
