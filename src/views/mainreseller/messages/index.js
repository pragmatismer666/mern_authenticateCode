import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Chats = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './chats')
);
const Tickets = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './tickets')
);

const Messages = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/tickets`} />
      <Route
        path={`${match.url}/tickets`}
        render={props => <Tickets {...props} />}
      />
      <Route
        path={`${match.url}/chats`}
        render={props => <Chats {...props} />}
      />
    </Switch>
  </Suspense>
);
export default Messages;
