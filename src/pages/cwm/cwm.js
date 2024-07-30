import React, { useState, useEffect, Suspense, lazy } from "react";
import { BrowserRouter as Router, Switch, Route, Link, useLocation } from "react-router-dom";
import { fetchWorkDomain } from "../../services/api.js";
import "./cwm.css";

// Lazy load components
const SearchPage = lazy(() => import("./searchPage.js"));
const ReportsPage = lazy(() => import("./reportsPage.js"));
const CalendarPage = lazy(() => import("./calendarPage.js"));

function Cwm() {
  const location = useLocation(); // Hook from react-router-dom to get the current location
  const [domains, setDomains] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState('');

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch domains here
        const fetchedDomains = await fetchWorkDomain();
        setDomains(fetchedDomains.payload);
        // Set the default selected domain to the first domain ID if domains exist
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
        <div className="tab-extension">
          <div className="tab-bar">
            <NavLink to="/cwm/search">Search</NavLink>
            {/* <NavLink to="/cwm/reports">Reports</NavLink>
            <NavLink to="/cwm/calendar">Calendar</NavLink> */}
            {/* Select Domain */}
            <div className="select-domain-container">
              <label htmlFor="select-domain">Domain: </label>
              <select id="select-domain" onChange={handleDomainChange} value={selectedDomain}>
                {domains.map(domain => (
                  <option key={domain.id} value={domain.id}>{domain.name}</option>
                ))}
              </select>
            </div>
          </div>
        </div>
        <Suspense fallback={<div>Loading...</div>}>
          <Switch>
            <Route path="/cwm/reports">
              <ReportsPage />
            </Route>
            <Route path="/cwm/calendar">
              <CalendarPage />
            </Route>
            <Route path="/cwm/search">
              <SearchPage selectedDomain={selectedDomain} />
            </Route>
            <Route path="/cwm"> {/* Render SearchPage when root path is matched */}
              <SearchPage selectedDomain={selectedDomain} />
            </Route>
          </Switch>
        </Suspense>
      </div>
    </Router>
  );
}

// Custom NavLink component to handle active styling
function NavLink({ to, children }) {
  const location = useLocation(); // Hook from react-router-dom to get the current location
  const isActive = location.pathname === to || (location.pathname === "/cwm" && to === "/cwm/search"); // Check if current location is root path and target is "Search"

  return (
    <Link to={to} className={`cwm-tab ${isActive ? 'active' : ''}`}>
      {children}
    </Link>
  );
}

export default Cwm;
