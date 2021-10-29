import React, { Component } from "react";
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback
} from "availity-reactstrap-validation";
import { Button, Label, Card, CardBody, CardImg, Row, InputGroup, InputGroupAddon, CustomInput } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import axios from 'axios';
import config from '../../config.json';
import IntlMessages from "../../helpers/IntlMessages";

class AddMainResellerForm extends Component {
  constructor(props) {
    super();
    this.state = {
      file: null,
      filePath: "/assets/img/avatar/unknown.png"
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  handleSubmit(event, errors, values) {
    if (errors.length === 0) {
      var formData = new FormData();
      formData.append("username", values.username);
      formData.append("email", values.email);
      formData.append("password", values.password);
      formData.append("credit", values.credit);
      formData.append("role", "mainreseller");
      formData.append("note", values.note);
      if (this.state.file != null) {
        formData.append("avatar", this.state.file);
      }
      const configHeader = {
        headers: {
          'content-type': 'multipart/form-data'
        }
      };
      axios.post(config.api.url + '/user/register', formData, configHeader)
        .then((res) => {
          if (res.status === 200) {
            this.props.history.push("list");
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  }

  removeAvatar() {
    this.setState(prevState => ({
      file: null,
      filePath: "/assets/img/avatar/unknown.png"
    }));
  }

  onChange(e) {
    if (e.target.files[0] !== undefined) {
      this.setState({
        file: e.target.files[0],
        filePath: URL.createObjectURL(e.target.files[0])
      });
    }
  }

  render() {
    return (
      <Card className="mb-5">
        <CardBody>
          <Row>
            <Colxx xs="8" md="8" className="mb-3">
              <h6 className="mb-4"><IntlMessages id="form.addnewmainreseller" /></h6>
              <AvForm
                className="av-tooltip tooltip-label-right"
                onSubmit={this.handleSubmit}>
                <AvGroup>
                  <Label><IntlMessages id="form.username" /></Label>
                  <AvInput name="username" required />
                  <AvFeedback><IntlMessages id="form.requsername" /></AvFeedback>
                </AvGroup>

                <AvGroup>
                  <Label><IntlMessages id="form.email" /></Label>
                  <AvInput name="email" required />
                  <AvFeedback><IntlMessages id="form.reqemail" /></AvFeedback>
                </AvGroup>

                <AvGroup>
                  <Label><IntlMessages id="form.password" /></Label>
                  <AvInput name="password" type="password" required />
                  <AvFeedback><IntlMessages id="form.reqpassword" /></AvFeedback>
                </AvGroup>

                <AvGroup>
                  <Label><IntlMessages id="form.credit" /></Label>
                  <AvInput name="credit" required />
                  <AvFeedback><IntlMessages id="form.reqcredit" /></AvFeedback>
                </AvGroup>

                <AvGroup>
                  <Label><IntlMessages id="form.note" /></Label>
                  <AvInput type="textarea" name="note" id="note" />
                </AvGroup>

                <Label><IntlMessages id="form.image" /></Label>
                <InputGroup className="mb-3">
                  <CustomInput
                    type="file"
                    id="avatar"
                    name="avatar"
                    accept="image/*"
                    errormessage="Please upload product image!"
                    onChange={this.onChange}
                  />
                  <InputGroupAddon addonType="append">Upload</InputGroupAddon>
                </InputGroup>
                <Button color="primary"><IntlMessages id="form.submit" /></Button>
              </AvForm>
            </Colxx>
            <Colxx xs="3" md="3" className="mb-15" style={{ textAlign: "center" }}>
              <CardImg className="mb-4" bottom src={this.state.filePath} style={{ width: "300px", height: "300px", margin: "auto", display: "block" }} />
              {
                (this.state.file != null) ?
                  <Button onClick={() => this.removeAvatar()} color="primary" ><IntlMessages id="button.remove" /></Button> : <Button color="primary" disabled><IntlMessages id="button.remove" /></Button>
              }
            </Colxx>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default AddMainResellerForm;
