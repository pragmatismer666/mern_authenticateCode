import React, { Component, Suspense } from 'react';
import { Route, withRouter, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';

import AdminLayout from '../../layout/AdminLayout';

const Dashboard = React.lazy(() =>
  import(/* webpackChunkName: "viwes-dashboard" */ './dashboard')
);
const Mainreseller = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './mainresellers')
);
const Categorys = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './categorys')
);
const Products = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './products')
);
const Codes = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './codes')
);
const Advertises = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './advertises')
);
const Profile = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './profile')
);
const Messages = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './messages')
);
const Specprices = React.lazy(() =>
import(/* webpackChunkName: "viwes-main-reseller" */ './specprices')
);

class Admin extends Component {
  render() {
    const { match } = this.props;

    return (
      <AdminLayout>
        <div className="dashboard-wrapper">
          <Suspense fallback={<div className="loading" />}>
            <Switch>
              <Redirect exact from={`${match.url}/`} to={`${match.url}/dashboard`} />
              <Route
                path={`${match.url}/dashboard`}
                render={props => <Dashboard {...props} />}
              />
              <Route
                path={`${match.url}/mainreseller`}
                render={props => <Mainreseller {...props} />}
              />
              <Route
                path={`${match.url}/categorys`}
                render={props => <Categorys {...props} />}
              />
              <Route
                path={`${match.url}/products`}
                render={props => <Products {...props} />}
              />
              <Route
                path={`${match.url}/codes`}
                render={props => <Codes {...props} />}
              />
              <Route
                path={`${match.url}/advertises`}
                render={props => <Advertises {...props} />}
              />
              <Route
                path={`${match.url}/profile`}
                render={props => <Profile {...props} />}
              />
              <Route
                path={`${match.url}/messages`}
                render={props => <Messages {...props} />}
              />
              <Route
                path={`${match.url}/specprices`}
                render={props => <Specprices {...props} />}
              />
              <Redirect to="/error" />
            </Switch>
          </Suspense>
        </div>
      </AdminLayout>
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
  )(Admin)
);
