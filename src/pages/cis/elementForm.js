import React, { useState, useEffect } from "react";
import { fetchAllElements, createInventoryElement, fetchClass, fetchAllClass } from "../../services/api";
import "../admin/admin.css";

function ElementForm({ showElementForm, setShowElementForm }) {
  const [parents, setParents] = useState([]);
  const [parentId, setParentId] = useState(null);
  const [classId, setClassId] = useState("");
  const [classesName, setClassesName] = useState([]);
  const [selectedClassName, setSelectedClassName] = useState("");
  const [selectedParent, setSelectedParent] = useState("");
  const [dynamicForm, setDynamicForm] = useState([]);
  const [extendsClassId, setExtendsClassId] = useState("");
  const [extendsClassAttributes, setExtendsClassAttributes] = useState([]);
  const [taggedClassId, setTaggedClassId] = useState("");
  const [taggedClassAttributes, setTaggedClassAttributes] = useState([]);

  // Fetch all elements to populate the 'parents' state
  useEffect(() => {
    const fetchParents = async () => {
      try {
        const response = await fetchAllElements();
        if (response.errorCode === 0) {
          const elementDetails = response.payload.map((element) => ({
            id: element.id,
            name: element.name,
          }));
          setParents(elementDetails);
        } else {
          throw new Error("Error fetching elements");
        }
      } catch (error) {
        console.error("Error fetching elements:", error.message);
      }
    };

    fetchParents();
  }, []);

  // Fetch all classes to populate the 'classesName' state
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const response = await fetchAllClass();
        if (response.errorCode === 0) {
          const classesDetails = response.payload.map((classes) => ({
            id: classes.id,
            name: classes.name,
          }));
          setClassesName(classesDetails);
        } else {
          throw new Error("Error fetching elements");
        }
      } catch (error) {
        console.error("Error fetching elements:", error.message);
      }
    };

    fetchClasses();
  }, []);

  // Fetch class details when 'classId', 'taggedClassId', or 'taggedClassAttributes' change
  useEffect(() => {
    if (classId) {
      fetchClassDetails();
    }
  }, [classId, taggedClassId, taggedClassAttributes]);

  // Fetch extends class attributes when 'extendsClassId' changes
  useEffect(() => {
    if (extendsClassId) {
      fetchExtendsClassAttributes();
    }
  }, [extendsClassId]);

  // Fetch tagged class attributes when 'taggedClassId' changes
  useEffect(() => {
    if (taggedClassId) {
      fetchTaggedClassAttributes();
    }
  }, [taggedClassId]);

  // Function to fetch class details
  const fetchClassDetails = async () => {
    try {
      const classDetails = await fetchClass(classId);
      if (classDetails.errorCode !== 0) throw new Error("Error fetching class details");
      
      const classAttributes = classDetails.payload.attributes || [];
      const renderAttribute = (attribute) => (
        <div
          key={attribute.name}
          className={attribute.description ? "with-description" : ""}
        >
          <label htmlFor={attribute.name}>
            {formatAttributeName(attribute.name)}:
          </label>
          {attribute.description ? (
            <div className="attribute-description">
              {attribute.description}
            </div>
          ) : (
            attribute.name === "parent" ? (
              <select
                id="parent"
                name="parent"
                value={selectedParent}
                onChange={(event) => {
                  setSelectedParent(event.target.value);
                  const selectedParents = parents.find(
                    (parents) => parents.name === event.target.value
                  );
                  setParentId(selectedParents ? selectedParents.id : "");
                }}
              >
                <option value="">Select a parent</option>
                {parents.map((parents) => (
                  <option key={parents.id} value={parents.id}>
                    {parents.name}
                  </option>
                ))}
              </select>
            ) : (
              <input
                type="text"
                id={attribute.name}
                name={attribute.name}
                onChange={(e) =>
                  handleInputChange(attribute.name, e.target.value)
                }
              />
            )
          )}
        </div>
      );
  
      const taggedClassAttributesElements = taggedClassAttributes.map(renderAttribute);
      const dynamicFormElements = classAttributes.map(renderAttribute);
  
      setDynamicForm([...dynamicFormElements, ...taggedClassAttributesElements]);
    } catch (error) {
      console.error("Error fetching class details:", error.message);
    }
  };
   
