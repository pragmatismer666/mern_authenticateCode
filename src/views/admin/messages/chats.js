import React, { Component, Fragment } from "react";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Row } from "reactstrap";
import { Colxx } from "../../../components/common/CustomBootstrap";
import MessageCard from "../../../components/applications/MessageCard";
import SaySomething from "../../../components/applications/SaySomething";
import axios from 'axios';
import config from '../../../config.json';
import 'whatwg-fetch';
import openSocket from 'socket.io-client';

const socket = openSocket(config.api.url);

export default class Chats extends Component {
    constructor(props) {
        super();
        this.state = {
            messages: [],
            ticket_id: props.location.state.ticket_id,
            is_opener: props.location.state.is_opener
        };
        this.getMessages = this.getMessages.bind(this);
        socket.on("message", data => {
            if (((localStorage.getItem("user_id") === data.receiver_id) && !data.is_receiver_read) || ((localStorage.getItem("user_id") === data.opener_id) && !data.is_opener_read)) {
                this.getMessages(this.state.ticket_id);
            }
        });
        this.getMessages(this.state.ticket_id);
        this.setRead(this.state.ticket_id, this.state.is_opener);

    }

    getMessages(ticket_id) {
        axios.get(config.api.url + '/admin/message/list/' + ticket_id)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ messages: res.data });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ messages: [] });
            });
    }

    setRead(id, is_opener) {
        let req = {};
        req.is_opener = is_opener;
        axios.post(config.api.url + '/admin/ticket/setread/' + id, req)
            .then((res) => {
                if (res.status === 200) {
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ messages: [] });
            });

    }

    handleChatInputChange = e => {
        this.setState({
            messageInput: e.target.value
        });
    };

    handleChatInputPress = e => {
        if (e.key === "Enter") {
            if (this.state.messageInput.length > 0) {
                let message = {};
                message.user_id = localStorage.getItem("user_id");
                message.ticket_id = this.state.ticket_id;
                message.message = this.state.messageInput;
                message.is_opener = this.state.is_opener;
                axios.post(config.api.url + '/mainreseller/message/add/', message)
                    .then((res) => {
                        if (res.status === 200) {
                            this.setState({messageInput: ""});
                            this.getMessages(this.state.ticket_id);
                        }
                    })
                    .catch((err) => {
                        console.log(err);
                        this.setState({ messages: [] });
                    });
            }
        }
    };

    handleSendButtonClick = () => {
        if (this.state.messageInput.length > 0) {
            let message = {};
            message.user_id = localStorage.getItem("user_id");
            message.ticket_id = this.state.ticket_id;
            message.message = this.state.messageInput;
            message.is_opener = this.state.is_opener;
            axios.post(config.api.url + '/mainreseller/message/add/', message)
                .then((res) => {
                    if (res.status === 200) {
                        this.setState({messageInput: ""});
                        this.getMessages(this.state.ticket_id);
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ messages: [] });
                });
        }
    };

    render() {

        return (
            <Fragment>
                <Row className="app-row">
                    <Colxx xxs="12" className="chat-app">
                        <PerfectScrollbar
                            ref={ref => {
                                this._scrollBarRef = ref;
                            }}
                            containerRef={ref => { }}
                            options={{ suppressScrollX: true, wheelPropagation: false }}>
                            {this.state.messages.map((message, index) => (
                                <MessageCard
                                    key={index}
                                    message={message}
                                />
                            ))}
                        </PerfectScrollbar>
                    </Colxx>
                </Row>
                <SaySomething
                    text={this.state.messageInput}
                    placeholder="Send message"
                    handleChatInputPress={this.handleChatInputPress}
                    handleChatInputChange={this.handleChatInputChange}
                    handleSendButtonClick={this.handleSendButtonClick}
                />
            </Fragment>
        );
    }
}
