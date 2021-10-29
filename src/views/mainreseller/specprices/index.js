import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Specprices = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './specprices')
);
const AddSpecprice = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './addspecprice')
);
const EditSpecprice = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './editspecprice')
);

const Specprice = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        render={props => <Specprices {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={props => <AddSpecprice {...props} />}
      />
      <Route
        path={`${match.url}/edit`}
        render={props => <EditSpecprice {...props} />}
      />
    </Switch>
  </Suspense>
);
export default Specprice;
