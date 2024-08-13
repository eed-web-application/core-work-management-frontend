import React, { useState, useEffect } from "react";
import { fetchAActivity, fetchActivityType, fetchActivitySubtype, fetchLovValuesForField } from "../../services/api";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import "./workDetails.css";

const ActivityForm = ({ workId, activity, onClose }) => {
  const [activityData, setActivityData] = useState({});
  const [activityTypes, setActivityTypes] = useState([]);
  const [activitySubtypes, setActivitySubtypes] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [lovValuesDictionary, setLovValuesDictionary] = useState({});
  const [safetyForms, setSafetyForms] = useState({
    radSafetyWorkCtlForm: false,
    lockAndTag: false,
    ppsInterlocked: false,
    atmosphericWorkControlForm: false,
    electricSysWorkCtlForm: false,
  });

  useEffect(() => {
    const fetchCustomData = async (workId, activityId) => {
      try {
        const workResponse = await fetchAActivity(workId, activityId);
        const { title, description, activityType, activityTypeSubtype, customFields } = workResponse.payload;
        const activityTypeId = activityType ? activityType.id : "";

        setActivityData({
          title,
          description,
          activityTypeId,
          activityTypeSubtype,
        });

        setCustomFields(customFields);

        const typeResponse = await fetchActivityType();
        setActivityTypes(typeResponse.payload || []);

        const subtypeResponse = await fetchActivitySubtype();
        setActivitySubtypes(subtypeResponse.payload || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchCustomData(workId, activity.id);
  }, [workId, activity.id]);

  useEffect(() => {
    const fetchLovValues = async () => {
      const dictionary = {};
      for (const field of customFields) {
        try {
          const lovValuesResponse = await fetchLovValuesForField("Activity", activityData.activityTypeId, field.name);
          if (lovValuesResponse.errorCode === 0) {
            const lovValues = lovValuesResponse.payload.map((value) => ({
              id: value.id,
              value: value.value,
            }));
            dictionary[field.name] = lovValues;
          } else {
            console.error("Error fetching LOV values:", lovValuesResponse.errorMessage);
          }
        } catch (error) {
          console.error("Error fetching LOV values for field:", field.name, error);
        }
      }
      setLovValuesDictionary(dictionary);
    };

    fetchLovValues();
  }, [activityData.activityTypeId, customFields]);

  const handleInputChange = (e) => {
    setActivityData({
      ...activityData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCustomFieldChange = (fieldName, value) => {
    setActivityData({
      ...activityData,
      [fieldName]: value,
    });
  };

  const handleSafetyFormChange = (formName) => {
    setSafetyForms((prevForms) => ({
      ...prevForms,
      [formName]: !prevForms[formName],
    }));
    setActivityData((prevData) => ({
      ...prevData,
      [formName]: !prevForms[formName] ? "true" : "false",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      toast.success("Activity updated successfully!");
      onClose();
    } catch (error) {
      console.error("Error updating activity:", error);
      toast.error("Failed to update activity.");
    }
  };

  return (
    <div className="job-detail">
      <h1 className="form-title">Task Details</h1>
      <form onSubmit={handleSubmit} className="work-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">Title</label>
          <input type="text" id="title" name="title" value={activityData.title || ""} onChange={handleInputChange} className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="description" className="form-label">Description</label>
          <input type="text" id="description" name="description" value={activityData.description || ""} onChange={handleInputChange} className="form-input" />
        </div>
        <div className="form-group">
          <label htmlFor="activityTypeId" className="form-label">Activity Type</label>
          <select id="activityTypeId" name="activityTypeId" value={activityData.activityTypeId || ""} onChange={handleInputChange} className="form-select">
            {activityTypes.map((type) => (
              <option key={type.id} value={type.id}>{type.title}</option>
            ))}
          </select>
        </div>
        <div className="form-group">
          <label htmlFor="activityTypeSubtype" className="form-label">Activity Subtype</label>
          <select id="activityTypeSubtype" name="activityTypeSubtype" value={activityData.activityTypeSubtype || ""} onChange={handleInputChange} className="form-select">
            <option value="">Select Activity Subtype</option>
            {activitySubtypes.map((subtype, index) => (
              <option key={index} value={subtype}>{subtype}</option>
            ))}
          </select>
        </div>
        <div className="safety-forms-section">
          <h3>Safety Forms Required</h3>
          {Object.keys(safetyForms).map((formName) => (
            <div key={formName} className="form-group">
              <label htmlFor={formName} className="form-label">{formName.replace(/([A-Z])/g, " $1")}</label>
              <input type="checkbox" id={formName} name={formName} checked={safetyForms[formName]} onChange={() => handleSafetyFormChange(formName)} className="form-checkbox" />
            </div>
          ))}
        </div>
        {customFields.map((field) => (
          <div key={field.id} className="form-group">
            <label htmlFor={field.name} className="form-label">{field.label}</label>
            {field.valueType === "Date" ? (
              <input type="date" id={field.name} name={field.name} value={activityData[field.name] || ""} onChange={(e) => handleCustomFieldChange(field.name, e.target.value)} className="form-input" />
            ) : field.name in lovValuesDictionary && field.valueType !== 'Boolean' ? (
              <select id={field.name} name={field.name} value={activityData[field.name] || ""} onChange={(e) => handleCustomFieldChange(field.name, e.target.value)} className="form-select">
                {lovValuesDictionary[field.name].map((option) => (
                  <option key={option.id} value={option.id}>{option.value}</option>
                ))}
              </select>
            ) : field.valueType === "Boolean" ? (
              <select id={field.name} name={field.name} value={activityData[field.name] || ""} onChange={(e) => handleCustomFieldChange(field.name, e.target.value)} className="form-select">
                <option value="true">True</option>
                <option value="false">False</option>
              </select>
            ) : (
              <input type="text" id={field.name} name={field.name} value={activityData[field.name] || ""} onChange={(e) => handleCustomFieldChange(field.name, e.target.value)} className="form-input" />
            )}
          </div>
        ))}
        <button type="submit" className="form-button">Update Activity</button>
      </form>
    </div>
  );
};

export default ActivityForm;
