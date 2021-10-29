import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from 'axios';
import config from '../../../config.json';
import CreditForm from "../../../containers/form-validations/CreditForm";

export default class Mainresellers extends Component {

  constructor(props) {
    super();
    this.state = {
      mainResellers: [],
      modalCredit: false,
      modalConfirmAlert: false
    };
    this.getMainResellers();
    this.navigateToAdd = this.navigateToAdd.bind(this);
  }

  getMainResellers() {
    axios.get(config.api.url + '/admin/mainreseller/list/')
      .then((res) => {
        if (res.status === 200) {
          this.setState({ mainResellers: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ mainResellers: [] });
      });
  }

  navigateToAdd() {
    this.props.history.push("add");
  }

  editMainReseller(_id) {
    this.props.history.push("edit", { "_id": _id });
  }

  deleteMainReseller() {
    axios.post(config.api.url + '/admin/mainreseller/delete/' + this.state.selectedId)
      .then((res) => {
        if (res.status === 200) {
          this.toggleConfirmAlertModal();
          this.getMainResellers();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ mainResellers: [] });
      });
  }

  changeCredit = (id, credit, plus) => {
    this.setState(prevState => ({
      modalCredit: !prevState.modalCredit,
      selectedUserId: id,
      selectedUserCredit: credit,
      plus: plus
    }));
  };

  toggleConfirmAlertModal = (id) => {
    this.setState(prevState => ({
      modalConfirmAlert: !prevState.modalConfirmAlert,
      selectedId: id
    }));
  };

  toggleCredit = () => {
    this.setState(prevState => ({
      modalCredit: !prevState.modalCredit
    }));
  }

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.main-resellers" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="table.main-resellers" />
                </CardTitle>
                <Button onClick={this.navigateToAdd} color="primary" className="mb-2">
                  <div className="simple-icon-user-follow">  <IntlMessages id="table.addnew" /></div>
                </Button>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th>{<IntlMessages id="table.avatar" />}</th>
                      <th>{<IntlMessages id="table.username" />}</th>
                      <th>{<IntlMessages id="table.email" />}</th>
                      <th></th>
                      <th>{<IntlMessages id="table.credits" />}</th>
                      <th></th>
                      <th>{<IntlMessages id="table.note" />}</th>
                      <th>{<IntlMessages id="table.action" />}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.mainResellers.map((mainReseller, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {mainReseller.avatar ?
                            <img style={{ width: "30px", height: "30px" }} src={"/assets/img/avatar/" + mainReseller.avatar.filename} alt="avatar"></img> :
                            <img style={{ width: "30px", height: "30px" }} src="/assets/img/avatar/unknown.png" alt="avatar"></img>
                          }
                        </td>
                        <td>{mainReseller.username}</td>
                        <td>{mainReseller.email}</td>
                        <td style={{ width: "15px" }}>
                          <Button onClick={() => this.changeCredit(mainReseller._id, mainReseller.credit, false)} color="success" size="xs" className="mb-2">
                            <i className="simple-icon-minus"></i>
                          </Button>{"    "}
                        </td>
                        <td style={{ width: "50px", textAlign: "center" }}>
                          {mainReseller.credit}
                        </td>
                        <td>
                          <Button onClick={() => this.changeCredit(mainReseller._id, mainReseller.credit, true)} color="success" size="xs" className="mb-2">
                            <i className="simple-icon-plus"></i>
                          </Button>{"    "}
                        </td>
                        <td>{mainReseller.note}</td>
                        <td>
                          <Button onClick={() => this.editMainReseller(mainReseller._id)} color="primary" size="xs" className="mb-2">
                            <div className="iconsminds-file-edit"> <IntlMessages id="menu.edit" /> </div>
                          </Button>{"    "}
                          <Button onClick={() => this.toggleConfirmAlertModal(mainReseller._id)} color="danger" size="xs" className="mb-2">
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
          isOpen={this.state.modalCredit}
          size="lg"
          toggle={this.toggleCredit}
        >
          <ModalHeader toggle={this.toggleCredit}>
            Credit
                    </ModalHeader>
          <ModalBody style={{ textAlign: "center" }}>
            <CreditForm userid={this.state.selectedUserId} credit={this.state.selectedUserCredit} plus={this.state.plus} />
          </ModalBody>
        </Modal>
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
            <Button onClick={() => this.deleteMainReseller()} color="danger" className="mb-2">
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
