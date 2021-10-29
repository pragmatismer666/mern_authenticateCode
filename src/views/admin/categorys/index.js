import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Categorys = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './categorys')
);
const AddCategory = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './addcategory')
);
const EditCategory = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './editcategory')
);

const Category = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        render={props => <Categorys {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={props => <AddCategory {...props} />}
      />
      <Route
        path={`${match.url}/edit`}
        render={props => <EditCategory {...props} />}
      />
    </Switch>
  </Suspense>
);
export default Category;
