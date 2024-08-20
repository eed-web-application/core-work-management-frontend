import React, { useEffect, useState } from 'react';
import styles from './activityDetailForm.module.css';
import { fetchLovValuesForField } from "../../services/api";

const ActivityDetailForm = ({
    workDetails,
    activity,
    activityTypes,
    activityType,
    activitySubtypes,
    handleInputChange,
    handleCustomFieldChange,
    camelToNormalCase,
    activityData,
    handleSubmit,
}) => {
    const [lovValues, setLovValues] = useState({});
    const [activeTab, setActiveTab] = useState('');

    useEffect(() => {
        const fetchLovValues = async () => {
            const lovFields = Object.entries(groupedFields)
                .filter(([key]) => key !== "Safety")
                .flatMap(([, fields]) => fields.filter(field => field.isLov));

            const fetchedValues = {};

            for (const field of lovFields) {
                try {
                    const response = await fetchLovValuesForField("Activity", "664ba5674481b14757807930", field.name);
                    console.log(`Fetched LOV values for ${field.name}:`, response);

                    const values = response.payload || [];
                    fetchedValues[field.name] = values.map(item => ({
                        id: item.id,
                        value: item.value,
                        description: item.description
                    }));
                } catch (error) {
                    console.error(`Failed to fetch LOV values for ${field.name}:`, error);
                    fetchedValues[field.name] = []; // Set to an empty array on error
                }
            }

            setLovValues(fetchedValues);
            console.log("Updated lovValues after fetch:", fetchedValues);
        };

        fetchLovValues();
    }, [activity.activityTypeId, activityType?.customFields]);

    // Group custom fields by their group name
    const groupedFields = (activityType?.customFields || []).reduce((groups, field) => {
        const group = field.group || "Other"; // Default to "Other" if no group is specified
        if (!groups[group]) {
            groups[group] = [];
        }
        groups[group].push(field);
        return groups;
    }, {});

    // Separate Boolean fields for special treatment
    const safetyFormFields = (groupedFields["Safety"] || []).filter(field => field.valueType === "Boolean");
    const nonsafetyFormFields = Object.entries(groupedFields).filter(([key]) => key !== "Safety");

    // Combine safety with nonsafety form fields for tab navigation
    const allFormFields = [["Safety", safetyFormFields], ...nonsafetyFormFields];

    useEffect(() => {
        // Initialize the active tab to the first available group
        if (allFormFields.length > 0 && !activeTab) {
            setActiveTab(allFormFields[0][0]);
        }
    }, [allFormFields, activeTab]);

    const handleTabClick = (groupName) => {
        console.log(`Tab clicked: ${groupName}`);
        setActiveTab(groupName);
    };

    return (
        <form onSubmit={handleSubmit} className={styles.workForm}>

            <div className={styles.headerContainer}>
                <h1 className={styles.title}>{activityType?.title}</h1>
                <button type="submit" className={styles.formButton}>
                    Save
                </button>
            </div>

            <div className={styles.subtitle}>
                <span className={styles.leftSubtitle}>Cater #: {workDetails.workNumber} | Job #: {activityData.activityNumber}</span>
            </div>

            {/* Two-column layout for key fields */}
            <div className={styles.twoColumnContainer}>
                <div className={styles.labelColumn}>
                    <label htmlFor="status" className={styles.formLabel}>Status</label>
                    <label htmlFor="taskType" className={styles.formLabel}>Type</label>
                    <label htmlFor="activityTypeSubtype" className={styles.formLabel}>Subtype</label>
                </div>
                <div className={styles.inputColumn}>
                    {/* Status field */}
                    <select
                        id="status"
                        name="status"
                        value={activity.status}
                        onChange={handleInputChange}
                        className={styles.formSelect}
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>

                    {/* Task Type Dropdown */}
                    <select
                        id="taskType"
                        name="taskType"
                        value={activityType?.title}
                        onChange={handleInputChange}
                        className={styles.formSelect}
                    >
                        {activityTypes.map((type) => (
                            <option key={type.id} value={type.id}>
                                {type.title}
                            </option>
                        ))}
                    </select>

                    <select
                        id="activityTypeSubtype"
                        name="activityTypeSubtype"
                        value={activityData.activityTypeSubtype}
                        onChange={handleInputChange}
                        className={styles.formSelect}
                    >
                        <option value="">Select Activity Subtype</option>
                        {activitySubtypes.map((subtype, index) => (
                            <option key={index} value={subtype}>
                                {subtype}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Standard fields */}
            <div className={styles.formGroup}>
                <label htmlFor="title" className={styles.formLabel}>Title</label>
                <input
                    type="text"
                    id="title"
                    name="title"
                    value={activity.title}
                    onChange={handleInputChange}
                    className={styles.formInput}
                />
            </div>

            <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.formLabel}>Description</label>
                <input
                    type="text"
                    id="description"
                    name="description"
                    value={activity.description}
                    onChange={handleInputChange}
                    className={styles.formInput}
                />
            </div>

            {/* Tabs navigation */}
            <div className={styles.tabContainer}>
                {allFormFields.map(([groupName]) => (
                    <button
                        key={groupName}
                        type="button"
                        className={`${styles.tabButton} ${activeTab === groupName ? styles.activeTab : ''}`}
                        onClick={() => handleTabClick(groupName)}
                    >
                        {groupName}
                    </button>
                ))}
            </div>

            {/* Render the fields for the active tab */}
            {allFormFields.map(([groupName, fields]) => (
                activeTab === groupName && (
                    <div key={groupName} className={styles.formSection}>
                        <p className={styles.formSectionHeader}>{groupName}</p>
                        {groupName === "Safety" ? (
                            <div className={styles.formCheckboxGroup}>
                                {fields.map((field) => (
                                    <div key={field.id} className={styles.formCheckboxItem}>
                                        <label htmlFor={field.name} className={styles.formCheckboxLabel}>
                                            <input
                                                type="checkbox"
                                                id={field.name}
                                                name={field.name}
                                                checked={activityData[field.name] === 'true'}
                                                onChange={(e) =>
                                                    handleCustomFieldChange(field.name, e.target.checked ? 'true' : 'false')
                                                }
                                                className={styles.formCheckbox}
                                            />
                                            {camelToNormalCase(field.label)}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            fields.map((field) => (
                                <div key={field.id} className={styles.formGroup}>
                                    <label htmlFor={field.name} className={styles.formLabel}>
                                        {camelToNormalCase(field.label)}
                                    </label>
                                    {field.valueType === "Date" ? (
                                        <input
                                            type="date"
                                            id={field.name}
                                            name={field.name}
                                            value={activityData[field.name] || ''}
                                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                                            className={styles.formInput}
                                        />
                                    ) : field.isLov ? (
                                        <select
                                            id={field.name}
                                            name={field.name}
                                            value={activityData[field.name] || ''}
                                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                                            className={styles.formSelect}
                                        >
                                            <option value="">Select {camelToNormalCase(field.label)}</option>
                                            {lovValues[field.name]?.map((option) => (
                                                <option key={option.id} value={option.value}>
                                                    {option.value}
                                                </option>
                                            ))}
                                        </select>
                                    ) : (
                                        <input
                                            type="text"
                                            id={field.name}
                                            name={field.name}
                                            value={activityData[field.name] || ''}
                                            onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                                            className={styles.formInput}
                                        />
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                )
            ))}

        </form>
    );
};

export default ActivityDetailForm;
