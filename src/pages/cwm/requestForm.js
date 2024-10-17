import React, { useState, useEffect } from 'react';
import styles from './requestForm.module.css';
import { useHistory } from 'react-router-dom';
import { fetchWorkType, fetchAllLocation, fetchLOVs, fetchProjectGroups, fetchAllShopGroup, fetchSubsystems, createWork, addAttachment, fetchLocalGroupById } from '../../services/api.js';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const RequestForm = ({ isOpen, onClose, selectedDomain }) => {
  const history = useHistory();
  const [locations, setLocations] = useState([]);
  const [shopGroups, setShopGroups] = useState([]);
  const [subsystems, setSubsystems] = useState([]);
  const [projectGroups, setProjectGroups] = useState([]);
  const [workTypes, setWorkTypes] = useState([]);
  const [selectedWorkType, setSelectedWorkType] = useState('');
  const [selectedAreaManager, setSelectedAreaManager] = useState('');
  const [selectedArea, setSelectedArea] = useState('');
  const [selectedSubsystem, setSelectedSubsystem] = useState('');
  const [selectedProjectGroup, setSelectedProjectGroup] = useState('');
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    group: '',
    shop: '',
  });
  const [file, setFile] = useState(null); // File state
  const [attachmentId, setAttachmentId] = useState(null);


  // Fetch dropdown data when the form is loaded
  useEffect(() => {
    const loadDropdownData = async () => {
      const locationsData = await fetchAllLocation(selectedDomain);
      const shopGroupsData = await fetchAllShopGroup(selectedDomain);
      const workTypesData = await fetchWorkType(selectedDomain);

      setLocations(locationsData.payload);
      setShopGroups(shopGroupsData.payload);
      setWorkTypes(workTypesData.payload);
    };
    loadDropdownData();
  }, [selectedDomain]);

  // Fetch subsystems and project groups when a work type is selected
  useEffect(() => {
    const loadSubsystemsAndGroups = async () => {
      if (selectedWorkType) {
        try {
          const subsystemsData = await fetchSubsystems(selectedDomain, selectedWorkType);
          const projectGroupsData = await fetchProjectGroups(selectedDomain, selectedWorkType);

          setSubsystems(subsystemsData.payload);
          setProjectGroups(projectGroupsData.payload);
        } catch (error) {
          console.error("Error fetching subsystems or project groups", error);
          toast.error("Error fetching subsystems or project groups.");
        }
      }
    };

    loadSubsystemsAndGroups();
  }, [selectedWorkType, selectedDomain]);


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

  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  // Handle file selection for upload
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Handle form submission with file upload
  const handleSubmit = async (e) => {
    e.preventDefault();

    let attachmentResponse;
    if (file) {
      const formData = new FormData();
      formData.append('uploadFile', file);

      try {
        attachmentResponse = await addAttachment(formData);
        if (attachmentResponse.errorCode === 0) {
          setAttachmentId(attachmentResponse.payload);
        } else {
          toast.error(`Error uploading file: ${attachmentResponse.errorMessage}`);
          return;
        }
      } catch (error) {
        toast.error('Failed to upload file.');
        return;
      }
    }

    // Prepare request data
    const requestData = {
      workTypeId: selectedWorkType,
      title: formData.title,
      description: formData.description,
      locationId: selectedArea,
      shopGroupId: formData.shop,
      attachmentId: attachmentId // Include the attachmentId in the request if a file was uploaded
    };

    try {
      // Create the work request
      const response = await createWork(selectedDomain, requestData);

      if (response && response.payload) {
        toast.success('Work request created successfully!');
        setTimeout(() => {
          history.push(`/cwm/${response.payload}`);
          window.location.reload();
          onClose();
        }, 1000);
      } else {
        toast.error('Failed to create work request.');
      }
    } catch (error) {
      toast.error('Error creating work request.');
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
        <button className={styles.closeButton} onClick={onClose}>&times;</button>
        <h2>Create a New Request</h2>
        <form onSubmit={handleSubmit}>
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
                  <span className={styles.workTypeTitle}>{type.title}</span>
                  <span className={styles.subtitle}>{type.subtitle}</span>
                </button>
              ))}
            </div>
          </div>

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

          <div className={styles.formGroup}>
            <label htmlFor="area">Area</label>
            <select
              id="area"
              name="area"
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
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

          <div className={styles.formGroup}>
            <label htmlFor="areaManager">Area Manager</label>
            <input
              type="text"
              id="areaManager"
              name="areaManager"
              value={selectedAreaManager}
              readOnly
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="subsystem">Subsystem</label>
            <select
              id="subsystem"
              name="subsystem"
              value={selectedSubsystem}
              onChange={(e) => setSelectedSubsystem(e.target.value)}
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
              value={selectedProjectGroup}
              onChange={(e) => setSelectedProjectGroup(e.target.value)}
              required
            >
              <option value="">Select a Project</option>
              {projectGroups.map((project) => (
                <option key={project.id} value={project.id}>
                  {project.value}
                </option>
              ))}
            </select>
          </div>

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

          {/* File Upload Section */}
          <div className={styles.formGroup}>
            <label htmlFor="file">Attach File</label>
            <input type="file" id="file" name="file" onChange={handleFileChange} />
          </div>

          <div className={styles.modalActions}>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RequestForm;
