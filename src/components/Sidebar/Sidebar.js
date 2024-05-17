import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { useLocation } from "react-router-dom";
import { faHome, faNewspaper, faCog, faBox, faTicket, faLock, faClock } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation(); // Use the current location to determine the active button
  const [isCollapsed, setIsCollapsed] = useState(true); // State to manage the collapsed/expanded state of the sidebar
  const [activeButton, setActiveButton] = useState(
    localStorage.getItem("activeButton") || location.pathname
  ); // State to keep track of the active button

  const buttons = [
    { path: "/home", icon: faHome, label: "Home" },
    { path: "/inventory", icon: faBox, label: "Inventory" },
    { path: "/cwm", icon: faTicket, label: "Issues" },
    { path: "/elog", icon: faNewspaper, label: "eLogs" },
    { path: "/815", icon: faClock, label: "8:15" },
    { path: "/admin/generalAdmin", icon: faLock, label: "Admin" },
    { path: "/settings", icon: faCog, label: "Settings" },
  ];
  
  const renderButtons = () => {
    return buttons.map((button, index) => (
      <div key={index}>
        {/* Check if the button is for "eLogs" */}
        {button.path === "/elog" ? (
          <a href="https://accel-webapp-dev.slac.stanford.edu/elog" target="_blank" rel="noopener noreferrer">
            {/* Use 'a' tag instead of 'Link' */}
            <button
              className={`icon-button ${
                activeButton === button.path ? "active-button" : ""
              }`}
            >
              <div className="button-label">
                <FontAwesomeIcon icon={button.icon} className="icon" title={button.label} />
                <div className="small-label">{button.label}</div>
                <span className="label">{button.label}</span>
              </div>
            </button>
          </a>
        ) : (
          // For other buttons, continue using 'Link' component
          <Link to={button.path}>
            <button
              onClick={() => handleClick(button.label.toLowerCase(), button.path)}
              className={`icon-button ${
                activeButton === button.path ? "active-button" : ""
              }`}
            >
              <div className="button-label">
                <FontAwesomeIcon icon={button.icon} className="icon" title={button.label} />
                <div className="small-label">{button.label}</div>
                <span className="label">{button.label}</span>
              </div>
            </button>
          </Link>
        )}
      </div>
    ));
  };
  

  // Handle button clicks and update the active button
  const handleClick = (buttonName, path) => {
    if (activeButton !== path) {
      setActiveButton(path);
      localStorage.setItem("activeButton", path);
    }
  };

  // Use useEffect to add a resize event listener and handle collapsing the sidebar on small screens
  useEffect(() => {
    const handleResize = () => {
      const sidebar = document.querySelector(".Sidebar");
      if (window.innerWidth < 768) {
        setIsCollapsed(true);
      }
    };

    window.addEventListener("resize", handleResize);
    // Remove the event listener on component unmount
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []); // Empty dependency array ensures it only runs once on mount

  return (
    <div className={`Sidebar ${isCollapsed ? "collapsed" : ""}`}>
      <ul>
        <br></br>
        {renderButtons()}
      </ul>
    </div>
  );
}

export default Sidebar;
