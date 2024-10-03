import React from 'react';
import CardWidget from '../../components/CardWidget/CardWidget';
import './home.css'; 

function Home() {
  const systems = [
    {
      title: "Issues",
      description: "Manage work tickets, tasks, and workflows",
      icon: "🏷️",
      link: "/cwm/dashboard", 
    },
    {
      title: "PMM",
      description: "View planned machine maintenance dates and jobs",
      icon: "🛠️",
      link: "/reports-analytics",
    },
    {
      title: "8:15",
      description: "Follow along during the daily morning meetings",
      icon: "🕓",
      link: "/815",
    },
    {
      title: "Inventory",
      description: "Track and manage inventories across departments",
      icon: "📦",
      link: "/cis",
    },
    {
      title: "eLog",
      description: "Log activities into the electronic logbook",
      icon: "📃",
      link: "/elog",
    },
    {
      title: "Admin",
      description: "Manage users, roles, and permissions",
      icon: "👤",
      link: "/admin",
    },
    {
      title: "Reports & Analytics",
      description: "View system-wide reports and performance analytics",
      icon: "📊",
      link: "/reports-analytics",
    },
    {
      title: "Settings",
      description: "Configure and manage system settings",
      icon: "⚙️",
      link: "/settings",
    },
  ];

  return (
    <div style={{ marginTop: "0px" }} className="dashboard-container">
      <h1>Dashboard</h1>

      <div className="dashboard-grid">
        {systems.map((system, index) => (
          <CardWidget
            key={index}
            title={system.title}
            description={system.description}
            icon={system.icon}
            link={system.link}
          />
        ))}
      </div>
    </div>
  );
}

export default Home;
