import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import axios from 'axios';
import config from '../../../config.json';
import Moment from 'moment';

export default class PurchasedCode extends Component {

    constructor(props) {
        super();
        this.state = {
            codes: []
        };
        this.getCodes();
    }

    getCodes() {
        axios.get(config.api.url + '/mainreseller/purchasedcode/' + localStorage.getItem("user_id"))
            .then((res) => {
                if (res.status === 200) {
                    var tempPurchasedCodes = res.data;
                    for (let i = 0; i < tempPurchasedCodes.length; i++) {
                        for (let j = 0; j < parseInt(tempPurchasedCodes[i].amount); j++) {
                            axios.get(config.api.url + '/mainreseller/getcode/' + tempPurchasedCodes[i].code_ids[j])
                                .then((res) => {
                                    if (res.status === 200) {
                                        var code = {};
                                        code = res.data;
                                        this.setState(prevState => ({
                                            codes: [...prevState.codes, code]
                                        }));
                                    }
                                })
                                .catch((err) => {
                                    console.log(err);
                                });
                        }
                    }
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ codes: [] });
            });
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
                                            <th><IntlMessages id="table.purchasedtime" /></th>
                                            <th><IntlMessages id="table.product" /></th>
                                            <th><IntlMessages id="table.code" /></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {this.state.codes.map((code, index) => (
                                            <tr key={index}>
                                                <th scope="row">{index + 1}</th>
                                                <td><img style={{ width: "30px", height: "30px" }} src={"/assets/img/products/" + code.filename} alt="Product"></img></td>
                                                <td>{Moment(code.updatedAt).format('MM-DD-YYYY  HH:mm:ss')}</td>
                                                <td>{code.product_name}</td>
                                                <td>{code.code}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </Table>
                            </CardBody>
                        </Card>
                    </Colxx>
                </Row>
            </Fragment >
        );
    }
}
