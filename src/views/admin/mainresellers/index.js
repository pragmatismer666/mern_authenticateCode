import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const MainResellers = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './mainresellers')
);
const AddainReseller = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './addmainreseller')
);
const EditmainReseller = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './editmainreseller')
);

const MainReseller = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        render={props => <MainResellers {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={props => <AddainReseller {...props} />}
      />
      <Route
        path={`${match.url}/edit`}
        render={props => <EditmainReseller {...props} />}
      />
    </Switch>
  </Suspense>
);
export default MainReseller;
