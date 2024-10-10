import React from "react";

const SelectField = ({ label, value, options, onChange, disabled }) => (
  <div className="detail-row">
    <label className="work-label">{label}</label>
    <select value={value} className="input-field" onChange={onChange} disabled={disabled}>
      {options.map((option) => (
        <option key={option.id} value={option.value}>
          {option.name || option.value || option.label}
        </option>
      ))}
    </select>
  </div>
);

export default SelectField;
