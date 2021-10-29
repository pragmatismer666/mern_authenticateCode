import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import EditSpecpriceForm from "../../../containers/form-validations/EditSpecpriceForm";

export default class Editspecprice extends Component {
 
  constructor(props) {
    super();
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="form.editspecprice" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <EditSpecpriceForm specpriceid={this.props.location.state._id} history={this.props.history}/>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

