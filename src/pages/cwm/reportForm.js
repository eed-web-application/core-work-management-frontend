import React, { useState, useEffect } from 'react';
import styles from './requestForm.module.css';
import { fetchWorkType, fetchAllLocation, fetchAllShopGroup, fetchSubsystems, createWork } from '../../services/api.js';

const RequestForm = ({ isOpen, onClose, selectedDomain }) => {
  const [locations, setLocations] = useState([]);
  const [shopGroups, setShopGroups] = useState([]);
  const [subsystems, setSubsystems] = useState([]);
  const [workTypes, setWorkTypes] = useState([]); // For storing work types
  const [selectedWorkType, setSelectedWorkType] = useState(''); // To track selected work type
  const [selectedAreaManager, setSelectedAreaManager] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSubsystem, setSelectedSubsystem] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    group: '',
    shop: '',
  });

  // Fetch locations, shop groups, subsystems, and work types when the form is loaded
  useEffect(() => {
    const loadDropdownData = async () => {
      const locationsData = await fetchAllLocation(selectedDomain);
      const shopGroupsData = await fetchAllShopGroup(selectedDomain);
      const subsystemsData = await fetchSubsystems(selectedDomain);
      const workTypesData = await fetchWorkType(selectedDomain);

      setLocations(locationsData.payload);
      setShopGroups(shopGroupsData.payload);
      setSubsystems(subsystemsData.payload);
      setWorkTypes(workTypesData.payload);
      console.log("SELECTED DOMAIN", selectedDomain);
    };
    loadDropdownData();
  }, [selectedDomain]);

  // Fetch area manager when an area is selected
  useEffect(() => {
    if (selectedArea) {
      const fetchAreaManager = async () => {
        const selectedLocation = locations.find((location) => location.id === selectedArea);
        if (selectedLocation) {
          setSelectedAreaManager(selectedLocation.locationManagerUserId);
        }
      };
      fetchAreaManager();
    }
  }, [selectedArea, locations]);

  // Update form data on input change
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Package data into an object for the createWork API
    const requestData = {
    workTypeId: selectedWorkType,
      title: formData.title,
      description: formData.description,
      locationId: selectedArea,
      shopGroupId: formData.shop,
    };

    try {
      // Call the API to create the work request
      const response = await createWork(requestData);

      // Handle successful API response (you can modify this based on your response structure)
      if (response && response.success) {
        alert('Work request created successfully!');
        onClose(); // Close the form after successful submission
      } else {
        alert('Failed to create work request.');
      }
    } catch (error) {
      console.error('Error creating work request:', error);
      alert('An error occurred while creating the work request.');
    }
  };

  // Handle work type selection
  const handleWorkTypeClick = (workType) => {
    setSelectedWorkType(workType);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <h2>Create a New Request</h2>
        <form onSubmit={handleSubmit}>
          <div className={styles.formGroup}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">Description</label>
            <textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              required
            ></textarea>
          </div>

          {/* Dropdown for Area */}
          <div className={styles.formGroup}>
            <label htmlFor="area">Area</label>
            <select
              id="area"
              name="area"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)} // Update selected area
              required
            >
              <option value="">Select an Area</option>
              {locations.map((location) => (
                <option key={location.id} value={location.id}>
                  {location.name}
                </option>
              ))}
            </select>
          </div>

          {/* Autofilled Area Manager */}
          <div className={styles.formGroup}>
            <label htmlFor="areaManager">Area Manager</label>
            <input
              type="text"
              id="areaManager"
              name="areaManager"
              value={selectedAreaManager} // Autofill with area manager
              readOnly
              required
            />
          </div>

          {/* Subsystem Dropdown */}
          <div className={styles.formGroup}>
            <label htmlFor="subsystem">Subsystem</label>
            <select
              id="subsystem"
              name="subsystem"
              value={selectedSubsystem}
              onChange={(e) => setSelectedSubsystem(e.target.value)} // Update selected subsystem
              required
            >
              <option value="">Select a Subsystem</option>
              {subsystems.map((subsystem) => (
                <option key={subsystem.id} value={subsystem.id}>
                  {subsystem.value}
                </option>
              ))}
            </select>
          </div>

          {/* Group Input */}
          <div className={styles.formGroup}>
            <label htmlFor="group">Project</label>
            <input
              type="text"
              id="group"
              name="group"
              value={formData.group}
              onChange={handleInputChange}
              required
            />
          </div>

          {/* Shop Dropdown */}
          <div className={styles.formGroup}>
            <label htmlFor="shop">Shop</label>
            <select
              id="shop"
              name="shop"
              value={formData.shop}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a Shop Group</option>
              {shopGroups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
          </div>

          {/* Work Type Selection as Buttons */}
          <div className={styles.formGroup}>
            <label>Work Type</label>
            <div className={styles.workTypeButtons}>
              {workTypes.map((type) => (
                <button
                  key={type.id}
                  type="button"
                  className={`${styles.workTypeButton} ${selectedWorkType === type.id ? styles.selected : ''}`}
                  onClick={() => handleWorkTypeClick(type.id)}
                >
                  {type.title}
                </button>
              ))}
            </div>
          </div>

          {/* Actions */}
          <div className={styles.modalActions}>
            <button type="submit">Submit</button>
            <button type="button" onClick={onClose}>
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
