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

class EditCategoryForm extends Component {
  constructor(props) {
    super();
    this.state = {
      category: {},
    };
    this.getCategory(props.categoryid);
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  getCategory(_id) {
    axios.get(config.api.url + '/admin/category/list/' + _id)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ category: res.data[0] });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ category: {} });
      });
  }

  handleSubmit(event, errors, values) {
    if (errors.length === 0) {
      axios.post(config.api.url + '/admin/category/edit/' + this.state.category._id, values)
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
            <h6 className="mb-4"><IntlMessages id="form.editcategory" /></h6>
            <AvForm
              className="av-tooltip tooltip-label-right"
              onSubmit={this.handleSubmit}>
              <AvGroup>
                <Label>Category Name</Label>
                <AvInput name="category_name" value={this.state.category.category_name} required />
                <AvFeedback><IntlMessages id="form.reqcategory" /></AvFeedback>
              </AvGroup>
              <Button color="primary"><IntlMessages id="form.submit" /></Button>
            </AvForm>
          </Colxx>
        </CardBody>
      </Card>
    );
  }
}

export default EditCategoryForm;
