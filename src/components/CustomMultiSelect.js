import React, { useState, useEffect } from 'react';

const CustomMultiSelect = ({ options, selectedValues, onChange, onSearchChange }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    // Filter options based on search query
    const filtered = options.filter(option =>
      option.label.toLowerCase().includes(searchQuery.toLowerCase())
    );
    setFilteredOptions(filtered);
  }, [options, searchQuery]);

  const handleCheckboxChange = (value) => {
    const updatedSelectedValues = selectedValues.includes(value)
      ? selectedValues.filter((v) => v !== value)
      : [...selectedValues, value];
    onChange(updatedSelectedValues); // Call the onChange function with updated values
  };

  return (
    <div className="form-group">
      <label htmlFor="userEmails">User Emails</label>
      <input
        type="text"
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.target.value);
          onSearchChange(e.target.value); // Notify parent component of search query change
        }}
        placeholder="Search for users..."
        className="form-input"
        style={{marginBottom: "0px"}}
      />
      <div className="options-list" style={{ maxHeight: '200px', overflowY: 'auto', border: '1px solid #ccc', padding: '0.5rem' }}>
        {filteredOptions.map((option) => (
          <div key={option.value} className="option-item" style={{ marginBottom: '0.5rem', display: 'flex', alignItems: 'center' }}>
            <input
              type="checkbox"
              checked={selectedValues.includes(option.value)}
              onChange={() => handleCheckboxChange(option.value)}
              style={{ marginRight: '0.5rem', width: '16px', height: '16px' }} // Adjust size here
            />
            <label style={{ color: 'black' }}>{option.label}</label>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CustomMultiSelect;
