import React, { useState, useEffect } from 'react';
import styles from './requestForm.module.css';
import { useHistory } from 'react-router-dom';
import { fetchWorkType, fetchAllLocation, fetchAllShopGroup, fetchSubsystems, createWork } from '../../services/api.js';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const workTypesData = [
  { id: '66f5cb9ee9c61524e1cec2e5', title: 'Report - HW', subtitle: 'A problem that needs attention' },
  { id: '66f5cb9de9c61524e1cec2e4', title: 'Request - HW', subtitle: 'Work to be done' }
];

// Define the project options
const projectOptions = [
  "CBXFEL Project", 
  "COMMON", 
  "DASEL", 
  "FACET", 
  "FACET User Area", 
  "LCLS", 
  "LCLS-II", 
  "LCLS-II HE Project", 
  "OTHER"
];

const RequestForm = ({ isOpen, onClose, selectedDomain }) => {
  const history = useHistory();
  const [locations, setLocations] = useState([]);
  const [shopGroups, setShopGroups] = useState([]);
  const [subsystems, setSubsystems] = useState([]);
  // const [workTypes, setWorkTypes] = useState([]); // For storing work types
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
      // setWorkTypes(workTypesData.payload);
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
      if (response && response.payload) {
        toast.success('Work request created successfully!');
        console.log(response.payload);

        // Set a delay for history push
        setTimeout(() => {
          history.push(`/cwm/${response.payload}`);
          window.location.reload(); // Reload the page if necessary
          onClose();
        }, 1000);
      } else {
        toast.error('Failed to create work request.');
      }
    } catch (error) {
      console.error('Error creating work request:', error);
      toast.error('An error occurred while creating the work request.');
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
        {/* X Icon for closing */}
        <button className={styles.closeButton} onClick={onClose}>
          &times;
        </button>
        <h2>Create a New Request</h2>
        <form onSubmit={handleSubmit}>
{/* Work Type Selection with subtitles */}
<div className={styles.formGroup}>
      <label>Work Type</label>
      <div className={styles.workTypeButtons}>
        {workTypesData.map((type) => (
          <button
            key={type.id}
            type="button"
            className={`${styles.workTypeButton} ${selectedWorkType === type.id ? styles.selected : ''}`}
            onClick={() => handleWorkTypeClick(type.id)}
          >
            <span className={styles.workTypeTitle}>{type.title}</span>
            <span className={styles.subtitle}>{type.subtitle}</span>
          </button>
        ))}
      </div>
    </div>
          {/* Work Type Selection as Buttons */}
          {/* <div className={styles.formGroup}>
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
          </div> */}

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

          <div className={styles.formGroup}>
            <label htmlFor="group">Project</label>
            <select
              id="group"
              name="group"
              value={formData.group}
              onChange={handleInputChange}
              required
            >
              <option value="">Select a Project</option>
              {projectOptions.map((project, index) => (
                <option key={index} value={project}>
                  {project}
                </option>
              ))}
            </select>
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

          {/* Actions */}
          <div className={styles.modalActions}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
