import React, { useState, useEffect } from "react";
import { useHistory } from 'react-router-dom';
import { fetchShopGroups, fetchLocations, fetchWorkDomain, createWorkDomain } from "../../services/api.js";
import ShopGroupForm from "./shopGroupForm.js";
import LocationForm from '../cwm/locationForm.js';
import "./admin.css";

function CWMadmin() {
  const history = useHistory();
  const [locations, setLocations] = useState([]);
  const [shopGroups, setShopGroups] = useState([]);
  const [showShopGroupForm, setShowShopGroupForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');
  const [showDomainForm, setShowDomainForm] = useState(false); // State to toggle domain creation form
  const [newDomainData, setNewDomainData] = useState({ name: '', description: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const workDomainData = await fetchWorkDomain();
        setSelectedDomain(workDomainData[0]); // Set default domain
        console.log(selectedDomain);
        setDomains(workDomainData.payload);
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };

    fetchData();
  }, []);

  const fetchDataForDomain = async () => {
    try {
      const locationsData = await fetchLocations();
      if (selectedDomain !== '') {
        setLocations(locationsData.payload.filter(location => location.domain.id === selectedDomain));
      } else {
        setLocations(locationsData.payload);
      }
      const shopGroupsData = await fetchShopGroups();
      console.log(shopGroupsData);
      if (selectedDomain !== '') {
        setShopGroups(shopGroupsData.filter(shopGroup => shopGroup.domain.id === selectedDomain));
      } else {
        setShopGroups(shopGroupsData);
      }
    } catch (error) {
      console.error('Error fetching locations:', error.message);
    }
  };
  

  useEffect(() => {
    if (selectedDomain !== '') {
      fetchDataForDomain();
    }
  }, [selectedDomain]);

  const handleDomainChange = (event) => {
    const selectedDomain = event.target.value;
    setSelectedDomain(selectedDomain);
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
      await createWorkDomain(newDomainData);
      setNewDomainData({ name: '', description: '' });
      setShowDomainForm(false);
      setSelectedDomain(''); // Reset selected domain to trigger useEffect
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

  const handleRowClick = (classId) => {
    history.push(`/admin/${classId}`);
  };

  return (
    <div className="cwm-admin">
      <h3 style={{ textAlign: 'center' }}>CWM Administrator</h3>

      <div>
        <label>Select Domain: </label>
        <select onChange={handleDomainChange}>
          {domains.map(domain => (
            <option key={domain.id} value={domain.id}>{domain.name}</option>
          ))}
        </select>
        <button onClick={() => setShowDomainForm(true)}>Create Domain</button>
      </div>

      {showDomainForm && domainModal}

      <div className="card-display">
        <h2>Locations</h2>
        <table className="class-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Name</th>
              <th>Description</th>
              <th>Location Manager</th>
            </tr>
          </thead>
          <tbody>
            {locations.map(location => (
              <tr
                key={location.id}
                onClick={() => handleRowClick(location.id)}
                className="class-item"
              >
                <td>{location.domain.name}</td>
                <td>{location.name}</td>
                <td>{location.description}</td>
                <td>{location.locationManagerUserId}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="new-class-button">
        <button className="dropbtn" onClick={() => setShowLocationForm(!showLocationForm)}>
          {showLocationForm ? "Close Location Form" : "+ Location"}
        </button>
        {showLocationForm && <LocationForm showLocationForm={showLocationForm} setShowLocationForm={setShowLocationForm} selectedDomain={selectedDomain}/>}
      </div>

      <div className="card-display">
        <h2>Shop Groups</h2>
        <table className="class-table">
          <thead>
            <tr>
              <th>Domain</th>
              <th>Name</th>
              <th>Description</th>
              <th>Users</th>
            </tr>
          </thead>
          <tbody>
            {shopGroups.map(shopGroup => (
              <tr key={shopGroup.id} onClick={() => handleRowClick(shopGroup.id)} className="class-item">
                <td>{shopGroup.domain.name}</td>
                <td>{shopGroup.name}</td>
                <td>{shopGroup.description}</td>
                <td>{shopGroup.users.map(user => user.user.mail).join(", ")}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="new-class-button">
        <button className="dropbtn" onClick={() => setShowShopGroupForm(!showShopGroupForm)}>
          {showShopGroupForm ? "Close Shop Group Form" : " + Shop Group"}
        </button>
        {showShopGroupForm && <ShopGroupForm showShopGroupForm={showShopGroupForm} setShowShopGroupForm={setShowShopGroupForm} selectedDomain={selectedDomain}/>}
      </div>
    </div>
  );
}

export default CWMadmin;
