// ShopGroupForm.jsx

import React, { useState, useEffect } from 'react';
import { createShopGroup, fetchUsers } from '../../services/api';
import CustomMultiSelect from '../../components/CustomMultiSelect';
import { toast } from 'react-toastify'; // Import toast
import 'react-toastify/dist/ReactToastify.css';

function ShopGroupForm({ showShopGroupForm, setShowShopGroupForm, selectedDomain }) {
  const [shopGroupData, setShopGroupData] = useState({ domainId: selectedDomain, name: '', description: '', users: [] });
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedQuery(searchQuery);
      console.log('Debounced Query set to:', searchQuery);
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [searchQuery]);

  useEffect(() => {
    const fetchUserData = async () => {
      console.log('Fetching user data with query:', debouncedQuery); // Debugging log
      const response = await fetchUsers(debouncedQuery);
      console.log("debouncedQuery:", debouncedQuery);
      setUsers(response.payload);
      console.log(response.payload);
    };

    fetchUserData();
  }, [debouncedQuery]);

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setShopGroupData(prevData => ({ ...prevData, [name]: value }));
  };

  const handleUserChange = (selectedOptions) => {
    setSelectedUsers(selectedOptions);
  };

  // Callback function to handle selected values change
  const handleSelectedValuesChange = (selectedOptions) => {
    console.log(selectedOptions); // Log selectedOptions here
    setSelectedUsers(selectedOptions);
    const formattedUsers = selectedOptions.map(option => ({
      userId: option, // Ensure option is the email address
      isLeader: false
    }));
    setShopGroupData(prevData => ({
      ...prevData,
      users: formattedUsers
    }));
  };


  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      console.log("Selected Users:", selectedUsers); // Log the selected users here
      const formattedUsers = selectedUsers.map(option => ({
        userId: option,
        isLeader: false
      }));
      console.log(formattedUsers);
      setShopGroupData(prevData => ({
        ...prevData,
        users: formattedUsers
      }));
      console.log(shopGroupData);
      await createShopGroup({ ...shopGroupData, users: formattedUsers });
      toast.success("Shop group created successfully!");
      setShowShopGroupForm(false); // Close the form
      window.location.reload(); // Reload the page
    } catch (error) {
      console.error('Error creating shop group:', error);
      toast.error("Error creating shop group. Please try again.");
    }
  };


  const filteredOptions = users.map((user) => ({
    value: user.mail,
    label: `${user.commonName} (${user.mail})`
  }));

  return (
    <div className={`modal ${showShopGroupForm ? "show" : "hide"}`}>
      <div className="form-content">
        <span className="close" onClick={() => setShowShopGroupForm(false)}>&times;</span>
        <h1 className="form-title">NEW SHOP GROUP</h1>
        <form onSubmit={handleSubmit} className="shop-group-form">

          <h1 className="workform-title">New Shop Group</h1> {/* Title for the form */}
          <p className="form-subtitle">Please provide the details of the shop group</p>
          <hr className="line" /><br></br>

          <div className="form-group">
            <label htmlFor="name">Name</label>
            <input type="text" id="name" name="name" value={shopGroupData.name} onChange={handleInputChange} required />
          </div>

          <div className="form-group">
            <label htmlFor="description">Description</label>
            <input type="text" id="description" name="description" value={shopGroupData.description} onChange={handleInputChange} />
          </div>

          <div className="form-group" style={{ width: '100%' }}>
            {/* <label htmlFor="userEmails">User Emails</label> */}
            <CustomMultiSelect
              options={filteredOptions}
              selectedValues={selectedUsers}
              onChange={handleUserChange}
              onSearchChange={setSearchQuery}
              onSelectedValuesChange={handleSelectedValuesChange} // Pass the callback function
            />
          </div>

          <button type="submit" className="form-button">Create Shop Group</button>
        </form>
      </div>
    </div>
  );
}

export default ShopGroupForm;
