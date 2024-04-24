import React, { useState, useEffect } from "react";
import { createInventoryClass, fetchAllClass, fetchClass } from "../../services/api";
import './classForm.css';

function ClassForm({ showClassForm, setShowClassForm }) {
  // State for managing form input values
  const [className, setClassName] = useState("");
  const [classesName, setClassesName] = useState([]);
  const [classDescription, setClassDescription] = useState("");
  const [attributes, setAttributes] = useState([]);
  const [permittedChildClass, setPermittedChildClass] = useState("");
  const [implementedByClass, setImplementedByClass] = useState("");
  const [extendsClass, setExtendsClass] = useState("");
  const [extendsClassAttributes, setExtendsClassAttributes] = useState([]);
  const [selectedExtendsClass, setSelectedExtendsClass] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetchAllClass();
        if (response.errorCode === 0) {
          setClassesName(response.payload.map(({ id, name }) => ({ id, name })));
        } else {
          throw new Error("Error fetching elements");
        }
      } catch (error) {
        console.error("Error fetching elements:", error.message);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    const fetchExtendsClassAttributes = async () => {
      try {
        if (selectedExtendsClass) {
          const { errorCode, payload } = await fetchClass(selectedExtendsClass);
          if (errorCode === 0) setExtendsClassAttributes(payload.attributes || []);
          else throw new Error("Error fetching extendsClass details");
        }
      } catch (error) {
        console.error("Error fetching extendsClass details:", error.message);
      }
    };
    fetchExtendsClassAttributes();
  }, [selectedExtendsClass]);

  const handleChange = (event) => {
    const selectedClassId = event.target.value;
    setSelectedExtendsClass(selectedClassId);
    // Set extendsClass based on the selected class name
    const selectedClass = classesName.find(
      (classes) => classes.id === selectedClassId
    );
    setExtendsClass(selectedClass ? selectedClass.id : "");
  };

  // Utility function to capitalize the first letter and replace "-" with a space
  const formatAttributeName = (name) => {
    return typeof name === 'string' ? name.charAt(0).toUpperCase() + name.slice(1).replace(/-/g, " ") : '';
  };

  // Handle attribute changes for both extendsClassAttributes and other attributes
  const handleAttributeChange = (index, key, value) => {
    if (key === "extendsClassAttribute") {
      // Handle extendsClassAttributes separately
      const updatedExtendsClassAttributes = [...extendsClassAttributes];
      updatedExtendsClassAttributes[index] = {
        ...updatedExtendsClassAttributes[index],
        description: formatAttributeName(value),
      };
      setExtendsClassAttributes(updatedExtendsClassAttributes);
    } else {
      // Handle other attributes
      const updatedAttributes = [...attributes];
      updatedAttributes[index][key] = formatAttributeName(value);
      setAttributes(updatedAttributes);
    }
  };

  // Adds an empty attribute to the attributes state
  const addAttribute = () => {
    setAttributes([
      ...attributes,
      { name: "", description: "", mandatory: true, type: "String", unit: "" }
    ]);
  };

  // Submits the form data to create a new class
  const handleSubmit = async (event) => {
    event.preventDefault();

    // Create an array of attribute objects based on user input and extendsClassAttributes
    const formattedAttributes = [
      ...extendsClassAttributes.map(({ name, description, mandatory, type, unit }) => ({ name, description, mandatory, type, unit })),
      ...attributes.map(({ name, description, mandatory, type, unit }) => ({ name, description, mandatory, type, unit }))
    ];

    // Create the class data with the desired structure
    const classData = {
      name: className,
      description: classDescription,
      extendsClass: extendsClass ? [extendsClass] : [],
      permittedChildClass: permittedChildClass ? [permittedChildClass] : [],
      implementedByClass: implementedByClass ? [implementedByClass] : [],
      attributes: formattedAttributes,
    };

    console.log(classData);
    const response = await createInventoryClass(classData);
    setShowClassForm(false);
    window.location.reload();
  };

  return (
    <div className={`modal ${showClassForm ? "show" : "hide"}`}>
      <div className="form-content">
        <span className="close" onClick={() => setShowClassForm(false)}>&times;</span>

        <div>
          <h1 style={{ color: '#333333', fontWeight: 'normal', fontSize: '16px' }}>NEW CLASS</h1>
        </div>

        <form className="class-form" onSubmit={handleSubmit}>
          <div style={{ width: '50%', margin: '0 auto' }}>
            <label htmlFor="className">Name</label>
            <input type="text" id="className" name="className" value={className} onChange={(event) => setClassName(event.target.value)} />

            <label htmlFor="classDescription">Description</label>
            <input type="text" id="classDescription" name="classDescription" value={classDescription} onChange={(event) => setClassDescription(event.target.value)} />

            <label htmlFor="extendsClass">Type</label>
            <select id="extendsClass" name="extendsClass" value={selectedExtendsClass} onChange={handleChange}>
              <option value="">Select a type</option>
              {classesName.map((classes) => <option key={classes.id} value={classes.id}>{classes.name}</option>)}
            </select>
            <br />

            {/* Display input fields for extendsClassAttributes */}
            {extendsClassAttributes.map((attribute, index) => (
              <div key={index}>
                <label htmlFor={`extendsAttr${index}`}>{formatAttributeName(attribute.name)}:</label>
                <input type="text" id={`extendsAttr${index}`} name={`extendsAttr${index}`} value={attribute.description || ""} onChange={(event) => handleAttributeChange(index, "extendsClassAttribute", event.target.value)} />
                <br />
              </div>
            ))}
            <br></br>

            {/* Input fields for attributes */}
            <label>ATTRIBUTES</label>
            {attributes.map((attribute, index) => (
              <div key={index}>
                <label htmlFor={`attrName${index}`}>Name:</label>
                <input type="text" id={`attrName${index}`} name={`attrName${index}`} value={attribute.name} onChange={(event) => handleAttributeChange(index, "name", event.target.value)} />
                
                <label htmlFor={`attrDescription${index}`}>Description:</label>
                <input type="text" id={`attrDescription${index}`} name={`attrDescription${index}`} value={attribute.description} onChange={(event) => handleAttributeChange(index, "description", event.target.value)} />
                
                <label htmlFor={`attrType${index}`}>Type:</label>
                <input type="text" id={`attrType${index}`} name={`attrType${index}`} value={attribute.type} onChange={(event) => handleAttributeChange(index, "type", event.target.value)} />
                
                <label htmlFor={`attrUnit${index}`}>Unit:</label>
                <input type="text" id={`attrUnit${index}`} name={`attrUnit${index}`} value={attribute.unit} onChange={(event) => handleAttributeChange(index, "unit", event.target.value)} />
                
                <label htmlFor={`attrMandatory${index}`}>Mandatory:</label>
                <input type="checkbox" id={`attrMandatory${index}`} name={`attrMandatory${index}`} checked={attribute.mandatory} onChange={(event) => handleAttributeChange(index, "mandatory", event.target.checked)} />
                <br /><br />
              </div>
            ))}

            {/* Button to add a new attribute */}
            <button type="button" onClick={addAttribute}>Add Attribute</button><br /><br />
          
            {/* Submit button for the form */}
            <input className="create-class-button" type="submit" value="Create Class" />
            <br /><br />
          </div>
        </form>
      </div>
    </div>
  );
}

export default ClassForm;
