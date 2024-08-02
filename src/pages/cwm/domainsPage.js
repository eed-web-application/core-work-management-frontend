import React, { useState, useEffect } from 'react';
import { createWorkDomain, fetchWorkDomain } from '../../services/api.js';
import './adminPage.css'; // Assuming this is where your .user-list styles are

const DomainsPage = ({ openSheet, isSheetOpen }) => {
  const [domains, setDomains] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredDomains, setFilteredDomains] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newDomainName, setNewDomainName] = useState('');

  useEffect(() => {
    const fetchDomainData = async () => {
      const response = await fetchWorkDomain();
      setDomains(response.payload);
      setFilteredDomains(response.payload);
    };

    fetchDomainData();
  }, []);

  useEffect(() => {
    setFilteredDomains(
        domains.filter(domain =>
            domain.name.toLowerCase().includes(searchQuery.toLowerCase())
        )
    );
}, [searchQuery, domains]);

const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
};

  const handleOpenSheet = (domains) => {
    openSheet(
      <div>
        <h3>Domain Details</h3>
        <p><strong>Name:</strong> {domains.name}</p>
        <p><strong>Description:</strong> {domains.description}</p>
      </div>
    );
  };

  const handleAddDomain = () => {
    setIsModalOpen(true);
};

const handleCloseModal = () => {
    setIsModalOpen(false);
    setNewDomainName('');
};

const handleSaveDomain = async () => {
    const newDomain = { name: newDomainName };
    await createWorkDomain(newDomain);
    const response = await fetchWorkDomain();
    setDomains(response.payload);
    setFilteredDomains(response.payload);
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
                <button onClick={handleAddDomain} className="add-user-button">+ Domain</button>
            </div>

      <ul className="user-list">
        {domains.length > 0 ? (
          domains.map((domain) => (
            <li key={domain.id} onClick={() => handleOpenSheet(domain)} className="user-item">
              {domain.name}
            </li>
          ))
        ) : (
          <li>No domains found.</li>
        )}
      </ul>

      {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Domain</h3>
                        <input
                            type="text"
                            placeholder="Domain Name"
                            value={newDomainName}
                            onChange={(e) => setNewDomainName(e.target.value)}
                            className="modal-input"
                        />
                        <div className="modal-buttons">
                            <button onClick={handleSaveDomain} className="save-button">Save</button>
                            <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
    </div>
  );
};

export default DomainsPage;
