import React, { useState, useEffect, useRef } from 'react';

const SearchableDropdown = ({ options, selectedValue, onChange, onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showOptions, setShowOptions] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');
  const inputRef = useRef(null);

  const handleInputChange = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    setSelectedLabel(''); // Clear selected label when user types
    onSearchChange(query); // Notify parent component of search query change
    setShowOptions(true); // Show options when user types in the search bar
  };

  const handleOptionClick = (value, label) => {
    onChange(value); // Notify parent component of selected value change
    setSelectedLabel(label);
    setSearchQuery('');
    setShowOptions(false); // Hide options when an option is selected
  };

  const handleClickOutside = (event) => {
    if (inputRef.current && !inputRef.current.contains(event.target)) {
      setShowOptions(false);
    }
  };

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div className="searchable-dropdown" ref={inputRef} style={{ position: 'relative' }}>
      <input
        type="text"
        value={selectedLabel || searchQuery}
        onChange={handleInputChange}
        placeholder="Search..."
        className="form-input"
        onFocus={() => setShowOptions(true)} // Show options when input is focused
        style={{ padding: '0.5rem', width: '100%', boxSizing: 'border-box' }}
      />
      {showOptions && options.length > 0 && (
        <div
          className="options-list"
          style={{
            maxHeight: '200px',
            overflowY: 'auto',
            border: '1px solid #ccc',
            padding: '0.5rem',
            position: 'absolute',
            width: '100%',
            backgroundColor: 'white',
            zIndex: 1000,
            boxSizing: 'border-box',
          }}
        >
          {options.map((option) => (
            <div
              key={option.value}
              className="option-item"
              onClick={() => handleOptionClick(option.value, option.label)}
              style={{
                marginBottom: '0.5rem',
                cursor: 'pointer',
                color: 'black',
              }} // Set text color to black
            >
              {option.label}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchableDropdown;
