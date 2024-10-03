import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faNewspaper, faCog, faBox, faTicket, faLock, faClock, faScrewdriverWrench } from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

function Sidebar() {
    const location = useLocation();
    const [isCollapsed, setIsCollapsed] = useState(true);
    const [activeButton, setActiveButton] = useState(localStorage.getItem("activeButton") || "/cwm/dashboard");

    useEffect(() => {
        const path = location.pathname;

        // Set active button based on path
        if (path.startsWith("/cwm/pmm")) {
            setActiveButton("/cwm/pmm"); // Only PMM button is active
        } else if (path.startsWith("/cwm/admin")) {
            setActiveButton("/cwm/admin"); // Only Admin button is active
        } else if (path.startsWith("/cwm/dashboard")) {
            setActiveButton("/cwm/dashboard"); // Only Issues button is active
        } else if (path.startsWith("/cwm")) {
            setActiveButton("/cwm/dashboard"); // Default to Issues for any other /cwm paths
        } else if (path.startsWith("/cis")) {
            setActiveButton("/cis");
        } else if (path.startsWith("/admin")) {
            setActiveButton("/admin/generalAdmin");
        } else {
            setActiveButton(path); // Default to current path
        }
    }, [location.pathname]);

    const buttons = [
        { path: "/home", icon: faHome, label: "Home" },
        { path: "/cwm/dashboard", icon: faTicket, label: "Issues" },
        { path: "/cwm/pmm", icon: faScrewdriverWrench, label: "PMM" },
        { path: "/815", icon: faClock, label: "8:15" },
        { path: "/cis", icon: faBox, label: "Inventory" },
        { path: "/elog", icon: faNewspaper, label: "eLogs" },
        { path: "/cwm/admin", icon: faLock, label: "Admin" },
        { path: "/settings", icon: faCog, label: "Settings" },
    ];

    const handleClick = (path) => {
        setActiveButton(path);
        localStorage.setItem("activeButton", path);
    };

    const renderButtons = () => {
        return buttons.map((button, index) => (
            <div key={index}>
                <Link to={button.path}>
                    <button
                        onClick={() => handleClick(button.path)}
                        className={`icon-button ${activeButton === button.path || (activeButton === "/cwm/dashboard" && button.path === "/cwm/dashboard") || (activeButton === "/cwm/pmm" && button.path === "/cwm/pmm") || (activeButton === "/cwm/admin" && button.path === "/cwm/admin") ? "active-button" : ""}`}
                    >
                        <div className="button-label">
                            <FontAwesomeIcon icon={button.icon} className="icon" title={button.label} />
                            <div className="small-label">{button.label}</div>
                            <span className="label">{button.label}</span>
                        </div>
                    </button>
                </Link>
            </div>
        ));
    };

    useEffect(() => {
        const handleResize = () => {
            if (window.innerWidth < 768) {
                setIsCollapsed(true);
            }
        };

        window.addEventListener("resize", handleResize);
        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);

    return (
        <div className={`Sidebar ${isCollapsed ? "collapsed" : ""}`}>
            <ul>
                <br />
                {renderButtons()}
            </ul>
        </div>
    );
}

export default Sidebar;
