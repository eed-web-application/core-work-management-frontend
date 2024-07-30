import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import DatePicker from 'react-datepicker'; // Importing React Datepicker
import 'react-datepicker/dist/react-datepicker.css';
import { createActivity, fetchActivityType, fetchAWork, fetchLovValuesForField, createActivityLog } from '../../services/api';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';
import './activityForm.css';

function ActivityForm({ showActivityForm, setShowActivityForm }) {
    const { workId } = useParams();
    const [activityData, setActivityData] = useState({
        title: '',
        description: '',
        activityTypeId: '',
        activityTypeSubtype: "BugFix",
        customFields: [],
        customFieldValues: {},
    });
    const [activityTypes, setActivityTypes] = useState([]);
    const [activityTypesFetched, setActivityTypesFetched] = useState(false);
    const [createActivityLogChecked, setCreateActivityLogChecked] = useState(false); // State for checkbox

    useEffect(() => {
        const fetchWorkAndActivityData = async () => {
            try {
                const worktypeResponse = await fetchAWork(workId);
                const title = worktypeResponse.payload.workType.title;

                if (!activityTypesFetched) {
                    const typeResponse = await fetchActivityType();
                    setActivityTypes(typeResponse.payload || []);
                    setActivityTypesFetched(true);
                }

                let defaultActivityTypeId = '';

                if (title.startsWith("Software")) {
                    const softwareTask = activityTypes.find(type => type.title === "Software Task");
                    defaultActivityTypeId = softwareTask ? softwareTask.id : '';
                } else if (title.startsWith("Hardware")) {
                    const hardwareTask = activityTypes.find(type => type.title === "Hardware Task");
                    defaultActivityTypeId = hardwareTask ? hardwareTask.id : '';
                } else if (title.startsWith("General")) {
                    const generalTask = activityTypes.find(type => type.title === "General Task");
                    defaultActivityTypeId = generalTask ? generalTask.id : '';
                }

                if (defaultActivityTypeId) {
                    handleActivityTypeChange(defaultActivityTypeId);
                }
            } catch (error) {
                console.error('Error fetching activity data:', error);
            }
        };

        fetchWorkAndActivityData();
    }, [activityTypesFetched, workId]);
    
    const fetchCustomFieldsData = async (typeId, customFields) => {
        try {
            const customFieldsData = await Promise.all(
                customFields.map(async field => {
                    try {
                        if (!field.isLov) {
                            return {
                                ...field,
                                isLov: false,
                                valueType: field.valueType
                            };
                        } else {
                            const lovValuesResponse = await fetchLovValuesForField("Activity", typeId, field.name);
                            if (lovValuesResponse.errorCode === 0) {
                                return {
                                    ...field,
                                    isLov: true,
                                    valueType: lovValuesResponse.payload.map(value => ({ id: value.id, value: value.value }))
                                };
                            } else {
                                console.error('Error fetching LOV values for field:', field.name, lovValuesResponse.errorMessage);
                                throw new Error(lovValuesResponse.errorMessage);
                            }
                        }
                    } catch (error) {
                        console.error('Error fetching LOV values for field:', field.name, error.message);
                        throw new Error(error.message);
                    }
                })
            );
            return customFieldsData;
        } catch (error) {
            console.error('Error fetching custom fields data:', error);
            throw new Error(error.message);
        }
    };

    const handleActivityTypeChange = async (typeId) => {
        try {
            const type = activityTypes.find(type => type.id === typeId);
            if (type) {
                const customFieldsData = await fetchCustomFieldsData(typeId, type.customFields || []);
                setActivityData({
                    ...activityData,
                    activityTypeId: typeId,
                    customFields: customFieldsData
                });
            }
        } catch (error) {
            console.error('Error fetching custom fields:', error);
        }
    };

    const handleCustomFieldDateValueChange = (date, fieldId) => {
        const formattedDate = date ? new Date(date).toLocaleString('en-US', { timeZone: 'UTC', month: '2-digit', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }) : '';
        setActivityData({
            ...activityData,
            customFieldValues: {
                ...activityData.customFieldValues,
                [fieldId]: formattedDate
            }
        });
    };

    const handleCustomFieldValueChange = (e, fieldId) => {
        const { value } = e.target;
        setActivityData({
            ...activityData,
            customFieldValues: {
                ...activityData.customFieldValues,
                [fieldId]: value
            }
        });
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const customFieldValues = activityData.customFields.reduce((acc, field) => {
                const value = activityData.customFieldValues[field.id];
                if (value !== null && value !== undefined && value !== '') {
                    const formattedValue = {
                        type: field.valueType === "Boolean" ? "Boolean" :
                              field.valueType === "Date" ? "Date" :
                              field.valueType === "Number" ? "Number" : "String",
                        value: field.valueType === "Boolean" ? (value === "true") :
                               field.valueType === "Date" ? new Date(value).toISOString() :
                               field.valueType === "Number" ? parseFloat(value) : value
                    };
                    acc.push({ id: field.id, value: formattedValue });
                }
                return acc;
            }, []);

            const formData = {
                title: activityData.title,
                description: activityData.description,
                activityTypeId: activityData.activityTypeId,
                activityTypeSubtype: activityData.activityTypeSubtype,
                schedulingProperty: activityData.schedulingProperty,
                customFieldValues: customFieldValues,
            };


            console.log(formData);
            const createdActivity = await createActivity(workId, formData);
            const activityId = createdActivity.payload;

            if (createActivityLogChecked) {
                const entryData = {
                    title: activityData.title,
                    description: activityData.description
                };
        
                const formData = new FormData();
                formData.append('title', entryData.title); // Add the title to the formData
                formData.append('text', entryData.description);
                console.log("creating work log...")
                await createActivityLog(workId, activityId, formData);
            }

            toast.success("Activity created successfully!");
            setShowActivityForm(false);
            window.location.reload();
        } catch (error) {
            console.error('Error creating activity:', error, error.message);
            toast.error(`Error creating activity: ${error.message || "Please try again."}`);
        }
    };

    const renderCustomFieldInput = (field) => {
        if (field.isLov) {
            return (
                <select id={field.id} name={field.id} value={activityData.customFieldValues[field.id] || ''} onChange={(e) => handleCustomFieldValueChange(e, field.id)} className="form-select">
                    <option value="">Select</option>
                    {field.valueType.map((value, index) => (<option key={index} value={value.id}>{value.value}</option>))}
                </select>
            );
        } else {
            if (field.valueType === "Boolean") {
                return (
                    <select id={field.id} name={field.id} value={activityData.customFieldValues[field.id] || ''} onChange={(e) => handleCustomFieldValueChange(e, field.id)} className="form-select">
                        <option value="">Select</option>
                        <option value="true">True</option>
                        <option value="false">False</option>
                    </select>
                );
            } else if (field.valueType === "Date") {
                return (<DatePicker selected={activityData.customFieldValues[field.id] ? new Date(activityData.customFieldValues[field.id]) : null} onChange={(date) => handleCustomFieldDateValueChange(date, field.id)} className="form-input" />);
            } else if (field.valueType === "Number") {
                return (<input id={field.id} name={field.id} type="number" value={activityData.customFieldValues[field.id] || ''} onChange={(e) => handleCustomFieldValueChange(e, field.id)} className="form-input" />);
            } else {
                return (<input id={field.id} name={field.id} value={activityData.customFieldValues[field.id] || ''} onChange={(e) => handleCustomFieldValueChange(e, field.id)} className="form-input" />);
            }
        }
    };

    const renderCustomFieldsBySection = () => {
        const sections = {};
        activityData.customFields.forEach(field => {
            const section = field.group || "Other";
            if (!sections[section]) {
                sections[section] = [];
            }
            sections[section].push(field);
        });

        return Object.keys(sections).map(section => (
            <div key={section}>
                <h3 style={{ color: 'black' }}>{section}</h3>
                {sections[section].map(field => (
                    <div key={field.id} className="form-group">
                        <label htmlFor={field.id} className="form-label">{field.label}</label>
                        {renderCustomFieldInput(field)}
                    </div>
                ))}
            </div>
        ));
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setActivityData({ ...activityData, [name]: value });
    };

    const renderNewFields = () => {
        const fields = [{ id: 'title', label: 'Title', type: 'text', section: 'General Information' }, { id: 'description', label: 'Description', type: 'textarea', section: 'General Information' }];
        return fields.map(field => (
            <div key={field.id} className="form-group">
                <label htmlFor={field.id} className="form-label">{field.label}<span className="required">*</span></label>
                {field.type === 'textarea' ? (
                    <textarea id={field.id} name={field.id} value={activityData[field.id] || ''} onChange={handleInputChange} className="form-input" required={field.required}></textarea>
                ) : (
                    <input id={field.id} name={field.id} type={field.type} value={activityData[field.id] || ''} onChange={handleInputChange} className="form-input" required={field.required} />
                )}
            </div>
        ));
    };

    return (
        <div className={`modal ${showActivityForm ? "show" : "hide"}`}>
            <div className="activityform-content">
                <span className="close" onClick={() => setShowActivityForm(false)}>&times;</span>
                <p className="activityform-title">New Task</p>
                <hr className="line" /><br></br>
                <form onSubmit={handleSubmit} className="work-form">
                    <div className="form-group">
                        <label className="form-label">Type<span className="required">*</span></label>
                        <div className="button-group">
                            {activityTypes.map(type => (
                                <button key={type.id} type="button" className={`activity-type-button ${activityData.activityTypeId === type.id ? 'selected' : ''}`} onClick={() => handleActivityTypeChange(type.id)}>{type.title}</button>
                            ))}
                        </div>
                    </div>

                    {renderNewFields()}
                    {renderCustomFieldsBySection()}

                    {/* <div className="form-group">
                        <label htmlFor="createActivityLog" className="form-checkbox-label">
                            <input
                                type="checkbox"
                                id="createActivityLog"
                                name="createActivityLog"
                                checked={createActivityLogChecked}
                                onChange={() => setCreateActivityLogChecked(!createActivityLogChecked)}
                            />
                            <span>Select to create Log Entry for this Task</span>
                        </label>
                    </div> */}

                    <button type="submit" className="activityform-button">Create Task</button>
                </form>
            </div>
        </div>
    );
}

export default ActivityForm;