// Fetch class details when 'classId', 'taggedClassId', 'taggedClassAttributes', 'selectedParent', or 'selectedClassName' change
useEffect(() => {
  if (classId || selectedParent || selectedClassName) {
    // Clear the dynamic form whenever a new class name is chosen
    fetchClassDetails();
  }
}, [classId, selectedParent, taggedClassId, taggedClassAttributes, selectedClassName]);

  // Function to fetch extends class attributes
  const fetchExtendsClassAttributes = async () => {
    try {
      const extendsClassDetails = await fetchClass(extendsClassId);

      if (extendsClassDetails.errorCode === 0) {
        const attributes = extendsClassDetails.payload.attributes || [];
        setExtendsClassAttributes(attributes);
      } else {
        throw new Error("Error fetching extends class details");
      }
    } catch (error) {
      console.error("Error fetching extends class details:", error.message);
    }
  };

  // Function to fetch tagged class attributes
  const fetchTaggedClassAttributes = async () => {
    try {
      const taggedClassDetails = await fetchClass(taggedClassId);

      if (taggedClassDetails.errorCode === 0) {
        const attributes = taggedClassDetails.payload.attributes || [];
        setTaggedClassAttributes(attributes);

        const dynamicFormElements = attributes.map((attribute) => (
          <div
            key={attribute.name}
            className={attribute.description ? "with-description" : ""}
          >
            <label htmlFor={attribute.name}>
              {formatAttributeName(attribute.name)}:
            </label>
            {attribute.description ? (
              <div className="attribute-description">
                {attribute.description}
              </div>
            ) : (
              <input
                type="text"
                id={attribute.name}
                name={attribute.name}
                onChange={(e) =>
                  handleInputChange(attribute.name, e.target.value)
                }
              />
            )}
          </div>
        ));

        setDynamicForm((prevDynamicForm) => [
          ...prevDynamicForm.filter(
            (element) => !attributes.find((attr) => attr.name === element.key)
          ),
          ...dynamicFormElements,
        ]);
      } else {
        throw new Error("Error fetching tagged class details");
      }
    } catch (error) {
      console.error("Error fetching tagged class details:", error.message);
    }
  };

  // State to store form data
  const [itemData, setItemData] = useState({
    name: "",
    classId: classId,
    parentId: "",
    description: "",
    tags: [],
    attributes: {},
  });

  // Function to handle input changes
  const handleInputChange = (attributeName, attributeValue) => {
    if (attributeName === "slac-id") {
      setItemData((prevData) => ({
        ...prevData,
        name: attributeValue,
      }));
    } else if (attributeName === "parent") {
      setSelectedParent(attributeValue);
      const selectedParents = parents.find(
        (parents) => parents.name === attributeValue
      );
      setItemData((prevData) => ({
        ...prevData,
        parentId: selectedParents ? selectedParents.id : "",
      }));
    } else if (attributeName === "classesName") {
      setSelectedClassName(attributeValue);
      const selectedClasses = classesName.find(
        (classes) => classes.name === attributeValue
      );
      setItemData((prevData) => ({
        ...prevData,
        classId: selectedClasses ? selectedClasses.id : "",
      }));
    } else {
      // Add a null check for attributeValue
      const trimmedValue = attributeValue ? attributeValue.trim() : null;
      setItemData((prevData) => ({
        ...prevData,
        attributes: {
          ...prevData.attributes,
          [attributeName]: trimmedValue,
        },
      }));
    }
  };

  // Function to handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("submitting");

    const parentIdToSend = selectedParent || null;

    const attributesData = Object.entries(itemData.attributes).map(
      ([key, value]) => ({
        name: key,
        value,
      })
    );

    const tags = extendsClassId ? [extendsClassId] : [];
    if (taggedClassId) {
      tags.push(taggedClassId);
    }

    const postData = {
      name: itemData.name,
      classId: classId,
      parentId: parentIdToSend,
      description: "DEPOT Item",
      tags: tags,
      attributes: [
        ...attributesData,
        ...extendsClassAttributes.map((attribute) => ({
          name: attribute.name,
          value: attribute.description || "n/a",
        })),
        ...taggedClassAttributes.map((attribute) => ({
          name: attribute.name,
          value: attribute.description || "n/a",
        })),
      ],
    };

    console.log("Post Data:", postData);

    try {
      const response = await createInventoryElement(postData);
      console.log("API Response:", response);
      alert("Item created successfully!");
      setShowElementForm(false);
      window.location.reload();
    } catch (error) {
      console.error("Error during item creation:", error);
      alert(
        "Failed to create item. Please check your connection or try again later."
      );
    }
  };

  // Helper function to format attribute names
  function formatAttributeName(name) {
    const words = name
      .split("-")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1));
    return words.join(" ");
  }

  // JSX for the component
  return (
    <div>
      <div className={`item-form-format ${showElementForm ? "show" : "hide"}`}>
        <div className="modal-content">
          <span className="close" onClick={() => setShowElementForm(false)}>
            &times;
          </span>
          <p>New Inventory Item</p>
          <hr className="line" />
          <br></br>
          <form className="class-form" onSubmit={handleSubmit}>
            <label htmlFor="classesName">Select Manufacturer:</label>
            <select
              id="classesName"
              name="classesName"
              value={selectedClassName}
              onChange={(event) => {
                setSelectedClassName(event.target.value);
                const selectedClasses = classesName.find(
                  (classes) => classes.name === event.target.value
                );
                setClassId(selectedClasses ? selectedClasses.id : "");
              }}
            >
              <option value="">Select a type</option>
              {classesName.map((classes) => (
                <option key={classes.id} value={classes.name}>
                  {classes.name}
                </option>
              ))}
            </select>
            <br />

            {dynamicForm}
            <input type="submit" value="Create Item" />
            <br />
            <br />
          </form>
        </div>
      </div>
    </div>
  );
}

export default ElementForm;
