import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import WorkForm from './workForm.js';
import TaskForm from './taskForm.js';
import "./cwm.css";

const SubHeader = ({ showWorkForm, setShowWorkForm, showTaskForm, setShowTaskForm, searchInput, setSearchInput, handleSearch, selectedDomain }) => {
    const handleItemClick = (formType) => {

    };

    return (
        <div className="search-extension">

            {/* Search Bar */}
            <div className="search-wrapper">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchInput}
                    onChange={(e) => setSearchInput(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                            handleSearch();
                        }
                    }}
                />
                <button onClick={handleSearch}><FontAwesomeIcon icon={faSearch} /></button>
            </div>

            {/* New Create a Task Button */}
            <div className="new-task-button">
                <button
                    onClick={() => {
                        handleItemClick("Work");
                        setShowTaskForm(true);
                    }}
                    className="taskbtn"
                >
                    <span>Create Activity</span>
                    
                </button>
                {showTaskForm && (
                    <TaskForm
                        showTaskForm={showTaskForm}
                        setShowTaskForm={setShowTaskForm}
                        selectedDomain={selectedDomain}
                    />
                )}
            </div>

            {/* New Report a Problem Button */}
            <div className="new-problem-button">
                <button
                    onClick={() => {
                        handleItemClick("Work");
                        setShowWorkForm(true);
                    }}
                    className="problembtn"
                >
                    <span>Report Problem</span>
                </button>
                {showWorkForm && (
                    <WorkForm
                        showWorkForm={showWorkForm}
                        setShowWorkForm={setShowWorkForm}
                        selectedDomain={selectedDomain}
                    />
                )}
            </div>
        </div>
    );
}

export default SubHeader;
