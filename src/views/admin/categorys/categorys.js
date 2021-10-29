import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from 'axios';
import config from '../../../config.json';

export default class Categorys extends Component {

  constructor(props) {
    super();
    this.state = {
      categorys: [],
      modalConfirmAlert: false
    };
    this.getCategorys();
    this.navigateToAdd = this.navigateToAdd.bind(this);
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

  navigateToAdd() {
    this.props.history.push("add");
  }

  editCategory(_id) {
    this.props.history.push("edit", { "_id": _id });
  }

  deleteCategory(_id) {
    axios.post(config.api.url + '/admin/category/delete/' + this.state.selectedId)
      .then((res) => {
        if (res.status === 200) {
          this.toggleConfirmAlertModal();
          this.getCategorys();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ categorys: [] });
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
            <Breadcrumb heading="menu.categorys" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="table.categorys" />
                </CardTitle>
                <Button onClick={this.navigateToAdd} color="primary" className="mb-2">
                  <div className="simple-icon-list">  <IntlMessages id="table.addnew" /></div>
                </Button>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th><IntlMessages id="table.categoryname" /></th>
                      <th><IntlMessages id="table.action" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.categorys.map((category, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{category.category_name}</td>
                        <td>
                          <Button onClick={() => this.editCategory(category._id)} color="primary" size="xs" className="mb-2">
                            <div className="iconsminds-file-edit"> <IntlMessages id="menu.edit" /> </div>
                          </Button>{"    "}
                          <Button onClick={() => this.toggleConfirmAlertModal(category._id)} color="danger" size="xs" className="mb-2">
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
            <Button onClick={() => this.deleteCategory()} color="danger" className="mb-2">
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
