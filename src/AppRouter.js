import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Layout from './layout/layout';
import Home from './pages/dashboard/home'; 
import Cwm from './pages/cwm/cwm';
import ActivityDetails from './pages/cwm/activityDetails';
import Settings from './pages/settings/settings';
import Admin from './pages/admin/cwmAdmin';
import ClassDetails from './pages/admin/classDetail';
import WorkDetails from './pages/cwm/workDetails';
import Elog from './pages/elog/elog';
import Meeting from './pages/meeting/meeting';

function AppRouter() {
  return (
    <Router>
      <Layout>
        <Switch>
          <Route exact path="/" component={Home} />
          <Route path="/cwm/admin" component={Admin} />
          <Route path="/cwm/:workId/:activityId" component={WorkDetails} />
          <Route path="/cwm/:workId" component={WorkDetails} />
          <Route path="/home" component={Home} />
          {/* <Route path="/admin/:classId" component={ClassDetails} /> */}
          <Route path="/cwm" component={Cwm} />
          <Route path="/elog" component={Elog} />
          <Route path="/815" component={Meeting} />
          <Route path="/settings" component={Settings} />
        </Switch>
      </Layout>
    </Router>
  );
}

export default AppRouter;

