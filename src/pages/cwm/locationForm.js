import React, { useState, useEffect } from 'react';
import { createLocation, fetchUsers, fetchAllElements, fetchAllDomain } from '../../services/api';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import './locationForm.css';
import SearchableDropdown from '../../components/SearchableDropdown';

function LocationForm({ showLocationForm, setShowLocationForm, selectedDomain }) {
  const [formData, setFormData] = useState({
    domainId: selectedDomain,
    name: '',
    description: '',
    externalLocationIdentifier: '',
    locationManagerUserId: '',
  });
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [domains, setDomains] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const usersResponse = await fetchUsers(debouncedQuery);
        if (usersResponse.errorCode === 0) {
          setUsers(usersResponse.payload);
        } else {
          console.error('Error fetching users:', usersResponse.message);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, [debouncedQuery]);

  useEffect(() => {
    const fetchAllDomains = async () => {
      try {
        const workDomainData = await fetchAllDomain();
        setDomains(workDomainData.payload);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    fetchAllDomains();
  }, [selectedDomain]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value.trim() === '' ? null : value
    }));
  };

  const handleManagerChange = (selectedValue) => {
    setFormData(prevData => ({
      ...prevData,
      locationManagerUserId: selectedValue
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      await createLocation(formData);
      toast.success("Location created successfully!");
      setShowLocationForm(false);  // Close the form
      window.location.reload();    // Reload the page
    } catch (error) {
      console.error('Error creating location:', error);
      toast.error("Error creating location");
    }
  };

  const filteredOptions = users.map((user) => ({
    value: user.mail,
    label: `${user.commonName}`
  }));

  return (
    <div className={`modal ${showLocationForm ? "show" : "hide"}`}>
      <div className="form-content">
        <span className="close" onClick={() => setShowLocationForm(false)}>&times;</span>
        <h1 className="form-title">NEW LOCATION</h1>
        <form onSubmit={handleSubmit} className="location-form">
          <h1 className="workform-title">New Location</h1> {/* Title for the form */}
          <p className="form-subtitle">Please provide the details of the location</p>
          <hr className="line" /><br></br>
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
            <SearchableDropdown
              options={filteredOptions}
              selectedValue={formData.locationManagerUserId}
              onChange={handleManagerChange}
              onSearchChange={setSearchQuery}
            />
          </div>
          <button type="submit" className="form-button">Create Location</button>
        </form>
      </div>
    </div>
  );
}

export default LocationForm;
