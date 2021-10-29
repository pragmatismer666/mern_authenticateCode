import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from 'axios';
import config from '../../../config.json';
import copy from "copy-to-clipboard";
import { PDFDownloadLink } from "@react-pdf/renderer";
import { PdfDocument } from "../../../components/PdfDocument";
import {
    AvForm,
    AvInput,
    AvGroup
} from "availity-reactstrap-validation";

export default class BuyCode extends Component {

    constructor(props) {
        super();
        this.state = {
            products: [],
            user_credit: 1,
            modalLarge: false,
            purchasedCodes: [],
            show: false,
            modalConfirmAlert: false
        };
        this.getProducts();
        this.getCredit();
        this.downloadPdf = this.downloadPdf.bind(this);
    }

    getProducts() {
        let reseller_id = localStorage.getItem("user_id");
        axios.get(config.api.url + '/reseller/product/m/list/' + reseller_id)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ products: res.data });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    getCredit() {
        var user_id = localStorage.getItem("user_id");
        axios.get(config.api.url + '/reseller/getcredit/' + user_id)
            .then((res) => {
                if (res.status === 200) {
                    var user_credit = parseFloat(res.data);
                    this.setState({ user_credit: user_credit });
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    buyCode(id, credit_price) {
        if (document.getElementById(id).value) {
            axios.get(config.api.url + '/reseller/countcode/' + id)
                .then((res) => {
                    if (parseInt(res.data) >= parseInt(document.getElementById(id).value)) {
                        var values = {};
                        values.user_id = localStorage.getItem("user_id");
                        values.product_id = id;
                        values.amount = parseInt(document.getElementById(id).value);
                        if (values.amount > 0) {
                            values.credits = this.state.user_credit - parseFloat(credit_price) * values.amount;
                            if (values.credits >= 0) {
                                this.setState({
                                    values: values
                                });
                                this.toggleConfirmAlertModal((parseFloat(credit_price) * values.amount).toString() + " credits and you have " + this.state.user_credit + " credit and after purchase will stay in your account " + values.credits + " credits, confirm?");

                                // if (window.confirm((parseFloat(credit_price) * values.amount).toString() + " credits and you have " + this.state.user_credit + " credit and after purchase will stay in your account " + values.credits + " credits, confirm?")) {
                                //     axios.post(config.api.url + '/reseller/purchase/', values)
                                //         .then((res) => {
                                //             if (res.status === 200) {
                                //                 this.setState({ purchasedCodes: res.data });
                                //                 this.toggleLarge();
                                //             }
                                //         })
                                //         .catch((err) => {
                                //             console.log(err);
                                //         });
                                // }
                            } else {
                                this.toggleAlertModal("Not enough credits...");
                            }
                        } else {
                            this.toggleAlertModal("Should be positive amount...");
                        }
                    } else {
                        this.toggleAlertModal("Exceed number of available codes...");
                    }
                })
                .catch((err) => {
                    console.log(err);
                })
        } else {
            this.toggleAlertModal("Please input number!")
        }
    }

    purchase() {
        axios.post(config.api.url + '/reseller/purchase/', this.state.values)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ purchasedCodes: res.data });
                    this.toggleLarge();
                    this.refreshPage();
                }
            })
            .catch((err) => {
                this.toggleConfirmAlertModal();
                console.log(err);
            });
    }

    toggleLarge = () => {
        this.setState(prevState => ({
            modalLarge: !prevState.modalLarge
        }));
    };

    toggleAlertModal = (txt) => {
        this.setState(prevState => ({
            modalAlert: !prevState.modalAlert,
            alertText: txt
        }));
    };

    toggleConfirmAlertModal = (txt) => {
        this.setState(prevState => ({
            modalConfirmAlert: !prevState.modalConfirmAlert,
            alertText: txt
        }));
    };

    copyToClipboard(code) {
        copy(code);
    };

    downloadPdf() {
        document.getElementById("download-btn").style.display = "none";
        this.setState(prevState => ({
            show: !prevState.show
        }));
    }

    refreshPage() {
        window.location.reload();
    }

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
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th><IntlMessages id="table.picture" /></th>
                                            <th><IntlMessages id="table.productname" /></th>
                                            <th><IntlMessages id="table.creditprice" /></th>
                                            <th><IntlMessages id="table.amount" /></th>
                                            <th><IntlMessages id="table.action" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.products.map((product, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td><img style={{ width: "30px", height: "30px" }} src={"/assets/img/products/" + product.meta_data.filename} alt="Product"></img></td>
                                                <td>{product.product_name}</td>
                                                <td>{product.credit_price} </td>
                                                <td>
                                                    <AvForm
                                                        className="av-tooltip tooltip-label-right"
                                                    >
                                                        <AvGroup>
                                                            <AvInput id={product._id} type="number" name="number" value="1" style={{ width: "100px", height: "30px" }} />
                                                        </AvGroup>
                                                    </AvForm>
                                                    {/* <input name="number" type="number"></input>{"        "} */}
                                                </td>
                                                <td>
                                                    <Button onClick={() => this.buyCode(product._id, product.credit_price)} color="success" size="xs">
                                                        <div className="iconsminds-dollar">    <IntlMessages id="button.buy" /></div>
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
                    isOpen={this.state.modalLarge}
                    size="lg"
                    toggle={this.toggleLarge}
                >
                    <ModalHeader toggle={this.toggleLarge}>
                        Purchased Codes:
                    </ModalHeader>
                    <ModalBody style={{ textAlign: "center" }}>
                        <ul style={{ width: "70%", textAlign: "center", margin: "auto" }}>
                            {this.state.purchasedCodes.map((code, index) => (
                                <li className="list-unstyled mb-4" key={index}>{code} &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;<Button onClick={() => this.copyToClipboard(code)} color="success" size="xs"><i className="iconsminds-file-copy"></i>Copy</Button></li>
                            ))}
                        </ul>
                        <Button id="download-btn" onClick={() => this.downloadPdf()} color="primary">Get Codes</Button>{"   "}
                        {this.state.show && <PDFDownloadLink
                            document={<PdfDocument data={this.state.purchasedCodes} />}
                            fileName="codelist.pdf"
                            style={{
                                textDecoration: "none",
                                padding: "10px",
                                backgroundColor: "#86367e",
                                border: "1px solid #4a4a4a",
                                borderRadius: "50px"
                            }}
                        >
                            <i onClick={() => this.refreshPage()} className="simple-icon-cloud-download">  <IntlMessages id="button.downloadpdf" /></i>
                        </PDFDownloadLink>}
                    </ModalBody>
                </Modal>

                <Modal
                    isOpen={this.state.modalAlert}
                    size="lg"
                    toggle={this.toggleAlertModal}
                >
                    <ModalHeader>
                        Alert:
</ModalHeader>
                    <ModalBody style={{ textAlign: "center" }}>
                        <p>{this.state.alertText}</p>
                        <Button onClick={() => this.toggleAlertModal()} color="primary" className="mb-2">
                            Ok
</Button>
                    </ModalBody>
                </Modal>



                <Modal
                    isOpen={this.state.modalConfirmAlert}
                    size="lg"
                    toggle={this.toggleConfirmAlertModal}
                >
                    <ModalHeader >
                        Alert:
</ModalHeader>
                    <ModalBody style={{ textAlign: "center" }}>
                        <p>{this.state.alertText}</p>
                        <Button onClick={() => this.purchase()} color="danger" className="mb-2">
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
