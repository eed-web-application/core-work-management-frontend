import React, { useState, useEffect } from 'react';
import { createWork, fetchWorkType, fetchLocations, fetchShopGroups, fetchLovValuesForField, fetchLovValues } from '../../services/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './workForm.css';

function WorkForm({ showWorkForm, setShowWorkForm, selectedDomain }) {
    const [workData, setWorkData] = useState({
        domainId: selectedDomain,
        title: '',
        description: '',
        workTypeId: '',
        locationId: '',
        shopGroupId: '',
        subsystemGroupId: '',
        customFields: [],
    });
    const [workTypes, setWorkTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [shopGroups, setShopGroups] = useState([]);
    const [subsystemGroups, setSubsystemGroups] = useState([]);
    const [createWorkLogChecked, setCreateWorkLogChecked] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedLocationManager, setSelectedLocationManager] = useState('');

    useEffect(() => {
        const fetchWorkTypes = async () => {
            try {
                const typesResponse = await fetchWorkType();
                setWorkTypes(typesResponse.payload);
            } catch (error) {
                console.error('Error fetching work types:', error);
            }
        };
        fetchWorkTypes();
    }, []);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [locationsResponse, shopGroupsResponse] = await Promise.all([
                    fetchLocations(),
                    fetchShopGroups()
                ]);
                setLocations(locationsResponse.payload.filter(location => location.domain.id === selectedDomain) || []);
                console.log(locations);
                setShopGroups(shopGroupsResponse.payload.filter(shopGroup => shopGroup.domain.id === selectedDomain) || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [selectedDomain]);

    useEffect(() => {
        const fetchSubSystemGroups = async () => {
            try {
                const lovValuesResponse = await fetchLovValuesForField("Activity", "664ba5664481b1475780792e", "subsystem");
                const lovValues = await fetchLovValues("Activity", "664ba5664481b1475780792e");
                setSubsystemGroups(lovValuesResponse.payload);
            } catch (error) {
                console.error('Error fetching subsystem groups:', error);
            }
        };
        fetchSubSystemGroups();
    }, []);

    useEffect(() => {
        // Load form data from localStorage
        const savedData = localStorage.getItem('workData');
        if (savedData) {
            setWorkData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
        // Save form data to localStorage whenever it changes
        localStorage.setItem('workData', JSON.stringify(workData));
    }, [workData]);

    const validateForm = () => {
        const newErrors = {};

        if (!workData.title) newErrors.title = 'Title is required';
        else if (workData.title.length > 100) newErrors.title = 'Title cannot exceed 100 characters';

        if (!workData.description) newErrors.description = 'Description is required';
        if (!workData.workTypeId) newErrors.workTypeId = 'Work type is required';
        if (!workData.locationId) newErrors.locationId = 'Location is required';
        if (!workData.shopGroupId) newErrors.shopGroupId = 'Shop Group is required';
        if (!workData.subsystemGroupId) newErrors.subsystemGroupId = 'Subsystem group is required';

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;

        // Update workData
        setWorkData({ ...workData, [name]: value });

        // Handle location selection to update locationManagerUserId
        if (name === 'locationId') {
            const selectedLocation = locations.find(location => location.id === value);
            setSelectedLocationManager(selectedLocation ? selectedLocation.locationManagerUserId : '');
        }

        // Validate fields dynamically
        let newErrors = { ...errors };

        if (name === 'title') {
            if (value.length > 100) {
                newErrors.title = 'Title cannot exceed 100 characters';
            } else if (value.trim() === '') {
                newErrors.title = 'Title is required';
            } else {
                delete newErrors.title;
            }
        } else if (name === 'description') {
            if (value.trim() === '') {
                newErrors.description = 'Description is required';
            } else {
                delete newErrors.description;
            }
        } else if (name === 'workTypeId') {
            if (value.trim() === '') {
                newErrors.workTypeId = 'Work type is required';
            } else {
                delete newErrors.workTypeId;
            }
        } else if (name === 'locationId') {
            if (value.trim() === '') {
                newErrors.locationId = 'Location is required';
            } else {
                delete newErrors.locationId;
            }
        } else if (name === 'shopGroupId') {
            if (value.trim() === '') {
                newErrors.shopGroupId = 'Shop is required';
            } else {
                delete newErrors.shopGroupId;
            }
        } else if (name === 'subsystemGroupId') {
            if (value.trim() === '') {
                newErrors.subsystemGroupId = 'Subsystem is required';
            } else {
                delete newErrors.subsystemGroupId;
            }
        }

        setErrors(newErrors);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) {
            return; // Do not proceed if there are validation errors
        }

        try {
            const createdWork = await createWork(workData, createWorkLogChecked);
            toast.success("Problem reported successfully!");
            setShowWorkForm(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating work:', error);
            toast.error("Error creating work. Please try again.");
        }
    };

    return (
        <div className={`modal ${showWorkForm ? "show" : "hide"}`}>
            <div className="form-content">
                <span className="close" onClick={() => setShowWorkForm(false)}>&times;</span>
                <h1 className="workform-title">New Problem Report</h1>
                <p className="form-subtitle">Please provide the details of the problem</p>
                <hr className="line" /><br></br>

                <form onSubmit={handleSubmit} className="work-form">
                    <div className="form-group">
                        <label htmlFor="title" className="form-label">
                            Title<span className="required">*</span>
                            <FontAwesomeIcon icon={faCircleInfo} className="info-icon" title="Enter the title of the problem report." />
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={workData.title}
                            onChange={handleInputChange}
                            className={`form-input ${errors.title ? 'error' : ''}`}
                            maxLength={100}
                        />
                        {errors.title && <span className="error-text">{errors.title}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">
                            Description<span className="required">*</span>
                            <FontAwesomeIcon icon={faCircleInfo} className="info-icon" title="Provide a detailed description of the problem." />
                        </label>
                        <textarea
                            id="description"
                            name="description"
                            value={workData.description}
                            onChange={handleInputChange}
                            className={`form-input workform-textarea ${errors.description ? 'error' : ''}`}
                        />
                        {errors.description && <span className="error-text">{errors.description}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="workTypeId" className="form-label">
                            Type<span className="required">*</span>
                            <FontAwesomeIcon icon={faCircleInfo} className="info-icon" title="Select the type of work." />
                        </label>
                        <select
                            id="workTypeId"
                            name="workTypeId"
                            value={workData.workTypeId}
                            onChange={handleInputChange}
                            className={`form-select ${errors.workTypeId ? 'error' : ''}`}
                        >
                            <option value="">Select Work Type</option>
                            {workTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.title}</option>
                            ))}
                        </select>
                        {errors.workTypeId && <span className="error-text">{errors.workTypeId}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="locationId" className="form-label">
                            Location<span className="required">*</span>
                            <FontAwesomeIcon icon={faCircleInfo} className="info-icon" title="Select the location where the problem occurred." />
                        </label>
                        <select
                            id="locationId"
                            name="locationId"
                            value={workData.locationId}
                            onChange={handleInputChange}
                            className={`form-select ${errors.locationId ? 'error' : ''}`}
                        >
                            <option value="">Select Location</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>{location.name}</option>
                            ))}
                        </select>
                        {errors.locationId && <span className="error-text">{errors.locationId}</span>}
                        {/* Display Location Manager as a separate label */}
                        {selectedLocationManager && (
                            <div>
                                <label className="location-manager-label">
                                    Location Manager: {selectedLocationManager}
                                </label>
                                {/* <div className="location-manager">
                                    {selectedLocationManager}
                                </div> */}
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="shopGroupId" className="form-label">
                            Shop<span className="required">*</span>
                            <FontAwesomeIcon icon={faCircleInfo} className="info-icon" title="Select the shop group related to the problem." />
                        </label>
                        <select
                            id="shopGroupId"
                            name="shopGroupId"
                            value={workData.shopGroupId}
                            onChange={handleInputChange}
                            className={`form-select ${errors.shopGroupId ? 'error' : ''}`}
                        >
                            <option value="">Select Shop</option>
                            {shopGroups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                        {errors.shopGroupId && <span className="error-text">{errors.shopGroupId}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="subsystemGroupId" className="form-label">
                            Subsystem<span className="required">*</span>
                            <FontAwesomeIcon icon={faCircleInfo} className="info-icon" title="Select the subsystem group related to the problem." />
                        </label>
                        <select
                            id="subsystemGroupId"
                            name="subsystemGroupId"
                            value={workData.subsystemGroupId}
                            onChange={handleInputChange}
                            className={`form-select ${errors.subsystemGroupId ? 'error' : ''}`}
                        >
                            <option value="">Select Subsystem</option>
                            {subsystemGroups.map(group => (
                                <option key={group.id} value={group.id}>{group.value}</option>
                            ))}
                        </select>
                        {errors.subsystemGroupId && <span className="error-text">{errors.subsystemGroupId}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="project" className="form-label">
                            Project<span className="required">*</span>
                            <FontAwesomeIcon icon={faCircleInfo} className="info-icon" title="Select the project associated with the problem." />
                        </label>
                        <select
                            id="project"
                            name="project"
                            value={workData.project}
                            onChange={handleInputChange}
                            className={`form-select ${errors.project ? 'error' : ''}`}
                        >
                            <option value="">Select Project</option>
                            <option value="CBXFEL">CBXFEL</option>
                            <option value="COMMON">COMMON</option>
                            <option value="DASEL">DASEL</option>
                            <option value="FACET">FACET</option>
                            <option value="FACET User Area">FACET User Area</option>
                            <option value="LCLS">LCLS</option>
                            <option value="LCLS-II">LCLS-II</option>
                            <option value="LCLS-II HE">LCLS-II HE</option>
                            <option value="OTHER">OTHER</option>
                        </select>
                        {errors.project && <span className="error-text">{errors.project}</span>}
                    </div>

                    <div className="form-group">
                        <label htmlFor="urgency" className="form-label">
                            Urgency<span className="required">*</span>
                            <FontAwesomeIcon icon={faCircleInfo} className="info-icon" title="Select the urgency level of the issue." />
                        </label>
                        <select
                            id="urgency"
                            name="urgency"
                            value={workData.urgency}
                            onChange={handleInputChange}
                            className={`form-select ${errors.urgency ? 'error' : ''}`}
                        >
                            <option value="">Select Urgency</option>
                            <option value="1">Scheduled</option>
                            <option value="2">Immediate</option>
                            <option value="3">Downtime</option>
                            <option value="4">Low Priority</option>
                        </select>
                        {errors.urgency && <span className="error-text">{errors.urgency}</span>}
                    </div>


                    <button type="submit" className="form-button">Create Work</button>
                </form>
            </div>
        </div>
    );
}

export default WorkForm;
