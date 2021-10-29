import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import EditResellerForm from "../../../containers/form-validations/EditResellerForm";

export default class Editreseller extends Component {
 
  constructor(props) {
    super();
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.editresellers" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <EditResellerForm mainresellerid={this.props.location.state._id} history={this.props.history}/>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

