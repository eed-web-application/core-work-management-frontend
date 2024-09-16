import React from "react";

const Tabs = ({ activeTab, handleTabChange, tabs }) => (
  <div className="tabs-container">
    <div className="tab-buttons">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          className={`tab-button ${activeTab === tab.id ? "active" : ""}`}
          onClick={() => handleTabChange(tab.id)}
        >
          {tab.label}
        </button>
      ))}
    </div>
    <div className="tab-content">{tabs.find((tab) => tab.id === activeTab)?.content}</div>
  </div>
);

export default Tabs;
