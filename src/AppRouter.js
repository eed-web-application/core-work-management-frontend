import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './layout/layout';
import Home from './pages/dashboard/home'; 
import Cwm from './pages/cwm/cwm';
import Pmm from './pages/pmm/pmm';
import Settings from './pages/settings/settings';
import AdminPage from './pages/cwm/admin/adminPage';
import WorkDetails from './pages/cwm/workDetails';
import Elog from './pages/elog/elog';
import Meeting from './pages/meeting/meeting';
import DashboardPage from './pages/cwm/dashboardPage';

function AppRouter() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/cwm/pmm" component={Pmm} />
          <Route exact path="/cwm/dashboard" component={Cwm} />
          {/* <Route path="/cwm/:workId/:activityId" component={WorkDetails} /> */}
          <Route path="/cwm/:workId" component={WorkDetails} />
          <Route path="/cwm/admin" component={AdminPage} />
          <Route path="/home" component={Home} />
          {/* <Route path="/cwm" component={Cwm} /> */}
          <Route path="/elog" component={Elog} />
          <Route path="/815" component={Meeting} />
          <Route path="/settings" component={Settings} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default AppRouter;

