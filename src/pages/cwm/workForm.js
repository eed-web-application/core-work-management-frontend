import React, { useState, useEffect } from 'react';
import { createWork, fetchWorkType, fetchAllLocation, fetchAllShopGroup, fetchLovValuesForField, fetchLovValues } from '../../services/api';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCircleInfo } from "@fortawesome/free-solid-svg-icons";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './newForm.css';

function WorkForm({ showWorkForm, setShowWorkForm, selectedDomain }) {
    const [workData, setWorkData] = useState({
        domainId: selectedDomain,
        title: '',
        description: '',
        workTypeId: '',
        locationId: '',
        shopGroupId: '',
        subsystemGroupId: '',
        project: '',
        urgency: '',
    });
    const [workTypes, setWorkTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [shopGroups, setShopGroups] = useState([]);
    const [subsystemGroups, setSubsystemGroups] = useState([]);
    const [createWorkLogChecked, setCreateWorkLogChecked] = useState(false);
    const [errors, setErrors] = useState({});
    const [selectedLocationManager, setSelectedLocationManager] = useState('');
    const [projectGroup, setProjectGroup] = useState([]);
    const [urgencyGroup, setUrgencyGroup] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typesResponse, locationsResponse, shopGroupsResponse, subsystemGroupsResponse, projectGroupsResponse, urgencyGroupsResponse] = await Promise.all([
                    fetchWorkType(),
                    fetchAllLocation(),
                    fetchAllShopGroup(),
                    fetchLovValuesForField("Activity", "664ba5664481b1475780792e", "subsystem"),
                    fetchLovValuesForField("Activity", "664ba5664481b1475780792e", "project"),
                    fetchLovValuesForField("Work", "664ba5644481b147578078bc", "urgency")
                ]);
                setWorkTypes(typesResponse.payload);
                setLocations(locationsResponse.payload.filter(location => location.domain.id === selectedDomain) || []);
                setShopGroups(shopGroupsResponse.payload.filter(shopGroup => shopGroup.domain.id === selectedDomain) || []);
                setSubsystemGroups(subsystemGroupsResponse.payload);
                setProjectGroup(projectGroupsResponse.payload);
                setUrgencyGroup(urgencyGroupsResponse.payload);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, [selectedDomain]);

    useEffect(() => {
        const savedData = localStorage.getItem('workData');
        if (savedData) {
            setWorkData(JSON.parse(savedData));
        }
    }, []);

    useEffect(() => {
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
        const updatedData = { ...workData, [name]: value };
        
        if (name === 'locationId') {
            const selectedLocation = locations.find(location => location.id === value);
            setSelectedLocationManager(selectedLocation ? selectedLocation.locationManagerUserId : '');
        }

        setWorkData(updatedData);
        validateField(name, value);
    };

    const validateField = (name, value) => {
        let newErrors = { ...errors };

        if (name === 'title') {
            if (value.trim() === '') newErrors.title = 'Title is required';
            else if (value.length > 100) newErrors.title = 'Title cannot exceed 100 characters';
            else delete newErrors.title;
        } else if (name === 'description') {
            if (value.trim() === '') newErrors.description = 'Description is required';
            else delete newErrors.description;
        } else if (name === 'workTypeId') {
            if (value.trim() === '') newErrors.workTypeId = 'Work type is required';
            else delete newErrors.workTypeId;
        } else if (name === 'locationId') {
            if (value.trim() === '') newErrors.locationId = 'Location is required';
            else delete newErrors.locationId;
        } else if (name === 'shopGroupId') {
            if (value.trim() === '') newErrors.shopGroupId = 'Shop is required';
            else delete newErrors.shopGroupId;
        } else if (name === 'subsystemGroupId') {
            if (value.trim() === '') newErrors.subsystemGroupId = 'Subsystem is required';
            else delete newErrors.subsystemGroupId;
        }

        setErrors(newErrors);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        if (!validateForm()) return;

        try {
            const response = await createWork(workData, createWorkLogChecked);
            window.location.href = `/cwm/${response}`;
            toast.success("Problem reported successfully!");
        } catch (error) {
            console.error('Error creating work:', error);
            toast.error("Error creating work. Please try again.");
        }
    };

    const renderSelectOptions = (options) => options.map(option => (
        <option key={option.id || option.value} value={option.id || option.value}>
            {option.title || option.name || option.value}
        </option>
    ));

    return (
        <div>
            <div className={`modal-overlay ${showWorkForm ? "show" : ""}`}></div>
            <div className={`modal ${showWorkForm ? "show" : "hide"}`}>
                <div className="form-content">
                    <span className="close" onClick={() => setShowWorkForm(false)}>&times;</span>
                    <h1 className="workform-title">New Problem Report</h1>
                    <p className="form-subtitle">Please provide the details of the problem</p>
                    <hr className="line" />

                    <form onSubmit={handleSubmit} className="work-form">
                        {Object.entries({
                            title: 'Title',
                            description: 'Description',
                            workTypeId: 'Type',
                            locationId: 'Location',
                            shopGroupId: 'Shop',
                            subsystemGroupId: 'Subsystem',
                            project: 'Project',
                            urgency: 'Urgency'
                        }).map(([key, label]) => (
                            <div className="form-group" key={key}>
                                <label htmlFor={key} className="form-label">
                                    {label}<span className="required">*</span>
                                    <FontAwesomeIcon icon={faCircleInfo} className="info-icon" title={`Select ${label.toLowerCase()} of the problem.`} />
                                </label>
                                {key === 'description' ? (
                                    <textarea
                                        id={key}
                                        name={key}
                                        value={workData[key]}
                                        onChange={handleInputChange}
                                        className={`form-input workform-textarea ${errors[key] ? 'error' : ''}`}
                                    />
                                ) : key === 'workTypeId' || key === 'locationId' || key === 'shopGroupId' || key === 'subsystemGroupId' || key === 'project' || key === 'urgency' ? (
                                    <select
                                        id={key}
                                        name={key}
                                        value={workData[key]}
                                        onChange={handleInputChange}
                                        className={`form-select ${errors[key] ? 'error' : ''}`}
                                    >
                                        <option value="">Select {label}</option>
                                        {key === 'project' ? renderSelectOptions(projectGroup) :
                                         key === 'urgency' ? renderSelectOptions(urgencyGroup) :
                                         key === 'workTypeId' ? renderSelectOptions(workTypes) :
                                         key === 'locationId' ? renderSelectOptions(locations) :
                                         key === 'shopGroupId' ? renderSelectOptions(shopGroups) :
                                         renderSelectOptions(subsystemGroups)}
                                    </select>
                                ) : (
                                    <input
                                        type={key === 'description' ? 'textarea' : 'text'}
                                        id={key}
                                        name={key}
                                        value={workData[key]}
                                        onChange={handleInputChange}
                                        className={`form-input ${errors[key] ? 'error' : ''}`}
                                    />
                                )}
                                {errors[key] && <span className="error-text">{errors[key]}</span>}
                                {key === 'locationId' && selectedLocationManager && (
                                    <div>
                                        <label className="location-manager-label">
                                            Location Manager: {selectedLocationManager}
                                        </label>
                                    </div>
                                )}
                            </div>
                        ))}

                        <div className="button-container">
                            <button type="submit" className="form-button">Create Work</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default WorkForm;
