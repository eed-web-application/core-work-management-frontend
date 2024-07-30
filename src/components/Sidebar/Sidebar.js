import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHome, faNewspaper, faCog, faBox, faTicket, faLock, faClock, faScrewdriverWrench} from "@fortawesome/free-solid-svg-icons";
import "./Sidebar.css";

function Sidebar() {
  const location = useLocation();
  const [isCollapsed, setIsCollapsed] = useState(true);
  const [activeButton, setActiveButton] = useState(localStorage.getItem("activeButton") || "/cwm");

  useEffect(() => {
    const path = location.pathname;

    if (path.startsWith("/cwm/pmm")) {
      setActiveButton("/cwm/pmm");
    } else if (path.startsWith("/cwm/admin")) {
      setActiveButton("/cwm/admin");
    } else if (path.startsWith("/cwm")) {
      setActiveButton("/cwm");
    } else if (path.startsWith("/cis")) {
      setActiveButton("/cis");
    } else if (path.startsWith("/admin")) {
      setActiveButton("/admin/generalAdmin");
    } else {
      setActiveButton(path);
    }
  }, [location.pathname]);

  useEffect(() => {
    const currentURL = window.location.href;
    if (currentURL.includes("/cwm/pmm")) {
      setActiveButton("/cwm/pmm");
    } else if (currentURL.includes("/cwm")) {
      setActiveButton("/cwm");
    }
  }, []);

  const buttons = [
    { path: "/home", icon: faHome, label: "Home" },
    { path: "/cwm", icon: faTicket, label: "Issues" },
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
        {button.path === "/elog" ? (
          <button
            onClick={() => {
              window.location.href = "https://accel-webapp-dev.slac.stanford.edu/elog";
              handleClick("/elog");
            }}
            className={`icon-button ${activeButton === button.path ? "active-button" : ""}`}
          >
            <div className="button-label">
              <FontAwesomeIcon icon={button.icon} className="icon" title={button.label} />
              <div className="small-label">{button.label}</div>
              <span className="label">{button.label}</span>
            </div>
          </button>
        // ) : button.path === "/cwm" ? (
        //   <button
        //     onClick={() => {
        //       window.location.href = "https://accel-webapp-dev.slac.stanford.edu/cwm";
        //       handleClick("/cwm");
        //     }}
        //     className={`icon-button ${activeButton === button.path ? "active-button" : ""}`}
        //   >
        //     <div className="button-label">
        //       <FontAwesomeIcon icon={button.icon} className="icon" title={button.label} />
        //       <div className="small-label">{button.label}</div>
        //       <span className="label">{button.label}</span>
        //     </div>
        //   </button>
        // ) : button.path === "/cis" ? (
        //   <button
        //     onClick={() => {
        //       window.location.href = "https://accel-webapp-dev.slac.stanford.edu/cis";
        //       handleClick("/cis");
        //     }}
        //     className={`icon-button ${activeButton === button.path ? "active-button" : ""}`}
        //   >
        //     <div className="button-label">
        //       <FontAwesomeIcon icon={button.icon} className="icon" title={button.label} />
        //       <div className="small-label">{button.label}</div>
        //       <span className="label">{button.label}</span>
        //     </div>
        //   </button>
        ) : (
          <Link to={button.path}>
            <button
              onClick={() => handleClick(button.path)}
              className={`icon-button ${activeButton === button.path ? "active-button" : ""}`}
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
        <br></br>
        {renderButtons()}
      </ul>
    </div>
  );
}

export default Sidebar;
