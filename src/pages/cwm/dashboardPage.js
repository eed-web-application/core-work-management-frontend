import React, { useState, useEffect } from "react";
import './dashboardPage.css';

const DashboardPage = ({ user = { id: 123, name: 'User 1' }, selectedDomain }) => {
  const [createdTickets, setCreatedTickets] = useState([]);
  const [assignedTickets, setAssignedTickets] = useState([]);
  const [stats, setStats] = useState({
    totalCreated: 0,
    openTickets: 0,
    inProgressTickets: 0,
  });

  const sampleCreatedTickets = [
    { id: 1, title: "Fix server issue", status: "Open", createdAt: "2023-09-01" },
    { id: 2, title: "Update database schema", status: "In Progress", createdAt: "2023-09-05" },
    { id: 3, title: "Review security protocols", status: "Closed", createdAt: "2023-08-29" }
  ];

  const sampleAssignedTickets = [
    { id: 4, title: "Design new landing page", status: "Open", assignedAt: "2023-09-08" },
    { id: 5, title: "Fix login bug", status: "In Progress", assignedAt: "2023-09-10" },
    { id: 6, title: "Optimize app performance", status: "Open", assignedAt: "2023-09-12" }
  ];

  useEffect(() => {
    loadUserTickets();
    loadAssignedTickets();
  }, []);

  const loadUserTickets = () => {
    setCreatedTickets(sampleCreatedTickets);

    const open = sampleCreatedTickets.filter(ticket => ticket.status === 'Open').length;
    const inProgress = sampleCreatedTickets.filter(ticket => ticket.status === 'In Progress').length;

    setStats({
      totalCreated: sampleCreatedTickets.length,
      openTickets: open,
      inProgressTickets: inProgress,
    });
  };

  const loadAssignedTickets = () => {
    setAssignedTickets(sampleAssignedTickets);
  };

  return (
    <div className="dashboard-container">
      <div className="welcome-header">
        <h2>Welcome, {user.name}!</h2>
        <p>Here’s what’s happening with your tickets today.</p>
      </div>

      <div className="stats-section">
        <div className="stat-box">
          <h3>{stats.totalCreated}</h3>
          <p>Total Tickets Created</p>
        </div>
        <div className="stat-box">
          <h3>{stats.openTickets}</h3>
          <p>Open Tickets</p>
        </div>
        <div className="stat-box">
          <h3>{stats.inProgressTickets}</h3>
          <p>In Progress</p>
        </div>
      </div>

      <div className="tickets-section">
        <h3>Tickets You Created</h3>
        {createdTickets.length > 0 ? (
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Created On</th>
              </tr>
            </thead>
            <tbody>
              {createdTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td>{new Date(ticket.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>You haven't created any tickets yet.</p>
        )}
      </div>

      <div className="tickets-section">
        <h3>Tickets Assigned to You</h3>
        {assignedTickets.length > 0 ? (
          <table className="tickets-table">
            <thead>
              <tr>
                <th>Ticket ID</th>
                <th>Title</th>
                <th>Status</th>
                <th>Assigned On</th>
              </tr>
            </thead>
            <tbody>
              {assignedTickets.map(ticket => (
                <tr key={ticket.id}>
                  <td>{ticket.id}</td>
                  <td>{ticket.title}</td>
                  <td>{ticket.status}</td>
                  <td>{new Date(ticket.assignedAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>No tickets are assigned to you yet.</p>
        )}
      </div>
    </div>
  );
};

export default DashboardPage;
