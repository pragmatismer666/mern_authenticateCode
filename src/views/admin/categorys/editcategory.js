import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import EditCategoryForm from "../../../containers/form-validations/EditCategoryForm";

export default class Editcategory extends Component {
 
  constructor(props) {
    super();
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.editcategorys" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <EditCategoryForm categoryid={this.props.location.state._id}  history={this.props.history}/>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

