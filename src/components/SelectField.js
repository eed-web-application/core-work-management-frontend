import React from "react";

const SelectField = ({ label, value, options, onChange }) => (
  <div className="detail-row">
    <label className="work-label">{label}</label>
    <select value={value} className="input-field" onChange={onChange}>
      {options.map((option) => (
        <option key={option.id} value={option.value}>
          {option.name || option.value}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
