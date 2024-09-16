import React, { useState } from "react";
import './searchCard.css';

const SearchCard = ({ searchInput, setSearchInput, handleSearch, selectedDomain, setSelectedDomain, sortOptions, handleSortChange, handleNew }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
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

        <div className="input-group">
          <label htmlFor="domain-select">Domain</label>
          <select
            id="domain-select"
            value={selectedDomain}
            onChange={(e) => setSelectedDomain(e.target.value)}
          >
            <option value="all">All Domains</option>
            <option value="domain1">TEC</option>
            <option value="domain2">LCLS</option>
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
        <button className="new-button" onClick={toggleDropdown}>
          New +
        </button>
        {isDropdownOpen && (
          <div className="dropdown-menu">
            {/* Example dropdown options */}
            <button onClick={() => handleNew("Report")}>Report</button>
            <button onClick={() => handleNew("Request")}>Request</button>
            <button onClick={() => handleNew("Record")}>Record</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchCard;
