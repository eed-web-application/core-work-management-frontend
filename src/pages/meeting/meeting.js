import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTools } from '@fortawesome/free-solid-svg-icons';
import safetyForumImage from '../../assets/safety_forum.png'; // Import the image

const Meeting = () => {
    const [activeTab, setActiveTab] = useState("activityLog");
    const iconStyle = { color: '#444' };

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    return (
        <div className="meeting-container">
            <div className="tab-buttons">
                <button className={`tab-button ${activeTab === "safety" ? "active" : ""}`} onClick={() => handleTabChange("safety")}>
                    Safety
                </button>
                <button className={`tab-button ${activeTab === "opsReport" ? "active" : ""}`} onClick={() => handleTabChange("opsReport")}>
                    Ops Report
                </button>
                <button className={`tab-button ${activeTab === "weekendReport" ? "active" : ""}`} onClick={() => handleTabChange("weekendReport")}>
                    Weekend Report
                </button>
                <button className={`tab-button ${activeTab === "newCaters" ? "active" : ""}`} onClick={() => handleTabChange("newCaters")}>
                    New CATERs
                </button>
                <button className={`tab-button ${activeTab === "closed" ? "active" : ""}`} onClick={() => handleTabChange("closed")}>
                    Closed
                </button>
                <button className={`tab-button ${activeTab === "sml" ? "active" : ""}`} onClick={() => handleTabChange("sml")}>
                    SML
                </button>
                <button className={`tab-button ${activeTab === "watchWait" ? "active" : ""}`} onClick={() => handleTabChange("watchWait")}>
                    Watch & Wait
                </button>
                <button className={`tab-button ${activeTab === "actionItems" ? "active" : ""}`} onClick={() => handleTabChange("actionItems")}>
                    Action Items
                </button>
                <button className={`tab-button ${activeTab === "programReview" ? "active" : ""}`} onClick={() => handleTabChange("programReview")}>
                    Program Review
                </button>
            </div>
            <div className="tab-content">
                {activeTab === "safety" && (
                    <div className="status-log-container">
                        <img src={safetyForumImage} alt="Safety Forum" style={{ maxWidth: '70%', marginTop: '20px' }} />
                    </div>
                )}
                {activeTab === "opsReport" && (
                    <div className="comments-section">
                        <h3>Operation Report</h3>
                        <p>No report yet</p>
                    </div>
                )}
                {activeTab === "weekendReport" && (
                    <div className="comments-section">
                        <h3>Weekend Report</h3>
                        <p>No report yet</p>
                    </div>
                )}
                {activeTab === "newCaters" && (
                    <div className="comments-section">
                        <h3>New CATERs</h3>
                        <p>No caters yet</p>
                    </div>
                )}
                {activeTab === "closed" && (
                    <div className="comments-section">
                        <h3>Closed CATERs</h3>
                        <p>No closed caters yet</p>
                    </div>
                )}
                {activeTab === "sml" && (
                    <div className="comments-section">
                        <h3>SML</h3>
                        <p>No sml yet</p>
                    </div>
                )}
                {activeTab === "watchWait" && (
                    <div className="comments-section">
                        <h3>Watch & Wait</h3>
                        <p>No watch & wait yet</p>
                    </div>
                )}
                {activeTab === "actionItems" && (
                    <div className="comments-section">
                        <h3>Action Items</h3>
                        <p>No action items yet</p>
                    </div>
                )}
                {activeTab === "programReview" && (
                    <div className="comments-section">
                        <h3>Program Review</h3>
                        <p>No program review yet</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Meeting;
