import React, { useState, useEffect } from 'react';
import { createShopGroup, fetchAllShopGroup } from '../../../services/api.js';
import './adminPage.css';

const ShopgroupsPage = ({ openSheet, isSheetOpen }) => {
  const [shopgroups, setShopgroups] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredShopgroups, setFilteredShopgroups] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newShopgroupName, setNewShopgroupName] = useState('');

  useEffect(() => {
    const fetchShopGroup = async () => {
      const response = await fetchAllShopGroup();
      setShopgroups(response.payload);
      setFilteredShopgroups(response.payload);
    };

    fetchShopGroup();
  }, []);

  useEffect(() => {
    setFilteredShopgroups(
        shopgroups.filter(shopgroup =>
            shopgroup.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
}, [searchQuery, shopgroups]);

const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
};

  const handleOpenSheet = (shopgroup) => {
    openSheet(
      <div>
        <h3>Shop Group Details</h3>
        <p><strong>Name:</strong> {shopgroup.name}</p>
        <p><strong>Email:</strong> {shopgroup.description}</p>
      </div>
    );
  };

  const handleAddShopgroup = () => {
    setIsModalOpen(true);
};

const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewShopgroupName('');
};

const handleSaveShopgroup = async () => {
    const newShopgroup = { name: newShopgroupName };
    await createShopGroup(newShopgroup);
    const response = await fetchAllShopGroup();
    setShopgroups(response.payload);
    setFilteredShopgroups(response.payload);
    handleCloseModal();
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
        {shopgroups.length > 0 ? (
          shopgroups.map((shopgroup) => (
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
                            placeholder="Shopgroup Name"
                            value={newShopgroupName}
                            onChange={(e) => setNewShopgroupName(e.target.value)}
                            className="modal-input"
                        />
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
