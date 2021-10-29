import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import ResellerLayout from '../../layout/ResellerLayout';

const Dashboard = React.lazy(() =>
  import(/* webpackChunkName: "viwes-dashboard" */ './dashboard')
);
const Buycode = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './buycode')
);
const Purchasedcode = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './purchasedcode')
);
const Profile = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './profile')
);
const Messages = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './messages')
);

class Reseller extends Component {
  render() {
    const { match } = this.props;

    return (
      <ResellerLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
              <Route
                path={`${match.url}/dashboard`}
                render={props => <Dashboard {...props} />}
              />
              <Route
                path={`${match.url}/buycode`}
                render={props => <Buycode {...props} />}
              />
              <Route
                path={`${match.url}/purchasedcode`}
                render={props => <Purchasedcode {...props} />}
              />
              <Route
                path={`${match.url}/profile`}
                render={props => <Profile {...props} />}
              />
              <Route
                path={`${match.url}/messages`}
                render={props => <Messages {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </ResellerLayout>
    );
  }
}
const mapStateToProps = ({ menu }) => {
  const { containerClassnames } = menu;
  return { containerClassnames };
};

export default withRouter(
  connect(
    mapStateToProps,
    {}
  )(Reseller)
);
