import React, { Component } from "react";
import {
  AvForm
} from "availity-reactstrap-validation";
import { Row, Button, Label, Card, CardBody, InputGroup, CustomInput, CardImg } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import axios from 'axios';
import config from '../../config.json';
import IntlMessages from "../../helpers/IntlMessages";

class EditProductForm extends Component {
  constructor(props) {
    super();
    this.state = {
      productpic: {},
      file: null,
      filePath: ""
    };
    this.getProductPic(props.productpicid);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  getProductPic(_id) {
    axios.get(config.api.url + '/admin/productpic/list/' + _id)
      .then((res) => {
        if (res.status === 200) {
          let path = "/assets/img/products/" + res.data[0].meta_data.filename;
          this.setState({
            product: res.data[0],
            filePath: path
          });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ product: {} });
      });
  }

  handleSubmit(event, errors, values) {
    if (errors.length === 0) {
      if (this.state.file == null) {
        alert("Please upload product picture!");
      } else {
        var formData = new FormData();
        formData.append("productpic", this.state.file);
        const configHeader = {
          headers: {
            'content-type': 'multipart/form-data'
          }
        };
        axios.post(config.api.url + '/admin/productpic/edit/' + this.state.product._id, formData, configHeader)
          .then((res) => {
            if (res.status === 200) {
                window.location.reload();
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
            <Colxx xs="6" md="6" className="mb-3">
              <h6 className="mb-4"><IntlMessages id="form.editproduct" /></h6>
              <AvForm
                className="av-tooltip tooltip-label-right"
                onSubmit={this.handleSubmit}>
                
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
                </InputGroup>
                <Button color="primary"><IntlMessages id="form.submit" /></Button>
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

export default EditProductForm;
