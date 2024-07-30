import React, { useState, useEffect } from 'react';
import { createWork, fetchWorkType, fetchLocations, fetchShopGroups, fetchLovValuesForField } from '../../services/api';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import './workForm.css';

function TaskForm({ showTaskForm, setShowTaskForm, selectedDomain }) {
    // State to manage form input values
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
    const [createWorkLogChecked, setCreateWorkLogChecked] = useState(false); // State for checkbox

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
                // Fetch locations and shopGroups for the selected domain
                const [locationsResponse, shopGroupsResponse] = await Promise.all([
                    fetchLocations(),
                    fetchShopGroups()
                ]);
    
                // Set locations filtered by selectedDomain
                setLocations(locationsResponse.payload.filter(location => location.domain.id === selectedDomain) || []);
                // Set shopGroups filtered by selectedDomain
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
                const lovValuesResponse = await fetchLovValuesForField("Activity", "664ba5674481b14757807930", "subsystem");
                setSubsystemGroups(lovValuesResponse.payload);
            } catch (error) {
                console.error('Error fetching subsystem groups:', error);
            }
        };

        fetchSubSystemGroups();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(workData);
            const createdWork = await createWork(workData, createWorkLogChecked); // Passes createWorkLogChecked as logIf
            console.log(createdWork);
            const workId = createdWork.payload;
            console.log(workId);
    
            toast.success("Task created successfully!");
            setShowTaskForm(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating work:', error);
            toast.error("Error creating work. Please try again.");
        }
    };
    

    // Function to handle input changes
    const handleInputChange = (e) => {
        const { name, value, type } = e.target;

        // Check if the input field is a select element with multiple options
        if (type === 'select-multiple') {
            // Get an array of selected option values
            const selectedValues = Array.from(e.target.selectedOptions).map(option => option.value);
            setWorkData({ ...workData, [name]: selectedValues });
        } else {
            // For other input types, simply update the value in the state
            setWorkData({ ...workData, [name]: value });
        }
    };

    return (
        <div className={`modal ${showTaskForm ? "show" : "hide"}`}>
            <div className="form-content">
                <span className="close" onClick={() => setShowTaskForm(false)}>
                    &times;
                </span>

                <h1 className="workform-title">Create a New Task</h1> {/* Title for the form */}
                <p className="form-subtitle">Please create a task</p>
                <hr className="line" /><br></br>

                <form onSubmit={handleSubmit} className="work-form">

                    <div className="form-group">
                        <label htmlFor="workTypeId" className="form-label">Type<span className="required">*</span></label>
                        <select
                            id="workTypeId"
                            name="workTypeId"
                            value={workData.workTypeId}
                            onChange={handleInputChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select Work Type</option>
                            {workTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.title}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="title" className="form-label">Title<span className="required">*</span></label>
                        <input
                            type="text"
                            id="title"
                            name="title"
                            value={workData.title}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="description" className="form-label">Description<span className="required">*</span></label>
                        <input
                            // type="text"
                            id="description"
                            name="description"
                            value={workData.description}
                            onChange={handleInputChange}
                            className="workform-textarea"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="locationId" className="form-label">Location<span className="required">*</span></label>
                        <select
                            id="locationId"
                            name="locationId"
                            value={workData.locationId}
                            onChange={handleInputChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select Location</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>{location.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="shopGroupId" className="form-label">Shop Group<span className="required">*</span></label>
                        <select
                            id="shopGroupId"
                            name="shopGroupId"
                            value={workData.shopGroupId}
                            onChange={handleInputChange}
                            className="form-select"
                        >
                            <option value="">Select Shop Group</option>
                            {shopGroups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="subsystemGroupId" className="form-label">Subsystem Group<span className="required">*</span></label>
                        <select
                            id="subsystemGroupId"
                            name="subsystemGroupId"
                            value={workData.subsystemGroupId}
                            onChange={handleInputChange}
                            className="form-select"
                            required
                        >
                            <option value="">Select Subsystem Group</option>
                            {subsystemGroups.map(group => (
                                <option key={group.id} value={group.id}>{group.value}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label htmlFor="createWorkLog" className="form-checkbox-label">
                            <input
                                type="checkbox"
                                id="createWorkLog"
                                name="createWorkLog"
                                checked={createWorkLogChecked}
                                onChange={() => setCreateWorkLogChecked(!createWorkLogChecked)}
                            />
                            <span>Select to create Work Log for this Problem Ticket</span>
                        </label>
                    </div>

                    <button type="submit" className="form-button">Create Work</button>
                </form>

            </div>
        </div>
    );
}

export default TaskForm;
