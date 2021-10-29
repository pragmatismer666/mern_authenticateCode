import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from 'axios';
import config from '../../../config.json';
import CreditForm from "../../../containers/form-validations/CreditForm";

export default class Resellers extends Component {

  constructor(props) {
    super();
    this.state = {
      resellers: [],
      modalCredit: false,
      modalConfirmAlert: false
    };
    this.getResellers();
    this.getResellers = this.getResellers.bind(this);
    this.navigateToAdd = this.navigateToAdd.bind(this);
    this.toggleCredit = this.toggleCredit.bind(this);
  }

  getResellers() {
    const user_id = localStorage.getItem("user_id");
    axios.get(config.api.url + '/mainreseller/reseller/list/' + user_id)
      .then((res) => {
        if (res.status === 200) {
          this.setState({ resellers: res.data });
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ resellers: [] });
      });
  }

  navigateToAdd() {
    this.props.history.push("add");
  }

  editReseller(_id) {
    this.props.history.push("edit", { "_id": _id });
  }

  deleteReseller() {
    axios.post(config.api.url + '/mainreseller/reseller/delete/' + this.state.selectedId)
      .then((res) => {
        if (res.status === 200) {
          this.toggleConfirmAlertModal();
          this.getResellers();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ resellers: [] });
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
            <Breadcrumb heading="menu.resellers" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row className="mb-5">
          <Colxx xxs="12">
            <Card className="mb-4">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="table.resellers" />
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
                    {this.state.resellers.map((reseller, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>
                          {reseller.avatar ?
                            <img style={{ width: "30px", height: "30px" }} src={"/assets/img/avatar/" + reseller.avatar.filename} alt="avatar"></img> :
                            <img style={{ width: "30px", height: "30px" }} src="/assets/img/avatar/unknown.png" alt="avatar"></img>
                          }
                        </td>
                        <td>{reseller.username}</td>
                        <td>{reseller.email}</td>
                        <td style={{ width: "15px" }}>
                          <Button onClick={() => this.changeCredit(reseller._id, reseller.credit, false)} color="success" size="xs" className="mb-2">
                            <i className="simple-icon-minus"></i>
                          </Button>{"    "}
                        </td>
                        <td style={{ width: "50px", textAlign: "center" }}>
                          {reseller.credit}
                        </td>
                        <td>
                          <Button onClick={() => this.changeCredit(reseller._id, reseller.credit, true)} color="success" size="xs" className="mb-2">
                            <i className="simple-icon-plus"></i>
                          </Button>{"    "}
                        </td>
                        <td>{reseller.note}</td>
                        <td>
                          <Button onClick={() => this.editReseller(reseller._id)} color="primary" size="xs" className="mb-2">
                            <div className="iconsminds-file-edit"> <IntlMessages id="menu.edit" /> </div>
                          </Button>{"    "}
                          <Button onClick={() => this.toggleConfirmAlertModal(reseller._id)} color="danger" size="xs" className="mb-2">
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
            <CreditForm userid={this.state.selectedUserId} credit={this.state.selectedUserCredit} plus={this.state.plus} refreshReseller={this.getResellers} toggle={this.toggleCredit}/>
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
            <Button onClick={() => this.deleteReseller()} color="danger" className="mb-2">
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
