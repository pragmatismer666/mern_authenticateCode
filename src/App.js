import React, { Component, Suspense } from 'react';
import { connect } from 'react-redux';
import {
  BrowserRouter as Router,
  // HashRouter as Router,
  Route,
  Switch,
  Redirect
} from 'react-router-dom';
import { IntlProvider } from 'react-intl';
import './helpers/Firebase';
import AppLocale from './lang';
import ColorSwitcher from './components/common/ColorSwitcher';
import NotificationContainer from './components/common/react-notifications/NotificationContainer';
import { isMultiColorActive } from './constants/defaultValues';
import { getDirection } from './helpers/Utils';


const ViewMain = React.lazy(() =>
  import(/* webpackChunkName: "views" */ './views')
);
const Admin = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './views/admin')
);
const Mainreseller = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './views/mainreseller')
);
const Reseller = React.lazy(() =>
  import(/* webpackChunkName: "views-app" */ './views/reseller')
);
const ViewUser = React.lazy(() =>
  import(/* webpackChunkName: "views-user" */ './views/user')
);
const ViewError = React.lazy(() =>
  import(/* webpackChunkName: "views-error" */ './views/error')
);

const AuthRoute = ({ component: Component, authUser, ...rest }) => {
  return (
    <Route
      {...rest}
      render={props =>
        authUser ? (
          <Component {...props} />
        ) : (
            <Redirect
              to={{
                pathname: '/user/login',
                state: { from: props.location }
              }}
            />
          )
      }
    />
  );
}

class App extends Component {
  constructor(props) {
    super();
    const direction = getDirection();
    if (direction.isRtl) {
      document.body.classList.add('rtl');
      document.body.classList.remove('ltr');
    } else {
      document.body.classList.add('ltr');
      document.body.classList.remove('rtl');
    }
    this.autoLogout();
  }

  autoLogout() {
    setTimeout(() => {
      localStorage.removeItem('user_id');
      localStorage.removeItem('username');
      localStorage.removeItem('role');
      window.location.reload();
    }, 1000 * 60 * 30);
  }

  render() {
    const { locale, loginUser } = this.props;
    const currentAppLocale = AppLocale[locale];

    return (
      <div className="h-100">
        <IntlProvider
          locale={currentAppLocale.locale}
          messages={currentAppLocale.messages}
        >
          <React.Fragment>
            <NotificationContainer />
            {isMultiColorActive && <ColorSwitcher />}
            <Suspense fallback={<div className="loading" />}>
              <Router>
                <Switch>
                  <AuthRoute
                    path="/admin"
                    authUser={loginUser}
                    component={Admin}
                  />
                  <AuthRoute
                    path="/mainreseller"
                    authUser={loginUser}
                    component={Mainreseller}
                  />
                  <AuthRoute
                    path="/reseller"
                    authUser={loginUser}
                    component={Reseller}
                  />
                  <Route
                    path="/user"
                    render={props => <ViewUser {...props} />}
                  />
                  <Route
                    path="/error"
                    exact
                    render={props => <ViewError {...props} />}
                  />
                  <Route
                    path="/"
                    exact
                    render={props => <ViewMain {...props} />}
                  />
                  <Redirect to="/error" />
                </Switch>
              </Router>
            </Suspense>
          </React.Fragment>
        </IntlProvider>
      </div>
    );
  }
}

const mapStateToProps = ({ authUser, settings }) => {
  const { user: loginUser } = authUser;
  const { locale } = settings;
  return { loginUser, locale };
};
const mapActionsToProps = {};

export default connect(
  mapStateToProps,
  mapActionsToProps
)(App);
