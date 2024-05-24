import React from 'react';
import { BrowserRouter as Router, Switch, Route, Link, useLocation, Redirect } from "react-router-dom";
import CWMadmin from "./cwmAdmin.js";
import './admin.css';

function Admin() {

  return (
    <Router>
      <div>
        <div className="admin-tab-extension">
          <div className="tab-bar">
            <NavLink to="/cwm/admin">CWM</NavLink>
          </div>
        </div>
        <Switch>
          <Route exact path="/">
            <CWMadmin />
          </Route>
          <Route path="/cwm/admin">
            <CWMadmin />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

// Custom NavLink component to handle active styling
function NavLink({ to, children }) {
  const location = useLocation(); // Hook from react-router-dom to get the current location
  const isActive = location.pathname === to || (location.pathname === "/admin" && to === "/admin/CISadmin"); // Check if current location is root path and target is "Search"

  return (
    <Link to={to} className={`cwm-tab ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
}

export default Admin;

