import React, { useState, useEffect } from 'react';
import { createShopGroup, fetchAllShopGroup, fetchUsers } from '../../../services/api.js'; // Ensure fetchUsers is imported
import './adminPage.css';

const ShopgroupsPage = ({ openSheet, isSheetOpen, selectedDomain }) => {
  const [shopgroups, setShopgroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShopgroups, setFilteredShopgroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShopgroupName, setNewShopgroupName] = useState('');
  const [newShopgroupDescription, setNewShopgroupDescription] = useState(''); // New state for description
  const [members, setMembers] = useState([]); // New state for members
  const [selectedMembers, setSelectedMembers] = useState([]); // State for selected members
  const [users, setUsers] = useState([]); // State for user dropdown
  const [isSaving, setIsSaving] = useState(false); // To prevent double API calls

  useEffect(() => {
    const fetchShopGroup = async () => {
      if (selectedDomain) {
        try {
          const response = await fetchAllShopGroup(selectedDomain);
          setShopgroups(response.payload);
          setFilteredShopgroups(response.payload);
        } catch (error) {
          console.error("Error fetching shop groups:", error);
        }
      }
    };
    fetchShopGroup();
  }, [selectedDomain]);

  useEffect(() => {
    setFilteredShopgroups(
      shopgroups.filter(shopgroup =>
        shopgroup.name.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, shopgroups]);

  useEffect(() => {
    // Fetch users to populate the dropdown
    const fetchAllUsers = async () => {
      try {
        const response = await fetchUsers(); // Call fetchUsers API
        setUsers(response.payload || []); // Store users in state
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };
    
    if (selectedDomain) {
      fetchAllUsers();
    }
  }, [selectedDomain]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenSheet = (shopgroup) => {
    openSheet(
      <div>
        <h3>Shop Group Details</h3>
        <p><strong>Name:</strong> {shopgroup.name}</p>
        <p><strong>Description:</strong> {shopgroup.description}</p>
      </div>
    );
  };

  const handleAddShopgroup = () => {
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewShopgroupName('');
    setNewShopgroupDescription(''); // Reset description input
    setSelectedMembers([]); // Reset selected members
  };

  const handleSaveShopgroup = async () => {
    // Check if a domain is selected
    if (!selectedDomain) {
      console.error("No domain selected, cannot create shop group");
      return;
    }
  
    // Prevent double-click or re-triggering of the API call
    if (isSaving) return;
  
    setIsSaving(true); // Set saving state
  
    const newShopgroup = {
      name: newShopgroupName,
      description: newShopgroupDescription,
      users: selectedMembers // Include selected members
    };
  
    try {
      // Create the shop group using the selected domain
      await createShopGroup(selectedDomain, newShopgroup); // Pass selectedDomain here
  
      // Fetch updated shop groups list using the selected domain
      const response = await fetchAllShopGroup(selectedDomain); // Use selectedDomain here
      setShopgroups(response.payload);
      setFilteredShopgroups(response.payload);
      handleCloseModal();
    } catch (error) {
      console.error("Error creating shop group:", error); // Log any errors that occur
    } finally {
      setIsSaving(false); // Reset saving state after the operation completes
    }
  };

  return (
    <div className={`user-list-container ${isSheetOpen ? 'shifted' : ''}`}>
      <div className="user-list-header">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="user-search"
        />
        <button onClick={handleAddShopgroup} className="add-user-button">+ Shop Group</button>
      </div>

      <ul className="user-list">
        {filteredShopgroups.length > 0 ? (
          filteredShopgroups.map((shopgroup) => (
            <li key={shopgroup.id} onClick={() => handleOpenSheet(shopgroup)} className="user-item">
              {shopgroup.name}
            </li>
          ))
        ) : (
          <li>No shop groups found.</li>
        )}
      </ul>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Shop Group</h3>
            <input
              type="text"
              placeholder="Shop Group Name"
              value={newShopgroupName}
              onChange={(e) => setNewShopgroupName(e.target.value)}
              className="modal-input"
            />
            <input
              type="text"
              placeholder="Description"
              value={newShopgroupDescription}
              onChange={(e) => setNewShopgroupDescription(e.target.value)}
              className="modal-input"
            />
            <select
              multiple
              value={selectedMembers}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                setSelectedMembers(options); // Update selected members based on dropdown selection
              }}
              className="modal-input"
            >
              {users.map(user => (
                <option key={user.mail} value={user.mail}>
                  {user.uid}
                </option>
              ))}
            </select>
            <div className="modal-buttons">
              <button onClick={handleSaveShopgroup} className="save-button">Save</button>
              <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ShopgroupsPage;
