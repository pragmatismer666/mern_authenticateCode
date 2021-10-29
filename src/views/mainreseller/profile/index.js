import React, { Component, Fragment } from "react";
import { Row } from "reactstrap";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import ProfileForm from "../../../containers/form-validations/ProfileForm";

export default class MainResellerProfile extends Component {
 
  constructor(props) {
    super();
    this.state = {
        userid: localStorage.getItem("user_id")
    };
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
            <ProfileForm userid={this.state.userid}/>
          </Colxx>
        </Row>
      </Fragment>
    );
  }
}

