// Cwm.js
import React, { useState, useEffect } from "react";
import { fetchAllElements } from "../../services/api";
import { useHistory } from "react-router-dom";
import { Link } from "react-router-dom";
import SubHeader from './SubHeader.js';
import "./Cwm.css";

// Function to capitalize the first letter and replace dashes with spaces in item names
function formatItemName(name) {
  const formattedName = name.charAt(0).toUpperCase() + name.slice(1);
  const finalName = formattedName.replace(/-/g, ' ');
  return finalName;
}

const SearchPage = () => {
  const [inventory, setInventory] = useState([]);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("");
  const [searchInput, setSearchInput] = useState(""); // State to store the search input
  const [currentPage, setCurrentPage] = useState(1); // New state for current page
  const [lastItemId, setLastItemId] = useState(null); // New state to keep track of the last item's ID
  const itemsPerPage = 5;

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
      setLastItemId(searchData.payload[searchData.payload.length - 1]?.id || null);
    } catch (error) {
      console.error("Error fetching inventory elements:", error);
    }
  };

  // Function to load more inventory items
  const handleLoadMore = async () => {
    try {
      const nextPageData = await fetchAllElements(itemsPerPage, currentPage + 1, lastItemId);

      if (nextPageData.payload.length > 0) {
        setInventory((prevInventory) => [...prevInventory, ...nextPageData.payload]);
        setCurrentPage((prevPage) => prevPage + 1);
        setLastItemId(nextPageData.payload[nextPageData.payload.length - 1].id);
      }
    } catch (error) {
      console.error("Error fetching more inventory elements:", error);
    }
  };

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

  return (
    <div>

      {/* Sticky Header */}
      <SubHeader
        showLocationForm={showLocationForm}
        setShowLocationForm={setShowLocationForm}
        searchInput={searchInput}
        setSearchInput={setSearchInput}
        handleSearch={handleSearch}
      />
      <div className="cwm-search-page">
        <br></br>

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
        <div className="assets-cards-container">
          <div className="assets-cards">
            {inventory && inventory.length > 0 ? (
              inventory.map((item) => (
                <div key={item.id} onClick={() => handleCardClick(item.id)}>
                  <Link to={`/inventory/${item.id}`} style={{ textDecoration: 'none' }}></Link>
                  <div className="cwm-card">
                    <h2>{formatItemName(item.name)}</h2>
                    <p>ID: {item.id}</p>
                    <p>Class ID: {item.classId}</p>
                    {/* Add other information here */}
                  </div>
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
    </div>
  );
};

export default SearchPage; // Export the Dashboard component as the default export