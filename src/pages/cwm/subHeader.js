import React from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import WorkForm from './workForm.js';
import "./cwm.css";

const SubHeader = ({ showLocationForm, setShowLocationForm, showWorkForm, setShowWorkForm, searchInput, setSearchInput, handleSearch, selectedDomain }) => {
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

            {/* New Location Button */}
            <div className="new-problem-button">
                <button
                    onClick={() => {
                        handleItemClick("Work");
                        setShowWorkForm(true);
                    }}
                    className="problembtn"
                >
                    <span>+ NEW</span>
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
