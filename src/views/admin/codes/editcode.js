import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import EditCodeForm from "../../../containers/form-validations/EditCodeForm";

export default class Editcode extends Component {
 
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.editcode" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <EditCodeForm history={this.props.history} codeid={this.props.location.state._id}/>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
