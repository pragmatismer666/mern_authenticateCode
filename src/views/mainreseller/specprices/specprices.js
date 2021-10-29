import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from 'axios';
import config from '../../../config.json';

export default class Specprices extends Component {

    constructor(props) {
        super();
        this.state = {
            specprices: [],
            modalConfirmAlert: false
        };
        this.getSpecPrices();
        this.navigateToAdd = this.navigateToAdd.bind(this);
    }

    getSpecPrices() {
        let mainreseller_id = localStorage.getItem("user_id");
        axios.get(config.api.url + '/mainreseller/specprice/m/list/' + mainreseller_id)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ specprices: res.data });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ specprices: [] });
            });
    }

    navigateToAdd() {
        this.props.history.push("add");
    }

    editMainReseller(_id) {
        this.props.history.push("edit", { "_id": _id });
    }

    deleteSpecprice() {
        axios.post(config.api.url + '/mainreseller/specprice/delete/' + this.state.selectedId)
            .then((res) => {
                if (res.status === 200) {
                    this.toggleConfirmAlertModal();
                    this.getSpecPrices();
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ specprices: [] });
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
                        <Breadcrumb heading="menu.specprices" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row className="mb-5">
                    <Colxx xxs="12">
                        <Card className="mb-4">
                            <CardBody>
                                <CardTitle>
                                    <IntlMessages id="menu.specprices" />
                                </CardTitle>
                                <Button onClick={this.navigateToAdd} color="primary" className="mb-2">
                                    <div className="simple-icon-present">  <IntlMessages id="table.addnew" /></div>
                                </Button>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>{<IntlMessages id="table.username" />}</th>
                                            <th>{<IntlMessages id="table.product" />}</th>
                                            <th>{<IntlMessages id="table.creditprice" />}</th>
                                            <th>{<IntlMessages id="table.action" />}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.specprices.map((specprice, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{specprice.username}</td>
                                                <td>{specprice.product_name}</td>
                                                <td>{specprice.price}</td>
                                                <td>
                                                    <Button onClick={() => this.editMainReseller(specprice._id)} color="primary" size="xs" className="mb-2">
                                                        <div className="iconsminds-file-edit"> <IntlMessages id="menu.edit" /> </div>
                                                    </Button>{"    "}
                                                    <Button onClick={() => this.toggleConfirmAlertModal(specprice._id)} color="danger" size="xs" className="mb-2">
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
                        <Button onClick={() => this.deleteSpecprice()} color="danger" className="mb-2">
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
