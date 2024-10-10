import React, { useState } from "react";
import RequestForm from './requestForm'; 
import './searchCard.css';

const SearchCard = ({ searchInput, setSearchInput, handleSearch, selectedDomain, setSelectedDomain, sortOptions, handleSortChange, handleNew, domains }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    closeModal();
  };

  return (
    <div className="search-card">
      <div className="search-card-left">
        <div className="input-group">
          <label htmlFor="ticket-search">Find A Ticket</label>
          <input
            id="ticket-search"
            type="text"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search for a ticket"
          />
        </div>

        {/* Updated Domain Dropdown */}
        <div className="input-group">
          <label htmlFor="domain-select">Domain</label>
          <select
            id="domain-select"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
            disabled={domains.length === 0}  // Disable if there are no domains
          >
            {domains.length > 0 ? (
              domains.map(domain => (
                <option key={domain.id} value={domain.id}>
                  {domain.name}
                </option>
              ))
            ) : (
              <option value="" disabled>No domains available</option>
            )}
          </select>

        </div>

        <div className="input-group">
          <label htmlFor="sort-select">Sort By</label>
          <select
            id="sort-select"
            value={sortOptions}
            onChange={(e) => handleSortChange(e.target.value)}
          >
            <option value="date">Date</option>
            <option value="priority">Priority</option>
            <option value="status">Status</option>
          </select>
        </div>
      </div>

      <div className="search-card-right">
        <button className="new-button" onClick={openModal}>
          New +
        </button>
      </div>


      {isModalOpen && (
        <RequestForm
          isOpen={isModalOpen}
          onClose={closeModal}
          handleSubmit={handleSubmit}
          selectedDomain={selectedDomain}  
        />
      )}
    </div>
  );
};

export default SearchCard;
