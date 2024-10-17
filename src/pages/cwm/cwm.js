import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from "react-router-dom";
import { fetchAllDomain } from "../../services/api.js";
import "./cwm.css";

// Lazy load components
const SearchPage = lazy(() => import("./searchPage.js"));
const AdminPage = lazy(() => import("./admin/adminPage.js"));
const DashboardPage = lazy(() => import("./dashboardPage.js"));

function Cwm() {
  const location = useLocation();
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const fetchedDomains = await fetchAllDomain();
        setDomains(fetchedDomains.payload);
        if (fetchedDomains.payload.length > 0) {
          setSelectedDomain(fetchedDomains.payload[0].id);
        }
      } catch (error) {
        console.error('Error fetching domains:', error);
      }
    };
    fetchData();
  }, []);

  const handleDomainChange = (event) => {
    const selectedDomainId = event.target.value;
    setSelectedDomain(selectedDomainId);
  };

  return (
    <Router>
      <div>
        {/* Tab Bar with Domain Dropdown */}
        <div className="tab-extension">
          <div className="tab-bar">
            <NavLink to="/cwm/dashboard">Dashboard</NavLink>
            <NavLink to="/cwm/search">Search</NavLink>
            <NavLink to="/cwm/admin">Admin</NavLink>

            {/* Domain Dropdown */}
            <div className="select-domain-container">
              <label htmlFor="domain-select">Domain: </label>
              <select
                id="domain-select"
                value={selectedDomain}
                onChange={handleDomainChange}
              >
                {domains.map((domain) => (
                  <option key={domain.id} value={domain.id}>
                    {domain.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Pages */}
        <Suspense fallback={<div>Loading...</div>}>
  {selectedDomain ? (
    <Switch>
      <Route path="/cwm/dashboard">
        <DashboardPage selectedDomain={selectedDomain} />
      </Route>
      <Route path="/cwm/admin">
        <AdminPage selectedDomain={selectedDomain} />
      </Route>
      <Route path="/cwm/search">
        <SearchPage selectedDomain={selectedDomain} />
      </Route>
    </Switch>
  ) : (
    <div>Loading domain data...</div>
  )}
</Suspense>

      </div>
    </Router>
  );
}

// Custom NavLink component
function NavLink({ to, children }) {
  const location = useLocation();
  const isActive = location.pathname === to || (location.pathname === "/cwm" && to === "/cwm/search");

  return (
    <Link to={to} className={`cwm-tab ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
}

export default Cwm;
