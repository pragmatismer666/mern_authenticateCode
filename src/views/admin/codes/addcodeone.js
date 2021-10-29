import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import AddCodeoneForm from "../../../containers/form-validations/AddCodeOneForm";

export default class Addcodeone extends Component {
 
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
            <AddCodeoneForm history={this.props.history}/>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
