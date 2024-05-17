import React, { useState, useEffect } from "react";
import { fetchActivityType, fetchActivitySubtype, fetchAActivity, updateActivity, fetchLovValuesForField } from "../../services/api";
import { useParams } from "react-router-dom";
import "./activityForm.css";

function EditActivityForm({ showEditActivityForm, setShowEditActivityForm }) {
  const { workId, activityId } = useParams();
  const [activityData, setActivityData] = useState({});
  const [activityTypes, setActivityTypes] = useState([]);
  const [activityType, setActivityType] = useState(null);
  const [activitySubtypes, setActivitySubtypes] = useState([]);
  const [customFields, setCustomFields] = useState([]);
  const [renderedComponents, setRenderedComponents] = useState({});
  const [lovValuesDictionary, setLovValuesDictionary] = useState({});

  // prefills form with current data
  useEffect(() => {
    const fetchData = async () => {
      try {
        const workResponse = await fetchAActivity(workId, activityId);
        const { title, description, activityType, activityTypeSubtype, customFields } = workResponse.payload;
        const activityTypeId = activityType ? activityType.id : ""; // Grab activityType title
        setActivityType(activityType);

        // used to prefill the data
        const customFieldsData = {};
        customFields.forEach((field) => {
          customFieldsData[field.name] = field.value.value;
        });
        setActivityData({
          title, description, activityTypeId, activityTypeSubtype, ...customFieldsData, // Add custom fields to activityData state
        });

        // {id, name, value {type, value}}
        setCustomFields(customFields);

        const typeResponse = await fetchActivityType();
        setActivityTypes(typeResponse.payload || []);

        const subtypeResponse = await fetchActivitySubtype();
        setActivitySubtypes(subtypeResponse.payload || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [workId, activityId]);

  useEffect(() => {
    // Fetch LOV values for each field and create the dictionary
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
            if (lovValues.length > 0) { // Check if LOV values are not empty
              dictionary[field.name] = lovValues;
            }
          } else {
            console.error(
              "Error fetching LOV values for field:",
              field.name,
              lovValuesResponse.errorMessage
            );
          }
        } catch (error) {
          console.error("Error fetching LOV values for field:", field.name, error);
        }
      }
      setLovValuesDictionary(dictionary);
    };

    fetchLovValues();
  }, [activityData.activityTypeId, customFields]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const updatedActivityData = {
        title: activityData.title,
        description: activityData.description,
        activityType: {
          id: activityData.activityTypeId, // Assuming you have activityType data elsewhere
        },
        activityTypeSubtype: activityData.activityTypeSubtype,
        assignedTo: activityData.assignedTo,
        locationId: activityData.locationId,
        shopGroupId: activityData.shopGroupId,
        customFieldValues: customFields.map((field) => ({
          id: field.id,
          value: {
            type: String(field.value.type),
            value: activityData[field.name] || "",
          },
        })),
      };
      await updateActivity(workId, activityId, updatedActivityData);
      console.log(updatedActivityData);
      alert("Activity updated successfully!");
      setShowEditActivityForm(false); // Close the form
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error("Error updating activity:", error);
      alert("Error updating activity. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // If the changed input field is a custom field
    if (name in activityData) {
      // Update the value of the custom field
      setActivityData((prevActivityData) => ({
        ...prevActivityData,
        [name]: value,
      }));
    } else {
      // If it's a standard field like title, description, etc.
      setActivityData((prevActivityData) => ({
        ...prevActivityData,
        [name]: value,
      }));
    }
  };

  const handleCustomFieldChange = (fieldName, selectedValue) => {
    console.log("Custom field changed:", fieldName, selectedValue);
    setActivityData((prevActivityData) => {
      return {
        ...prevActivityData,
        [fieldName]: selectedValue,
      };
    });
  };

  // Utility function to convert camelCase to normal casing
  const camelToNormalCase = (camelCase) => {
    const words = camelCase.split(/(?=[A-Z])/); // Split camelCase string into words
    return words
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className={`modal ${showEditActivityForm ? "show" : "hide"}`}>
      <div className="form-content">
        <span className="close" onClick={() => setShowEditActivityForm(false)}>
          &times;
        </span>

        <h1 className="form-title">UPDATE ACTIVITY</h1>

        <form onSubmit={handleSubmit} className="work-form">
          <div className="form-group">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={activityData.title}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="description" className="form-label">
              Description
            </label>
            <input
              type="text"
              id="description"
              name="description"
              value={activityData.description}
              onChange={handleInputChange}
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label htmlFor="activityTypeId" className="form-label">
              Activity Type
            </label>
            <select
              id="activityTypeId"
              name="activityTypeId"
              value={activityData.activityTypeId}
              onChange={handleInputChange}
              className="form-select"
            >
              {activityTypes.map((type) => (
                <option key={type.id} value={type.id}>
                  {type.title}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="activityTypeSubtype" className="form-label">
              Activity Subtype
            </label>
            <select
              id="activityTypeSubtype"
              name="activityTypeSubtype"
              value={activityData.activityTypeSubtype}
              onChange={handleInputChange}
              className="form-select"
            >
              <option value="">Select Activity Subtype</option>
              {activitySubtypes.map((subtype, index) => (
                <option key={index} value={subtype}>
                  {subtype}
                </option>
              ))}
            </select>
          </div>

          {/* Mapping over customFields to render fields */}
          {activityType && activityType.customFields &&
            activityType.customFields.map((field) => (
              <div key={field.id} className="form-group">
                <label htmlFor={field.name} className="form-label">
                  {camelToNormalCase(field.label)}
                </label>
                {/* Check if field name exists in lovValuesDictionary and if valueType is not 'Boolean' */}
                {field.valueType === "Date" ? ( // Check if valueType is 'Date'
                <input
                    type="date" // Use input type date for date values
                    id={field.name}
                    name={field.name}
                    value={activityData[field.name] || ""}
                    onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                    className="form-input"
                />
            ) : field.name in lovValuesDictionary && field.valueType !== 'Boolean' ? (
                <select
                    id={field.name}
                    name={field.name}
                    value={activityData[field.name]}
                    onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                    className="form-select"
                >
                    {lovValuesDictionary[field.name].map((option) => (
                        <option key={option.id} value={option.id}>
                            {option.value}
                        </option>
                    ))}
                </select>
            ) : field.valueType === "Boolean" ? (
                <select
                    id={field.name}
                    name={field.name}
                    value={activityData[field.name]}
                    onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                    className="form-select"
                >
                    <option value="true">True</option>
                    <option value="false">False</option>
                </select>
            ) : (
                <input
                    type="text"
                    id={field.name}
                    name={field.name}
                    value={activityData[field.name] || ""}
                    onChange={(e) => handleCustomFieldChange(field.name, e.target.value)}
                    className="form-input"
                />
            )}
              </div>
            ))}




          <button type="submit" className="form-button">
            Update Activity
          </button>
        </form>
      </div>
    </div>
  );
}

export default EditActivityForm;
