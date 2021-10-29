import React, { Component } from "react";
import {
  AvForm,
  AvGroup,
  AvField,
  AvInput,
  AvFeedback
} from "availity-reactstrap-validation";
import { Row, Button, Label, Card, CardBody, InputGroup, InputGroupAddon, CustomInput, CardImg } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import axios from 'axios';
import config from '../../config.json';
import IntlMessages from "../../helpers/IntlMessages";

class AddProductForm extends Component {
  constructor(props) {
    super();
    this.state = {
      categorys: [],
      file: null,
      filePath: null
    };
    this.getCategorys();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  getCategorys() {
    axios.get(config.api.url + '/admin/category/list/')
      .then((res) => {
        if (res.status === 200) {
          this.setState({ categorys: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ categorys: [] });
      });
  }

  handleSubmit(event, errors, values) {
    console.log(values);
    if (errors.length === 0) {
      if (this.state.file == null) {
        alert("Please upload product image!");
      } else {
        var formData = new FormData();
        formData.append("category_id", values.category_id);
        formData.append("credit_price", values.credit_price);
        formData.append("product_name", values.product_name);
        formData.append("productimg", this.state.file);
        const configHeader = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        };
        axios.post(config.api.url + '/admin/product/add', formData, configHeader)
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
  }

  onChange(e) {
    this.setState({
      file: e.target.files[0],
      filePath: URL.createObjectURL(e.target.files[0])
    });
  }

  render() {
    return (
      <Card className="mb-5">
        <CardBody>
          <Row>
            <Colxx xs="8" md="8" className="mb-3">
              <h6 className="mb-4"><IntlMessages id="form.addnewproduct" /></h6>
              <AvForm
                className="av-tooltip tooltip-label-right"
                onSubmit={this.handleSubmit}>
                <AvGroup>
                  <Label><IntlMessages id="form.product" /></Label>
                  <AvInput name="product_name" required />
                  <AvFeedback><IntlMessages id="form.reqproduct" /></AvFeedback>
                </AvGroup>
                <AvGroup>
                  <Label><IntlMessages id="form.credit" /></Label>
                  <AvInput name="credit_price" required />
                  <AvFeedback><IntlMessages id="form.reqcredit" /></AvFeedback>
                </AvGroup>
                <AvField
                  type="select"
                  name="category_id"
                  required
                  label="Category"
                  errorMessage="Please select an option!">
                  <option value="0" />
                  {this.state.categorys.map((category, index) => (
                    <option key={index} value={category._id}>{category.category_name}</option>
                  ))}
                </AvField>
                <Label><IntlMessages id="form.image" /></Label>
                <InputGroup className="mb-3">
                  <CustomInput
                    type="file"
                    id="productimg"
                    name="productimg"
                    accept="image/*"
                    required
                    errorMessage="Please upload product image!"
                    onChange={this.onChange}
                  />
                  <InputGroupAddon addonType="append">Upload</InputGroupAddon>
                </InputGroup>
                <Button color="primary" className="mb-4"><IntlMessages id="form.submit" /></Button>
              </AvForm>
            </Colxx>
            <Colxx xs="3" md="3" className="mb-15">
              <CardImg bottom src={this.state.filePath} style={{ width: "300px", height: "300px", margin: "auto", display: "block" }} />
            </Colxx>
          </Row>
        </CardBody>
      </Card>
    );
  }
}

export default AddProductForm;
