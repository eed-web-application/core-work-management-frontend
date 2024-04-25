// Inventory.js
import React, { useState, useEffect } from "react";
import { fetchAllElements } from "../../services/api.js";
import { useHistory } from "react-router-dom";
import ElementForm from "./elementForm.js";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import { Link } from "react-router-dom";
import "./inventory.css";

const Inventory = () => {
  const [inventory, setInventory] = useState([]);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [showElementForm, setShowElementForm] = useState(false);
  const [searchInput, setSearchInput] = useState(""); // State to store the search input
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const [lastItemId, setLastItemId] = useState(null); // New state to keep track of the last item's ID
  const itemsPerPage = 10;

  useEffect(() => {
    // Fetch initial inventory items when the component mounts
    const fetchInitialInventory = async () => {
      try {
        const initialData = await fetchAllElements(itemsPerPage, currentPage, lastItemId);

        setInventory(initialData.payload);
        setLastItemId(initialData.payload[initialData.payload.length - 1]?.id || null);
      } catch (error) {
        console.error("Error fetching initial inventory elements:", error);
      }
    };

    fetchInitialInventory();
  }, []); // Run only on mount

  const handleItemClick = (classId) => {
    // Handle item click here (e.g., navigate to a specific form or perform an action)
    console.log(`Clicked ${classId}`);
  };

  // Function to handle search based on user input
  const handleSearch = async () => {
    try {
      // Reset currentPage and lastItemId when initiating a new search
      setCurrentPage(1);
      setLastItemId(null);

      const searchData = await fetchAllElements(5, 1, null, searchInput); // Assuming default values for limit, page, and anchorId

      setInventory(searchData.payload);
      console.log(inventory);
      setLastItemId(searchData.payload[searchData.payload.length - 1]?.id || null);
    } catch (error) {
      console.error("Error fetching inventory elements:", error);
    }
  };

  // Function to load more inventory items
  const handleLoadMore = async () => {
    try {
      const nextPageData = await fetchAllElements(itemsPerPage, currentPage + 1, lastItemId);
      console.log(inventory);
      if (nextPageData.payload.length > 0) {
        setInventory((prevInventory) => [...prevInventory, ...nextPageData.payload]);
        setCurrentPage((prevPage) => prevPage + 1);
        setLastItemId(nextPageData.payload[nextPageData.payload.length - 1].id);
      }
    } catch (error) {
      console.error("Error fetching more inventory elements:", error);
    }
  };

  // Function to handle change in primary filter selection
  const handleFilterChange = (event) => {
    const selectedValue = event.target.value;
    setSelectedFilter(selectedValue);
  };

  const history = useHistory();

  // Function to handle click on a card item and navigate to its detail page
  const handleCardClick = (id) => {
    history.push(`/inventory/${id}`); // Navigate to detail page with the item _id
  };

  // Function to capitalize the first letter and replace dashes with spaces in item names
  function formatItemName(name) {
    const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
    const finalName = formattedName.replace(/-/g, ' ');
    return finalName;
  }

  return (
    <div className="search-page">
      <br></br>

      {/* New Item Form */}
      <div className="search-bar-new-item-container">
        {/* Search Bar */}
        <div className="search-bar">
          <div className="search-wrapper">
            {/* Search input field */}
            <input
              type="text"
              placeholder="Search..."
              value={searchInput} // Set the value of the input field
              onChange={(e) => setSearchInput(e.target.value)} // Handle input change
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  handleSearch();
                }
              }}
            />
            <button onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
          </div>
        </div>

        {/* New Item Button */}
        <div className="new-item-button">
          <div className="dropdown">
            <div className="item-form-wrapper">
              {showElementForm && (
                <div className={`item-form ${showElementForm ? "slide-in" : ""}`}>
                  <ElementForm
                    showElementForm={showElementForm}
                    setShowElementForm={setShowElementForm}
                  />
                </div>
              )}
            </div>
            <button
              onClick={() => setShowElementForm(!showElementForm)}
              className="inventorybtn">+ New</button>
          </div>
        </div>
      </div>

      {/* Advanced Filters */}
      <div className="advanced-filters">
        {/* Conditionally render advanced filter based on selected primary filter */}
        {selectedFilter === "Location" && (
          <div className="advanced-location-filter">
            <label htmlFor="location-filter">Select Location: </label>
            <select id="location-filter" onChange={handleAdvancedFilterChange}>
              {/* Options specific to the Location filter */}
            </select>
          </div>
        )}
      </div>

      {/* Inventory Items */}
      <div className="inventory-cards-container">
        <div className="assets-cards">

          {inventory && inventory.length > 0 ? (
            inventory.map((item) => (
              <div key={item.id} onClick={() => handleCardClick(item.id)}>
                <Link to={`/inventory/${item.id}`} style={{ textDecoration: 'none' }}>
                  <div className="inventory-card">
                    <div className="inventoryleft-column">
                      <div className="slac-id-label">SLAC ID</div>
                      <p style={{ color: "black", fontSize: "20px", marginBottom: "0px", marginTop: "0px" }}>{formatItemName(item.name)}</p>
                      <p className="serial-label">Manufacturer: <span className="serial">{item.classDTO.name}</span></p>
                    </div>
                    <div className="right-column">
                      <p>Created By: {item.createdBy}</p>
                      <p>Last Modified By: {item.lastModifiedBy}</p>
                      <p>Last Modified Date: {item.lastModifiedDate}</p>
                    </div>
                  </div>

                </Link>
              </div>
            ))
          ) : (
            <div>No inventory items available</div>
          )}


        </div>
        {/* Load More Button */}
        <div className="load-more-button">
          <button onClick={handleLoadMore}>Load More</button>
        </div>
      </div>

    </div>
  );
};

export default Inventory;
