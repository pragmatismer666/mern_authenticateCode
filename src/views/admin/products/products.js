import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from 'axios';
import config from '../../../config.json';

export default class Products extends Component {

  constructor(props) {
    super();
    this.state = {
      products: [],
      modalConfirmAlert: false
    };
    this.getProducts();
    this.navigateToAdd = this.navigateToAdd.bind(this);
  }

  getProducts() {
    axios.get(config.api.url + '/admin/product/list/')
      .then((res) => {
        if (res.status === 200) {
          var tempProducts = res.data;
          var products = [];
          for (let i = 0; i < tempProducts.length; i++) {
            axios.get(config.api.url + '/admin/category/list/' + tempProducts[i].category_id)
              .then((res) => {
                if (res.status === 200) {
                  products[i] = tempProducts[i];
                  products[i].category_name = res.data[0].category_name;
                  if ((i + 1) === tempProducts.length) {
                    this.setState({ products: products });
                  }
                }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ products: [] });
      });
  }

  navigateToAdd() {
    this.props.history.push("add");
  }

  editProduct(_id) {
    this.props.history.push("edit", { "_id": _id });
  }

  deleteProduct() {
    axios.post(config.api.url + '/admin/product/delete/' + this.state.selectedId)
      .then((res) => {
        if (res.status === 200) {
          this.toggleConfirmAlertModal();
          this.getProducts();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ products: [] });
      });
  }

  toggleConfirmAlertModal = (id) => {
    this.setState(prevState => ({
      modalConfirmAlert: !prevState.modalConfirmAlert,
      selectedId: id
    }));
  };

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.products" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="table.products" />
                </CardTitle>
                <Button onClick={this.navigateToAdd} color="primary" className="mb-2">
                  <div className="simple-icon-basket-loaded">  <IntlMessages id="table.addnew" /></div>
                </Button>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th><IntlMessages id="table.picture" /></th>
                      <th><IntlMessages id="table.productname" /></th>
                      <th><IntlMessages id="table.creditprice" /></th>
                      <th><IntlMessages id="table.category" /></th>
                      <th><IntlMessages id="table.action" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.products.map((product, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td><img style={{ width: "30px", height: "30px" }} src={"/assets/img/products/" + product.meta_data.filename} alt="Product"></img></td>
                        <td>{product.product_name}</td>
                        <td>{product.credit_price}</td>
                        <td>{product.category_name}</td>
                        <td>
                          <Button onClick={() => this.editProduct(product._id)} color="primary" size="xs" className="mb-2">
                            <div className="iconsminds-file-edit"> <IntlMessages id="menu.edit" /> </div>
                          </Button>{"    "}
                          <Button onClick={() => this.toggleConfirmAlertModal(product._id)} color="danger" size="xs" className="mb-2">
                            <div className="iconsminds-file-edit"> <IntlMessages id="menu.delete" /> </div>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Colxx>
        </Row>

        <Modal
          isOpen={this.state.modalConfirmAlert}
          size="lg"
          toggle={this.toggleConfirmAlertModal}
        >
          <ModalHeader toggle={this.toggleConfirmAlertModal}>
            Alert:
    </ModalHeader>
          <ModalBody style={{ textAlign: "center" }}>
            <p>Are you sure to delete this?</p>
            <Button onClick={() => this.deleteProduct()} color="danger" className="mb-2">
              OK
          </Button>{"   "}
            <Button onClick={() => this.toggleConfirmAlertModal()} color="primary" className="mb-2">
              Cancel
          </Button>
          </ModalBody>
        </Modal>
      </Fragment >
    );
  }
}
