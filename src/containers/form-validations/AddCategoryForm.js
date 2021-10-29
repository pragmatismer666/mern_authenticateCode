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

class AddCategoryForm extends Component {
  constructor(props) {
    super();
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event, errors, values) {
    if (errors.length === 0) {
      axios.post(config.api.url + '/admin/category/add', values)
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
            <h6 className="mb-4">Add new category</h6>
            <AvForm
              className="av-tooltip tooltip-label-right"
              onSubmit={this.handleSubmit}>
              <AvGroup>
                <Label>Category Name</Label>
                <AvInput name="category_name" required />
                <AvFeedback>Category Name is required!</AvFeedback>
              </AvGroup>
              <Button color="primary">Submit</Button>
            </AvForm>
          </Colxx>
        </CardBody>
      </Card>
    );
  }
}

export default AddCategoryForm;
