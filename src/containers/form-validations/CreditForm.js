import React, { Component } from "react";
import {
    AvForm,
    AvGroup,
    AvInput,
    AvFeedback
} from "availity-reactstrap-validation";
import { Row, Button, Label, Card, CardBody, Modal, ModalHeader, ModalBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import axios from 'axios';
import config from '../../config.json';
import IntlMessages from "../../helpers/IntlMessages";

class CreditForm extends Component {
    constructor(props) {
        super();
        this.handleSubmit = this.handleSubmit.bind(this);
        this.state = {
            modalAlert: false
        }
    }

    handleSubmit(event, errors, values) {
        // let refreshReseller = this.props.refreshReseller;
        // let toggle = this.props.toggle;
        if (errors.length === 0) {
            let req = {}
            let userid = this.props.userid;
            switch (this.props.plus) {
                case true:
                    req.credit = parseInt(this.props.credit) + parseInt(values.credit);
                    req.changedCredit = parseInt(values.credit);
                    break;
                case false:
                    req.credit = parseInt(this.props.credit) - parseInt(values.credit);
                    req.changedCredit = 0 - parseInt(values.credit);
                    break;
                default:
                    break;
            }
            if (req.credit < 0) {
                this.toggleAlertModal();
            } else {
                switch (localStorage.getItem("role")) {
                    case 'admin':
                        axios.post(config.api.url + '/admin/changecredit/' + userid, req)
                            .then((res) => {
                                if (res.status === 200) {
                                    window.location.reload();
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });
                        break;
                    case 'mainreseller':
                        axios.get(config.api.url + '/user/getcredit/' + localStorage.getItem("user_id"))
                            .then((user) => {
                                if (user.status === 200) {
                                    let mainresellerCredit = parseInt(user.data.credit);
                                    if ((mainresellerCredit - req.changedCredit) < 0) {
                                        this.toggleAlertModal();
                                    } else {
                                        axios.post(config.api.url + '/mainreseller/changecredit/' + userid, req)
                                            .then((res) => {
                                                if (res.status === 200) {
                                                    // toggle();
                                                    // refreshReseller();
                                                    window.location.reload();
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
                            })
                        break;
                    default:
                        break;
                }

            }

        }
    }

    toggleAlertModal = () => {
        this.setState(prevState => ({
            modalAlert: !prevState.modalAlert
        }));
    };

    render() {
        return (
            <Card className="mb-5">
                <CardBody>
                    <Row>
                        <Colxx xs="12" md="12" className="mb-3" style={{ textAlign: "center" }}>
                            <h6 className="mb-4">
                                {this.props.plus ?
                                    <IntlMessages id="form.addcredit" /> : <IntlMessages id="form.removecredit" />
                                }
                            </h6>
                            <AvForm
                                className="av-tooltip tooltip-label-right"
                                onSubmit={this.handleSubmit}>
                                <AvGroup>
                                    <Label><IntlMessages id="form.credit" /></Label>
                                    <AvInput name="credit" type="number" required />
                                    <AvFeedback><IntlMessages id="form.creditreq" /></AvFeedback>
                                </AvGroup>
                                <Button color="primary"><IntlMessages id="form.submit" /></Button>
                            </AvForm>
                        </Colxx>
                    </Row>
                </CardBody>

                <Modal
                    isOpen={this.state.modalAlert}
                    size="lg"
                    toggle={this.toggleAlertModal}
                >
                    <ModalHeader>
                        Alert:
    </ModalHeader>
                    <ModalBody style={{ textAlign: "center" }}>
                        <p>Exceed credit of this main reseller!</p>
                        <Button onClick={() => this.toggleAlertModal()} color="primary" className="mb-2">
                            Ok
          </Button>
                    </ModalBody>
                </Modal>
            </Card>
        );
    }
}

export default CreditForm;
