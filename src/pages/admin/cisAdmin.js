import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { fetchAllClass, fetchAllDomain, fetchAllElements, createInventoryDomain } from "../../services/api";
import ClassForm from "./classForm";
import "./admin.css";

function CISadmin() {
  const history = useHistory();
  const [showClassForm, setShowClassForm] = useState(false);
  const [domains, setDomains] = useState([]);
  const [classes, setClasses] = useState([]);
  const [elements, setElements] = useState([]);
  const [expandedClasses, setExpandedClasses] = useState([]);
  const [showDomainForm, setShowDomainForm] = useState(false);
  const [newDomainData, setNewDomainData] = useState({ name: '', description: '', tags: [], authorizations: [], authenticationTokens: [] });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const responseDomain = await fetchAllDomain();
        const responseClass = await fetchAllClass();
        const responseElements = await fetchAllElements(20);

        setDomains(responseDomain.payload);
        setClasses(responseClass.payload);
        setElements(responseElements.payload);
      } catch (error) {
        console.error("Error fetching data:", error.message);
      }
    };

    fetchData();
  }, []);

  // Handle row click to navigate to detail page
  const handleRowClick = (classId) => {
    history.push(`/admin/${classId}`); // Navigate to detail page with the class_id
  };

  // Render class hierarchy
  const renderClassHierarchy = (classes) => {
    const filteredClasses = classes.filter(
      (classItem) =>
        !classItem.extendsClass || classItem.extendsClass.length === 0
    );

    const renderHierarchy = (parentClass, indentationLevel = 1) => {
      const isExpanded = expandedClasses.includes(parentClass.id);
      const children = classes.filter(
        (classItem) =>
          classItem.extendsClass &&
          classItem.extendsClass.includes(parentClass.id)
      );

      if (children.length === 0) {
        return (
          <tr
            key={parentClass.id}
            onClick={() => handleRowClick(parentClass.id)}
            className="class-item"
          >
            <td style={{ paddingLeft: `${indentationLevel * 20}px` }}>
              {formatClassName(parentClass.name)}
            </td>
            <td>{parentClass.id}</td>
          </tr>
        );
      }

      return (
        <>
          <tr
            key={parentClass.id}
            onClick={() => toggleClassExpansion(parentClass.id)}
            className="class-item"
          >
            <td style={{ paddingLeft: `${indentationLevel * 20}px` }}>
              <span>{isExpanded ? "[-] " : "[+] "}</span>
              {formatClassName(parentClass.name)}
            </td>
            <td>{parentClass.id}</td>
          </tr>
          {isExpanded &&
            children.map((child) =>
              renderHierarchy(child, indentationLevel + 1)
            )}
        </>
      );
    };
    return filteredClasses.map((parentClass) => renderHierarchy(parentClass));
  };

  // Toggle class expansion in the hierarchy
  const toggleClassExpansion = (classId) => {
    setExpandedClasses((prevExpandedClasses) =>
      prevExpandedClasses.includes(classId)
        ? prevExpandedClasses.filter((id) => id !== classId)
        : [...prevExpandedClasses, classId]
    );
  };

  // Format class name for display
  const formatClassName = (name) => {
    const capitalized = name.charAt(0).toUpperCase() + name.slice(1);
    return capitalized.replace(/-/g, ' ');
  };

  const handleNewDomainChange = (event) => {
    const { name, value } = event.target;
    setNewDomainData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleDomainFormSubmit = async (event) => {
    event.preventDefault();
    try {
      await createInventoryDomain(newDomainData);
      setNewDomainData({ name: '', description: '', tags: [], authorizations: [], authenticationTokens: [] });
      setShowDomainForm(false);
    } catch (error) {
      console.error('Error creating domain:', error.message);
    }
  };

  const domainModal = (
    <div id="domainModal" className="modal" style={{ display: showDomainForm ? 'block' : 'none' }}>
      <div className="modal-content">
        <span className="close" onClick={() => setShowDomainForm(false)}>&times;</span>
        <h3>Create Domain</h3>
        <form onSubmit={handleDomainFormSubmit}>
          <label>Name:</label>
          <input type="text" name="name" value={newDomainData.name} onChange={handleNewDomainChange} required />
          <br></br><br></br>
          <label>Description:</label>
          <textarea name="description" value={newDomainData.description} style={{ width: "100%" }} onChange={handleNewDomainChange} required />
          <br></br><br></br><br></br>
          <button type="submit">Create</button>
        </form>
      </div>
    </div>
  );

  return (
    <div className="cis-admin">
      <h3 style={{ textAlign: 'center' }}>CIS Administrator</h3>

      <button onClick={() => setShowDomainForm(true)}>Create Domain</button>
      {showDomainForm && domainModal}

      {/* Button to add a new class */}
      <div className="new-class-button">
        <button className="dropbtn" onClick={() => setShowClassForm(!showClassForm)}>
          {showClassForm ? "Close Class Form" : " + Class"}
        </button>
        {showClassForm && (
          <ClassForm
            showClassForm={showClassForm}
            setShowClassForm={setShowClassForm}
          />
        )}
      </div>

      {/* Display categories in a table */}
      <div className="categories-display">
        <div className="card-display">
          <h2>Class Hierarchy</h2>
          <table className="class-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
                {/* <th>Extended Classes</th> */}
              </tr>
            </thead>
            <tbody>{renderClassHierarchy(classes)}</tbody>
          </table>
        </div>
      </div>

      {/* Display domains in a table */}
      <div className="card-container">
        <div className="card-display">
          <h2>Domains</h2>
          <table className="class-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {domains.map((classItem, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(classItem.id)}
                  className="class-item"
                >
                  <td>{formatClassName(classItem.name)}</td>
                  <td>{classItem.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <br />

        {/* Display classes in a table */}
        <div className="card-display">
          <h2>Classes</h2>
          <table className="class-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {classes.map((classItem, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(classItem.id)}
                  className="class-item"
                >
                  <td>{formatClassName(classItem.name)}</td>
                  <td>{classItem.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <br />
        <br />

        {/* Display elements in a table */}
        <div className="card-display">
          <h2>Elements</h2>
          <table className="class-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>ID</th>
              </tr>
            </thead>
            <tbody>
              {elements.map((classItem, index) => (
                <tr
                  key={index}
                  onClick={() => handleRowClick(classItem.id)}
                  className="class-item"
                >
                  <td>{formatClassName(classItem.name)}</td>
                  <td>{classItem.id}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div><br /><br /><br /><br /><br />
      </div><br /><br />
    </div>
  );
}

export default CISadmin;
