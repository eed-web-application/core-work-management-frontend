import React, { useState, useEffect } from 'react';
import { createWork, fetchWorkType, fetchLocations, fetchShopGroups, fetchLovValuesForField } from '../../services/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import './newForm.css';

const fetchData = async (fetchers) => {
    try {
        const results = await Promise.all(fetchers.map(fetcher => fetcher()));
        return results.map(result => result.payload);
    } catch (error) {
        console.error('Error fetching data:', error);
        throw error;
    }
};

function TaskForm({ showTaskForm, setShowTaskForm, selectedDomain }) {
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

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [types, locs, shops, subsystems] = await fetchData([
                    fetchWorkType,
                    fetchLocations,
                    fetchShopGroups,
                    () => fetchLovValuesForField("Activity", "664ba5674481b14757807930", "subsystem"),
                ]);
                setWorkTypes(types);
                setLocations(locs.filter(location => location.domain.id === selectedDomain));
                setShopGroups(shops.filter(shopGroup => shopGroup.domain.id === selectedDomain));
                setSubsystemGroups(subsystems);
            } catch (error) {
                console.error('Error fetching initial data:', error);
            }
        };
        fetchInitialData();
    }, [selectedDomain]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const createdWork = await createWork(workData, createWorkLogChecked);
            toast.success("Task created successfully!");
            setShowTaskForm(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating work:', error);
            toast.error("Error creating work. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, selectedOptions } = e.target;
        setWorkData(prevState => ({
            ...prevState,
            [name]: type === 'select-multiple'
                ? Array.from(selectedOptions).map(option => option.value)
                : value,
        }));
    };

    return (
        <>
            <div className={`modal-overlay ${showTaskForm ? "show" : ""}`}></div>
            <div className={`modal ${showTaskForm ? "show" : "hide"}`}>
                <div className="form-content">
                    <span className="close" onClick={() => setShowTaskForm(false)}>&times;</span>
                    <h1 className="workform-title">Create a New Task</h1>
                    <p className="form-subtitle">Please create a task</p>
                    <hr className="line" />
                    <form onSubmit={handleSubmit} className="work-form">
                        <FormGroup label="Type" id="workTypeId" name="workTypeId" value={workData.workTypeId} onChange={handleInputChange} required>
                            <option value="">Select Work Type</option>
                            {workTypes.map(type => (
                                <option key={type.id} value={type.id}>{type.title}</option>
                            ))}
                        </FormGroup>

                        <FormGroup label="Title" id="title" name="title" value={workData.title} onChange={handleInputChange} required />

                        <FormGroup label="Description" id="description" name="description" value={workData.description} onChange={handleInputChange} required />

                        <FormGroup label="Location" id="locationId" name="locationId" value={workData.locationId} onChange={handleInputChange} required>
                            <option value="">Select Location</option>
                            {locations.map(location => (
                                <option key={location.id} value={location.id}>{location.name}</option>
                            ))}
                        </FormGroup>

                        <FormGroup label="Shop Group" id="shopGroupId" name="shopGroupId" value={workData.shopGroupId} onChange={handleInputChange}>
                            <option value="">Select Shop Group</option>
                            {shopGroups.map(group => (
                                <option key={group.id} value={group.id}>{group.name}</option>
                            ))}
                        </FormGroup>

                        <FormGroup label="Subsystem Group" id="subsystemGroupId" name="subsystemGroupId" value={workData.subsystemGroupId} onChange={handleInputChange} required>
                            <option value="">Select Subsystem Group</option>
                            {subsystemGroups.map(group => (
                                <option key={group.id} value={group.id}>{group.value}</option>
                            ))}
                        </FormGroup>

                        <div>
                            <label htmlFor="createWorkLog" className="form-checkbox-label">
                                <input
                                    type="checkbox"
                                    id="createWorkLog"
                                    name="createWorkLog"
                                    checked={createWorkLogChecked}
                                    onChange={() => setCreateWorkLogChecked(prev => !prev)}
                                />
                                <span>Select to create Work Log for this Problem Ticket</span>
                            </label>
                        </div>

                        <button type="submit" className="form-button">Create Work</button>
                    </form>
                </div>
            </div>
        </>
    );
}

// Reusable FormGroup component
const FormGroup = ({ label, id, name, value, onChange, required, children }) => (
    <div className="form-group">
        <label htmlFor={id} className="form-label">
            {label}<span className="required">{required ? '*' : ''}</span>
        </label>
        {children ? (
            <select
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className="form-select"
                required={required}
                multiple={name.includes('[]')} // Handle multi-select if needed
            >
                {children}
            </select>
        ) : (
            <input
                type={name === 'description' ? 'textarea' : 'text'}
                id={id}
                name={name}
                value={value}
                onChange={onChange}
                className={name === 'description' ? 'workform-textarea' : 'form-input'}
                required={required}
            />
        )}
    </div>
);

export default TaskForm;
