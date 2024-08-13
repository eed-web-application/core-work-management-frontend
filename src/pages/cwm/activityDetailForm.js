import React, { useEffect, useState } from 'react';
import styles from './activityDetailForm.module.css';
import { fetchLovValuesForField } from "../../services/api";

const ActivityDetailForm = ({
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

    return (
        <form onSubmit={handleSubmit} className={styles.workForm}>
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

            {/* Activity Type Dropdown */}
            <div className={styles.formGroup}>
                <label htmlFor="activityTypeId" className={styles.formLabel}>Activity Type</label>
                <select
                    id="activityTypeId"
                    name="activityTypeId"
                    value={activity.activityTypeId}
                    onChange={handleInputChange}
                    className={styles.formSelect}
                >
                    {activityTypes.map((type) => (
                        <option key={type.id} value={type.id}>
                            {type.title}
                        </option>
                    ))}
                </select>
            </div>

            {/* Activity Subtype Dropdown */}
            <div className={styles.formGroup}>
                <label htmlFor="activityTypeSubtype" className={styles.formLabel}>Activity Subtype</label>
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

            {/* Boolean Fields under "Safety" Group */}
            {safetyFormFields.length > 0 && (
                <div className={styles.formSection}>
                    <h3 className={styles.formSectionHeader}>Safety</h3>
                    <div className={styles.formCheckboxGroup}>
                        {safetyFormFields.map((field) => (
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
                </div>
            )}

            {/* Non-Boolean Fields grouped by their group name */}
            {nonsafetyFormFields.map(([groupName, fields]) => (
                <div key={groupName} className={styles.formSection}>
                    <h3 className={styles.formSectionHeader}>{groupName}</h3>
                    {fields.map((field) => (
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
                    ))}
                </div>
            ))}

            <div className={styles.headerContainer}>
                <button type="submit" className={styles.formButton}>
                    Update Activity
                </button>
            </div>
        </form>
    );
};

export default ActivityDetailForm;
