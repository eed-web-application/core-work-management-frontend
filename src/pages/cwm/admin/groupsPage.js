import React, { useState, useEffect } from 'react';
import { fetchLocalGroupsByQuery, createLocalGroup } from '../../../services/api.js';
import './adminPage.css';

const GroupsPage = ({ openSheet, isSheetOpen, selectedDomain }) => {
    const [groups, setGroups] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [filteredGroups, setFilteredGroups] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [newGroupName, setNewGroupName] = useState('');

    useEffect(() => {
        const fetchGroupData = async () => {
            const response = await fetchLocalGroupsByQuery();
            setGroups(response.payload);
            setFilteredGroups(response.payload);
        };
        fetchGroupData();
    }, []);

    useEffect(() => {
        setFilteredGroups(
            groups.filter(group =>
                group.name.toLowerCase().includes(searchQuery.toLowerCase())
            )
        );
    }, [searchQuery, groups]);

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
    };

    const handleOpenSheet = (group) => {
        openSheet(
            <div>
                <h3>Group Details</h3>
                <p><strong>Name:</strong> {group.name}</p>
                <p><strong>ID:</strong> {group.id}</p>
            </div>
        );
    };

    const handleAddGroup = () => {
        setIsModalOpen(true);
    };

    const handleCloseModal = () => {
        setIsModalOpen(false);
        setNewGroupName('');
    };

    const handleSaveGroup = async () => {
        const newGroup = { name: newGroupName };
        await createLocalGroup(newGroup);
        const response = await fetchLocalGroupsByQuery();
        setGroups(response.payload);
        setFilteredGroups(response.payload);
        handleCloseModal();
    };

    return (
        <div className={`user-list-container ${isSheetOpen ? 'shifted' : ''}`}>
            <div className="user-list-header">
                <input
                    type="text"
                    placeholder="Search..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="user-search"
                />
                <button onClick={handleAddGroup} className="add-user-button">+ Group</button>
            </div>
            
            <ul className="user-list">
                {filteredGroups.length > 0 ? (
                    filteredGroups.map((group) => (
                        <li key={group.id} onClick={() => handleOpenSheet(group)} className="user-item">
                            {group.name}
                        </li>
                    ))
                ) : (
                    <li>No groups found.</li>
                )}
            </ul>

            {isModalOpen && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Add New Group</h3>
                        <input
                            type="text"
                            placeholder="Group Name"
                            value={newGroupName}
                            onChange={(e) => setNewGroupName(e.target.value)}
                            className="modal-input"
                        />
                        <div className="modal-buttons">
                            <button onClick={handleSaveGroup} className="save-button">Save</button>
                            <button onClick={handleCloseModal} className="cancel-button">Cancel</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default GroupsPage;
