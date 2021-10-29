import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Advertises = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './advertises')
);
const AddAdvertise = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './addadvertise')
);
const EditAdvertise = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './editadvertise')
);

const Advertise = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        render={props => <Advertises {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={props => <AddAdvertise {...props} />}
      />
      <Route
        path={`${match.url}/edit`}
        render={props => <EditAdvertise {...props} />}
      />
    </Switch>
  </Suspense>
);
export default Advertise;
