import React, { Component } from "react";
import {
  AvForm,
  AvField,
} from "availity-reactstrap-validation";
import { Button, Label, Card, CardBody, InputGroup, InputGroupAddon, CustomInput } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import axios from 'axios';
import config from '../../config.json';
import IntlMessages from "../../helpers/IntlMessages";

class AddCodeForm extends Component {
  constructor(props) {
    super();
    this.state = {
      products: [],
      codes: [],
      file: null
    };
    this.getProducts();
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFileUpload = this.handleFileUpload.bind(this);
  }

  getProducts() {
    axios.get(config.api.url + '/admin/product/list/')
      .then((res) => {
        if (res.status === 200) {
          this.setState({ products: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ products: [] });
      });
  }

  handleSubmit(event, errors, values) {
    values.codes = this.state.codes;
    if (errors.length === 0) {
      if (this.state.file == null) {
        alert("Please upload csv file!");
      } else {
        axios.post(config.api.url + '/admin/code/add', values)
          .then((res) => {
            if (res.status === 200) {
              try {
                if (res.data.error !== 'Exist') {
                  this.props.history.push("list");
                }
              } catch (error) {
                console.log(error);
              }
            }
          })
          .catch((err) => {
            console.log(err);
          });
      }
    }
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsText(file);
    const self = this;
    reader.onload = (x) => {
      const lines = x.currentTarget.result.split('\n');
      lines.pop();
      self.setState({ codes: lines, file: file });
    }
  }

  render() {
    return (
      <Card className="mb-5">
        <CardBody>
          <Colxx xs="12" md="6" className="mb-3">
            <h6 className="mb-4"><IntlMessages id="form.uploadcsv" /></h6>
            <AvForm
              className="av-tooltip tooltip-label-right"
              onSubmit={this.handleSubmit}>
              <AvField
                type="select"
                name="product_id"
                required
                label="Product"
                errorMessage="Please select an option!">
                <option value="0" />
                {this.state.products.map((product, index) => (
                  <option key={index} value={product._id}>{product.product_name}</option>
                ))}
              </AvField>
              <Label><IntlMessages id="form.csvfile" /></Label>
              <InputGroup className="mb-3">
                <CustomInput
                  type="file"
                  id="csv-file"
                  name="csv-file"
                  accept=".csv"
                  required
                  errorMessage="Please upload csv file!"
                  onChange={this.handleFileUpload}
                />
                <InputGroupAddon addonType="append">Upload</InputGroupAddon>
              </InputGroup>
              <Button color="primary"><IntlMessages id="form.submit" /></Button>
            </AvForm>
          </Colxx>
        </CardBody>
      </Card>
    );
  }
}

export default AddCodeForm;
