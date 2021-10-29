import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from 'axios';
import config from '../../../config.json';

export default class Codes extends Component {

    constructor(props) {
        super();
        this.state = {
            codes: [],
            modalConfirmAlert: false
        };
        this.getCodes();
        this.navigateToAdd = this.navigateToAdd.bind(this);
    }

    getCodes() {
        axios.get(config.api.url + '/admin/code/list/')
            .then((res) => {
                if (res.status === 200) {
                    var tempCodes = res.data;
                    var codes = [];
                    for (let i = 0; i < tempCodes.length; i++) {
                        axios.get(config.api.url + '/admin/product/list/' + tempCodes[i].product_id)
                            .then((res) => {
                                if (res.status === 200) {
                                    codes[i] = tempCodes[i];
                                    codes[i].product_name = res.data[0].product_name;
                                    codes[i].credit_price = res.data[0].credit_price;
                                    if ((i + 1) === tempCodes.length) {
                                        this.setState({ codes: codes });
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
                this.setState({ codes: [] });
            });
    }

    uploadCodes() {
        this.props.history.push("add");
    }

    editCode(_id) {
        this.props.history.push("edit", { "_id": _id });
    }

    deleteCode() {
        axios.post(config.api.url + '/admin/code/delete/' + this.state.selectedId)
            .then((res) => {
                if (res.status === 200) {
                    this.toggleConfirmAlertModal();
                    this.getCodes();
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ codes: [] });
            });
    }

    navigateToAdd() {
        this.props.history.push("addone");
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
                        <Breadcrumb heading="menu.codes" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row className="mb-5">
                    <Colxx xxs="12">
                        <Card className="mb-4">
                            <CardBody>
                                <CardTitle>
                                    <IntlMessages id="table.codes" />
                                </CardTitle>
                                <Button onClick={() => this.uploadCodes()} outline color="success" className="mb-2">
                                    <div className="simple-icon-cloud-upload">  <IntlMessages id="code.uploadcodes" /></div>
                                </Button>{"  "}
                                <Button onClick={this.navigateToAdd} outline color="primary" className="mb-2">
                                    <div className="iconsminds-coding">  <IntlMessages id="table.addnew" /></div>
                                </Button>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th><IntlMessages id="table.code" /></th>
                                            <th><IntlMessages id="table.product" /></th>
                                            <th><IntlMessages id="table.creditprice" /></th>
                                            <th><IntlMessages id="table.status" /></th>
                                            <th><IntlMessages id="table.action" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.codes.map((code, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                {code.is_active ?
                                                    <td>{code.code}</td> : <td style={{ textDecoration: "line-through" }}>{code.code}</td>
                                                }
                                                <td>{code.product_name}</td>
                                                <td>{code.credit_price}</td>
                                                {code.is_active ?
                                                    <td><IntlMessages id="code.active" /></td> : <td style={{ color: "#ff0000" }}><IntlMessages id="code.sold" /></td>}
                                                {code.is_active ?
                                                    <td>
                                                        <Button onClick={() => this.editCode(code._id)} color="primary" size="xs" className="mb-2">
                                                            <div className="iconsminds-file-edit"> <IntlMessages id="menu.edit" /> </div>
                                                        </Button>{"    "}
                                                        <Button onClick={() => this.toggleConfirmAlertModal(code._id)} color="danger" size="xs" className="mb-2">
                                                            <div className="iconsminds-file-edit"> <IntlMessages id="menu.delete" /> </div>
                                                        </Button>
                                                    </td> :
                                                    <td>
                                                        <Button onClick={() => this.toggleConfirmAlertModal(code._id)} color="danger" size="xs" className="mb-2">
                                                            <div className="iconsminds-file-edit"> <IntlMessages id="menu.delete" /> </div>
                                                        </Button>
                                                    </td>}
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
                        <Button onClick={() => this.deleteCode()} color="danger" className="mb-2">
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
