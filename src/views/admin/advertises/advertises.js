import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from 'axios';
import config from '../../../config.json';

export default class Advertises extends Component {

  constructor(props) {
    super();
    this.state = {
      advertises: [],
      modalConfirmAlert: false
    };
    this.getAdvertises();
    this.navigateToAdd = this.navigateToAdd.bind(this);
  }

  getAdvertises() {
    axios.get(config.api.url + '/admin/advertise/list/')
      .then((res) => {
        if (res.status === 200) {
          this.setState({ advertises: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ advertises: [] });
      });
  }

  navigateToAdd() {
    this.props.history.push("add");
  }

  editAdvertise(_id) {
    this.props.history.push("edit", { "_id": _id });
  }

  deleteAdvertise() {
    axios.post(config.api.url + '/admin/advertise/delete/' + this.state.selectedId)
    .then((res) => {
      if (res.status === 200) {
          this.toggleConfirmAlertModal();
          this.getAdvertises();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ advertises: [] });
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
            <Breadcrumb heading="menu.advertises" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="table.advertises" />
                </CardTitle>
                <Button onClick={this.navigateToAdd} color="primary" className="mb-2">
                  <div className="simple-icon-list">  <IntlMessages id="table.addnew" /></div>
                </Button>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th><IntlMessages id="table.content" /></th>
                      <th><IntlMessages id="table.action" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.advertises.map((advertise, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{advertise.content}</td>
                        <td>
                          <Button onClick={() => this.editAdvertise(advertise._id)} color="primary" size="xs" className="mb-2">
                            <div className="iconsminds-file-edit"> <IntlMessages id="menu.edit" /> </div>
                          </Button>{"    "}
                          <Button onClick={() => this.toggleConfirmAlertModal(advertise._id)} color="danger" size="xs" className="mb-2">
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
            <Button onClick={() => this.deleteAdvertise()} color="danger" className="mb-2">
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
