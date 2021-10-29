import React, { Suspense } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';

const Products = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './products')
);
const AddProduct = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './addproduct')
);
const EditProduct = React.lazy(() =>
  import(/* webpackChunkName: "dashboard-default" */ './editproduct')
);

const Product = ({ match }) => (
  <Suspense fallback={<div className="loading" />}>
    <Switch>
      <Redirect exact from={`${match.url}/`} to={`${match.url}/list`} />
      <Route
        path={`${match.url}/list`}
        render={props => <Products {...props} />}
      />
      <Route
        path={`${match.url}/add`}
        render={props => <AddProduct {...props} />}
      />
      <Route
        path={`${match.url}/edit`}
        render={props => <EditProduct {...props} />}
      />
    </Switch>
  </Suspense>
);
export default Product;
