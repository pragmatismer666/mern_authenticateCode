import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import AddSpecpriceForm from "../../../containers/form-validations/AddSpecpriceForm";

export default class Addmspecprice extends Component {
 
  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="form.addnewspecprice" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <AddSpecpriceForm history={this.props.history}/>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}
