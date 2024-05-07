import React, { useState, useEffect } from 'react';
import { createWork, fetchWorkType, fetchLocations, fetchShopGroups, createWorkLog } from '../../services/api';
import './workForm.css';

function WorkForm({ showWorkForm, setShowWorkForm, selectedDomainId }) {
    // State to manage form input values
    const [workData, setWorkData] = useState({
        domainId: selectedDomainId,
        title: '',
        description: '',
        workTypeId: '',
        locationId: '',
        shopGroupId: '',
        customFields: [],
    });
    const [workTypes, setWorkTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [shopGroups, setShopGroups] = useState([]);
    const [createWorkLogChecked, setCreateWorkLogChecked] = useState(false); // State for checkbox

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [typesResponse, locationsResponse, shopGroupsResponse] = await Promise.all([
                    fetchWorkType(),
                    fetchLocations(),
                    fetchShopGroups(),
                ]);

                setWorkTypes(typesResponse || []);
                setLocations(locationsResponse.payload || []);
                setShopGroups(shopGroupsResponse || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            console.log(workData);
            const createdWork = await createWork(workData);
            console.log(createdWork);
            const workId = createdWork.payload;
            console.log(workId);
    
            if (createWorkLogChecked) {
                const entryData = {
                    title: workData.title,
                    description: workData.description
                };
        
                const formData = new FormData();
                formData.append('title', entryData.title); // Add the title to the formData
                formData.append('text', entryData.description);
                console.log("creating work log...")
                await createWorkLog(workId, formData);
            }
            alert("Work created successfully!");
            setShowWorkForm(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating work:', error);
            alert("Error creating work. Please try again.");
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
        <div className={`modal ${showWorkForm ? "show" : "hide"}`}>
            <div className="form-content">
                <span className="close" onClick={() => setShowWorkForm(false)}>
                    &times;
                </span>

                <h1 className="workform-title">New Problem Ticket</h1> {/* Title for the form */}
                <p className="form-subtitle">Please provide the details of the problem</p>
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

export default WorkForm;
