import React, { useState, useEffect } from 'react';
import { fetchUsers } from '../../../services/api.js';
import './adminPage.css';

const UsersPage = ({ openSheet, isSheetOpen }) => {
  const [users, setUsers] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  useEffect(() => {
    const fetchUserData = async () => {
      const response = await fetchUsers();
      setUsers(response.payload);
      setFilteredUsers(response.payload);
    };

    fetchUserData();
  }, []);

  useEffect(() => {
    setFilteredUsers(
      users.filter(user =>
        user.uid.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [searchQuery, users]);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleOpenSheet = (user) => {
    openSheet(
      <div>
        <h3>User Details</h3>
        <p><strong>Name:</strong> {user.name}</p>
        <p><strong>Email:</strong> {user.email}</p>
      </div>
    );
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
      </div>
      <ul className="user-list">
        {filteredUsers.length > 0 ? (
          filteredUsers.map((user) => (
            <li key={user.id} onClick={() => handleOpenSheet(user)} className="user-item">
              {user.uid}
            </li>
          ))
        ) : (
          <li>No users found.</li>
        )}
      </ul>
    </div>
  );
};

export default UsersPage;
