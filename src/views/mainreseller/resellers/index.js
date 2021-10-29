import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Resellers = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './resellers')
);
const AddReseller = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './addreseller')
);
const EditReseller = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './editreseller')
);

const Reseller = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        render={props => <Resellers {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={props => <AddReseller {...props} />}
      />
      <Route
        path={`${match.url}/edit`}
        render={props => <EditReseller {...props} />}
      />
    </Switch>
  </Suspense>
);
export default Reseller;
