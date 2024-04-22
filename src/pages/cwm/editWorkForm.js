import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchAWork, fetchWorkType, fetchLocations, fetchShopGroups, fetchUsers, updateWork } from '../../services/api';
import './workForm.css';

function EditWorkForm({ showEditWorkForm, setshowEditWorkForm }) {
    const { workId } = useParams();
    const [workData, setWorkData] = useState({
        title: '',
        description: '',
        workTypeId: '',
        locationId: '',
        shopGroupId: '',
        assignedTo: [],
        customFieldValues: {},
    });
    const [workTypes, setWorkTypes] = useState([]);
    const [locations, setLocations] = useState([]);
    const [shopGroups, setShopGroups] = useState([]);
    const [customFields, setCustomFields] = useState([]);
    const [users, setUsers] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const workResponse = await fetchAWork(workId);
                const { title, description, location, shopGroup, workType, assignedTo } = workResponse.payload;

                setWorkData({
                    title,
                    description,
                    workTypeId: workType.id,
                    locationId: location.id,
                    shopGroupId: shopGroup.id,
                    assignedTo,
                    customFieldValues: {}
                });

                setWorkTypes(await fetchWorkType() || []);
                setLocations((await fetchLocations()).payload || []);
                setShopGroups(await fetchShopGroups() || []);
                setUsers((await fetchUsers()).payload || []);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };
        fetchData();
    }, [workId]);

    useEffect(() => {
        const selectedType = workTypes.find(type => type.id === workData.workTypeId);
        if (selectedType) {
            setCustomFields(selectedType.customFields || []);
        }
    }, [workData.workTypeId, workTypes]);

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const filteredCustomFields = customFields.filter(field => {
                const value = workData[field.name];
                return value !== undefined && value !== null && value !== '';
            });
    
            const customFieldValues = filteredCustomFields.map(field => ({
                id: field.id,
                value: {
                    type: field.valueType || 'String',
                    value: workData[field.name]
                }
            }));

            const updatedWorkData = {
                title: workData.title,
                description: workData.description,
                assignedTo: workData.assignedTo,
                locationId: workData.locationId,
                shopGroupId: workData.shopGroupId,
                customFieldValues
            };

            await updateWork(workId, updatedWorkData);
            alert("Work updated successfully!");
            setshowEditWorkForm(false);
            window.location.reload();
        } catch (error) {
            console.error('Error updating work:', error);
            alert("Error updating work. Please try again.");
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type } = e.target;
        const newValue = type === 'select-multiple' ? Array.from(e.target.selectedOptions).map(option => option.value) : value;
        setWorkData({ ...workData, [name]: newValue });
    };

    return (
        <div className={`modal ${showEditWorkForm ? "show" : "hide"}`}>
            <div className="form-content">
                <span className="close" onClick={() => setshowEditWorkForm(false)}>&times;</span>
                <h1 className="form-title">Edit Work</h1>
                <form onSubmit={handleSubmit} className="work-form">
                    {[
                        { label: 'Title', name: 'title', type: 'text' },
                        { label: 'Description', name: 'description', type: 'text' },
                        { label: 'Work Type', name: 'workTypeId', type: 'select', options: workTypes },
                        { label: 'Location', name: 'locationId', type: 'select', options: locations },
                        { label: 'Shop Group', name: 'shopGroupId', type: 'select', options: shopGroups },
                        { label: 'Assign To', name: 'assignedTo', type: 'select', options: users },
                        ...customFields.map(field => ({
                            label: field.label,
                            name: field.name,
                            type: 'text'
                        }))
                    ].map(field => (
                        <div key={field.name} className="form-group">
                            <label htmlFor={field.name} className="form-label">{field.label}</label>
                            {field.type === 'select' ? (
                                <select
                                    id={field.name}
                                    name={field.name}
                                    value={workData[field.name]}
                                    onChange={handleInputChange}
                                    className="form-select"
                                    multiple={field.multiple}
                                >
                                    {field.options.map(option => (
                                        <option key={option.id} value={option.id}>
                                            {option.title || option.name || option.commonName}
                                        </option>
                                    ))}
                                </select>
                            ) : (
                                <input
                                    type={field.type}
                                    id={field.name}
                                    name={field.name}
                                    value={workData[field.name]}
                                    onChange={handleInputChange}
                                    className="form-input"
                                />
                            )}
                        </div>
                    ))}
                    <button type="submit" className="form-button">Update Work</button>
                </form>
            </div>
        </div>
    );
}

export default EditWorkForm;
