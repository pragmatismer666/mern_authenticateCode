import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import EditAdvertiseForm from "../../../containers/form-validations/EditAdvertiseForm";

export default class Editadvertise extends Component {
 
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.addadvertises" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <EditAdvertiseForm advertiseid={this.props.location.state._id}  history={this.props.history}/>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
