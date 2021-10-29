import React, { Component } from "react";
import {
    AvForm,
    AvField,
    AvGroup,
    AvInput,
    AvFeedback
} from "availity-reactstrap-validation";
import { Row, Button, Label, Card, CardBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import axios from 'axios';
import config from '../../config.json';
import IntlMessages from "../../helpers/IntlMessages";

class OpenTicketAdminForm extends Component {
    constructor(props) {
        super();
        this.state = {
            receivers: []
        };
        this.getReceivers();
        
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getReceivers() {
        axios.get(config.api.url + '/admin/mainreseller/list')
        .then((res) => {
            if (res.status === 200) {
                this.setState({ receivers: res.data });
              }
        })
        .catch((err) => {
            console.log(err);
            this.setState({ receivers: [] });
        })
    }

    handleSubmit(event, errors, values) {
        let refreshTickets = this.props.refreshTickets;
        if (errors.length === 0) {
            this.props.hideModal();
            let ticket = {};
            ticket.title = values.title;
            ticket.opener_id = localStorage.getItem("user_id");
            ticket.receiver_id = values.receiver_id;
            ticket.is_opener_read = true;
            ticket.is_receiver_read = false;

            let message = {};
            message.message = values.message;
            message.user_id = localStorage.getItem("user_id");
            axios.post(config.api.url + '/admin/ticket/add', ticket)
                .then((res) => {
                    if (res.status === 200) {
                        message.ticket_id = res.data._id;
                        axios.post(config.api.url + '/admin/message/addone', message)
                            .then((res) => {
                                if (res.status === 200) {
                                    refreshTickets();
                                }
                            })
                            .catch((err) => {
                                console.log(err);
                            });

                    }
                })
                .catch((err) => {
                    console.log(err);
                });

        }
    }

    render() {
        return (
            <Card className="mb-5">
                <CardBody>
                    <Row>
                        <Colxx xs="12" md="12" className="mb-3" style={{ textAlign: "center" }}>
                            <h6 className="mb-4"><IntlMessages id="form.openticket" /></h6>
                            <AvForm
                                className="av-tooltip tooltip-label-right"
                                onSubmit={this.handleSubmit}>
                                <AvField
                                    type="select"
                                    name="receiver_id"
                                    required
                                    label="Username"
                                    errorMessage="Please select an option!">
                                    <option value="0" />
                                    {this.state.receivers.map((receiver, index) => (
                                        <option key={index} value={receiver._id}>{receiver.username}</option>
                                    ))}
                                </AvField>
                                <AvGroup>
                                    <Label><IntlMessages id="form.title" /></Label>
                                    <AvInput name="title" required />
                                    <AvFeedback><IntlMessages id="form.titlereq" /></AvFeedback>
                                </AvGroup>
                                <AvGroup>
                                    <Label><IntlMessages id="form.message" /></Label>
                                    <AvInput type="textarea" name="message" id="message" required />
                                </AvGroup>
                                <Button color="primary"><IntlMessages id="form.submit" /></Button>
                            </AvForm>
                        </Colxx>
                    </Row>
                </CardBody>
            </Card>
        );
    }
}

export default OpenTicketAdminForm;
