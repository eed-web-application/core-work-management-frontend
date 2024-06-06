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
        const usersResponse = await fetchUsers("martinez");
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

  const renderField = (field) => (
    <div key={field.name} className="form-group">
      <label htmlFor={field.name}>{field.label}{field.required && <span className="required">*</span>}</label>
      {field.type === 'select' ? (
        <select
          id={field.name}
          name={field.name}
          value={formData[field.name]}
          onChange={handleInputChange}
          className="select-input"
          multiple={field.multiple}
        >
          <option value="">Select {field.label}</option>
          {field.options.map(option => (
            <option key={option.id} value={option.value}>{option.label}</option>
          ))}
        </select>
      ) : (
        <input
          type={field.type}
          id={field.name}
          name={field.name}
          value={formData[field.name]}
          onChange={handleInputChange}
        />
      )}
    </div>
  );

  const fields = [
    // { label: 'Domain', name: 'domainId', type: 'select', options: domains.map(domain => ({ id: domain.id, value: domain.id, label: domain.name })), required: true },
    { label: 'Name', name: 'name', type: 'text', required: true },
    { label: 'Description', name: 'description', type: 'text', required: true },
    { label: 'Corresponding DEPOT Location', name: 'externalLocationIdentifier', type: 'select', options: depotItems.map(item => ({ id: `${item.domainDTO.id}/${item.id}`, value: `${item.domainDTO.id}/${item.id}`, label: item.name })) },
    { label: 'Manager', name: 'locationManagerUserId', type: 'select', options: users.map(user => ({ id: user.uid, value: user.mail, label: `${user.commonName} ${user.surname}` })), required: true },
  ];

  return (
    <div className={`modal ${showLocationForm ? "show" : "hide"}`}>
      <div className="form-content">
        <span className="close" onClick={() => setShowLocationForm(false)}>&times;</span>
        <h1 className="form-title">NEW LOCATION</h1>
        <form onSubmit={handleSubmit} className="location-form">
          {fields.map(renderField)}
          <button type="submit" className="form-button">Create Location</button>
        </form>
      </div>
    </div>
  );
}

export default LocationForm;
