import React, { useState } from 'react';
import { BrowserRouter as Router, Route, Switch, NavLink, Redirect } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faUser, faPeopleGroup, faLayerGroup, faHelmetSafety, faLocationDot } from '@fortawesome/free-solid-svg-icons';
import UsersPage from './usersPage';
import GroupsPage from './groupsPage';
import DomainsPage from './domainsPage';
import ShopgroupsPage from './shopgroupsPage';
import LocationsPage from './locationsPage';
import SideSheet from '../../../components/SideSheet';
import adminStyles from './adminSideSheet.module.css';
import './adminPage.css';

const AdminPage = ({selectedDomain}) => {
  const [sheetContent, setSheetContent] = useState(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  const handleOpenSheet = (content) => {
    setSheetContent(content);
    setIsSheetOpen(true);
  };

  const handleCloseSheet = () => {
    setIsSheetOpen(false);
    setSheetContent(null);
  };

  return (
    <Router>
      <div className="admin-dashboard">
        <nav className="admin-nav">
          <ul>
            <li>
              <NavLink to="/cwm/admin/users">
                <div className="nav-item">
                  <FontAwesomeIcon icon={faUser} />
                  <span>Users</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cwm/admin/groups">
                <div className="nav-item">
                  <FontAwesomeIcon icon={faPeopleGroup} />
                  <span>Groups</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cwm/admin/domains">
                <div className="nav-item">
                  <FontAwesomeIcon icon={faLayerGroup} />
                  <span>Domains</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cwm/admin/shopgroups">
                <div className="nav-item">
                  <FontAwesomeIcon icon={faHelmetSafety} />
                  <span>Shop Groups</span>
                </div>
              </NavLink>
            </li>
            <li>
              <NavLink to="/cwm/admin/locations">
                <div className="nav-item">
                  <FontAwesomeIcon icon={faLocationDot} />
                  <span>Locations</span>
                </div>
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="admin-content">
          <Switch>
            {/* Default route to redirect to /cwm/admin/users */}
            <Route exact path="/cwm/admin">
              <Redirect to="/cwm/admin/users" />
            </Route>

            <Route path="/cwm/admin/users" component={() => <UsersPage selectedDomain={selectedDomain} openSheet={handleOpenSheet} isSheetOpen={isSheetOpen} />} />
            <Route path="/cwm/admin/groups" component={() => <GroupsPage selectedDomain={selectedDomain} openSheet={handleOpenSheet} />} />
            <Route path="/cwm/admin/domains" component={() => <DomainsPage openSheet={handleOpenSheet} />} />
            <Route path="/cwm/admin/shopgroups" component={() => <ShopgroupsPage selectedDomain={selectedDomain} openSheet={handleOpenSheet} />} />
            <Route path="/cwm/admin/locations" component={() => <LocationsPage selectedDomain={selectedDomain} openSheet={handleOpenSheet} />} />
          </Switch>
        </div>

        {isSheetOpen && (
          <>
            <div className="side-sheet-overlay" onClick={handleCloseSheet}></div>
            <SideSheet sheetBody={sheetContent} onClose={handleCloseSheet} className={isSheetOpen ? 'open' : ''} styles={adminStyles} />
          </>
        )}
      </div>
    </Router>
  );
};

export default AdminPage;
