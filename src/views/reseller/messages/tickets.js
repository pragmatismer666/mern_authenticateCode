import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody, Badge } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import OpenTicketResellerForm from "../../../containers/form-validations/OpenTicketResellerForm";
import axios from 'axios';
import config from '../../../config.json';

import 'whatwg-fetch';
import openSocket from 'socket.io-client';
import Moment from 'moment';

const socket = openSocket(config.api.url);

export default class Tickets extends Component {

    constructor(props) {
        super();
        this.state = {
            tickets: [],
            modalOpen: false,
            modalConfirmAlert: false
        };
        this.hideModal = this.hideModal.bind(this);
        this.getTickets = this.getTickets.bind(this);
        socket.on("message", data => {
            if(((localStorage.getItem("user_id") === data.receiver_id) && !data.is_receiver_read) || ((localStorage.getItem("user_id") === data.opener_id) && !data.is_opener_read)) {
                this.getTickets();
            }
        });
        this.getTickets();
    }

    hideModal() {
        this.setState({modalOpen: false});
    }

    getTickets() {
        let user_id = localStorage.getItem("user_id");
        let _this = this;
        axios.get(config.api.url + '/reseller/ticket/u/list/' + user_id)
            .then((res) => {
                if (res.status === 200) {
                    _this.setState({ tickets: res.data, modalOpen: false });
                }
            })
            .catch((err) => {
                console.log(err);
                _this.setState({ tickets: [], modalOpen: false });
            });
    }

    goToMessage(_id, is_opener) {
        this.props.history.push("chats", { "ticket_id": _id, "is_opener": is_opener });
    }

    toggleOpenTicket = () => {
        this.setState(prevState => ({
            modalOpen: !prevState.modalOpen
        }));
    };

    render() {
        return (
            <Fragment>
                <Row>
                    <Colxx xxs="12">
                        <Breadcrumb heading="menu.tickets" match={this.props.match} />
                        <Separator className="mb-5" />
                    </Colxx>
                </Row>
                <Row className="mb-5">
                    <Colxx xxs="12">
                        <Card className="mb-4">
                            <CardBody>
                                <CardTitle>
                                    <IntlMessages id="table.tickets" />
                                </CardTitle>
                                <Button onClick={this.toggleOpenTicket} color="primary" className="mb-2">
                                    <div className="simple-icon-bubbles">  <IntlMessages id="table.opennew" /></div>
                                </Button>
                                <Table>
                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>{<IntlMessages id="table.title" />}</th>
                                            <th>{<IntlMessages id="table.time" />}</th>
                                            <th>{<IntlMessages id="table.action" />}</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.tickets.map((ticket, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td>{ticket.username}</td>
                                                <td>{ticket.title}</td>
                                                <td>{Moment(ticket.createdAt).format('MM-DD-YYYY  HH:mm:ss')}</td>
                                                <td>
                                                    <Button style={{position: 'relative'}} onClick={() => this.goToMessage(ticket._id, ticket.is_opener)} color="success" size="xs" className="mb-2">
                                                         <IntlMessages id="button.view" />
                                                         <Badge style={{position: 'absolute', color: 'transparent', width: 9, height: 9, padding: 0, right: -4}} color="danger" pill>
                                                            {ticket.is_new ? 
                                                                "New" : ""
                                                            }
                                                        </Badge>
                                                    </Button>{"    "}
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
                    isOpen={this.state.modalOpen}
                    size="lg"
                    toggle={this.toggleOpenTicket}
                >
                    <ModalHeader toggle={this.toggleOpenTicket}>
                        <IntlMessages id="form.openticket" /> 
                    </ModalHeader>
                    <ModalBody style={{ textAlign: "center" }}>
                        <OpenTicketResellerForm  refreshTickets={this.getTickets} hideModal={this.hideModal}  />
                    </ModalBody>
                </Modal>
            </Fragment >
        );
    }
}
