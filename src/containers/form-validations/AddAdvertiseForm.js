import React, { Component } from "react";
import {
  AvForm,
  AvGroup,
  AvInput,
  AvFeedback
} from "availity-reactstrap-validation";
import { Button, Label, Card, CardBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import axios from 'axios';
import config from '../../config.json';
import IntlMessages from "../../helpers/IntlMessages";

class AddAdvertiseForm extends Component {
  constructor(props) {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event, errors, values) {
    if (errors.length === 0) {
      axios.post(config.api.url + '/admin/advertise/add', values)
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

  render() {
    return (
      <Card className="mb-5">
        <CardBody>
          <Colxx xs="12" md="6" className="mb-3">
            <h6 className="mb-4"><IntlMessages id="form.addnewadvertise" /></h6>
            <AvForm
              className="av-tooltip tooltip-label-right"
              onSubmit={this.handleSubmit}>
              <AvGroup>
                <Label><IntlMessages id="form.content" /></Label>
                <AvInput type="textarea" name="content" id="content" required />
                <AvFeedback><IntlMessages id="form.reqcontent" /></AvFeedback>
              </AvGroup>
              <Button color="primary"><IntlMessages id="form.submit" /></Button>
            </AvForm>
          </Colxx>
        </CardBody>
      </Card>
    );
  }
}

export default AddAdvertiseForm;
