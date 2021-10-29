import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Codes = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './codes')
);
const AddCode = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './addcode')
);
const EditCode = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './editcode')
);
const AddCodeone = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './addcodeone')
);

const Code = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        render={props => <Codes {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={props => <AddCode {...props} />}
      />
      <Route
        path={`${match.url}/edit`}
        render={props => <EditCode {...props} />}
      />
      <Route
        path={`${match.url}/addone`}
        render={props => <AddCodeone {...props} />}
      />
    </Switch>
  </Suspense>
);
export default Code;
