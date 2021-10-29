import React, { Component } from "react";
import {
    AvForm,
    AvGroup,
    AvField,
    AvInput,
    AvFeedback
} from "availity-reactstrap-validation";
import { Row, Button, Label, Card, CardBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import axios from 'axios';
import config from '../../config.json';
import IntlMessages from "../../helpers/IntlMessages";

class EditSpecpriceForm extends Component {
    constructor(props) {
        super();
        this.state = {
            specprice: {},
            products: [],
            mainresellers: []
        };
        this.getProducts();
        this.getMainresellers();
        this.getSpecprice(props.specpriceid);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    getProducts() {
        axios.get(config.api.url + '/admin/product/list/')
            .then((res) => {
                if (res.status === 200) {
                    this.setState({ products: res.data });
                }
            })
            .catch((err) => {
                console.log(err);
                this.setState({ products: [] });
            });
    }

    getMainresellers() {
        let role = localStorage.getItem("role");
        if (role === 'admin') {
            axios.get(config.api.url + '/admin/mainreseller/list/')
                .then((res) => {
                    if (res.status === 200) {
                        this.setState({ mainresellers: res.data });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ mainresellers: [] });
                });
        } else if (role === 'mainreseller') {
            let mainresellerid = localStorage.getItem("user_id");
            axios.get(config.api.url + '/mainreseller/reseller/list/' + mainresellerid)
                .then((res) => {
                    if (res.status === 200) {
                        this.setState({ mainresellers: res.data });
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ mainresellers: [] });
                });
        }
    }

    getSpecprice(_id) {
        let role = localStorage.getItem("role");
        if (role === 'admin') {
            axios.get(config.api.url + '/admin/specprice/list/' + _id)
                .then((res) => {
                    if (res.status === 200) {
                        this.setState({
                            specprice: res.data[0]
                        })
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ specprice: {} });
                });
        } else if (role === 'mainreseller') {            
            axios.get(config.api.url + '/mainreseller/specprice/list/' + _id)
                .then((res) => {
                    if (res.status === 200) {
                        this.setState({
                            specprice: res.data[0]
                        })
                    }
                })
                .catch((err) => {
                    console.log(err);
                    this.setState({ specprice: {} });
                });
        }
    }

    handleSubmit(event, errors, values) {
        if (errors.length === 0) {
            axios.post(config.api.url + '/mainreseller/specprice/edit/' + this.state.specprice._id, values)
                .then((res) => {
                    if (res.status === 200) {
                        this.props.history.push("list");
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
                        <Colxx xs="8" md="8" className="mb-3">
                            <h6 className="mb-4"><IntlMessages id="form.editspecprice" /></h6>
                            <AvForm
                                className="av-tooltip tooltip-label-right"
                                onSubmit={this.handleSubmit}>

                                <AvField
                                    type="select"
                                    name="product_id"
                                    required
                                    label="Product Name"
                                    value={this.state.specprice.product_id}
                                    errorMessage="Please select an option!">
                                    <option value="0" />
                                    {this.state.products.map((product, index) => (
                                        <option key={index} value={product._id}>{product.product_name}</option>
                                    ))}
                                </AvField>
                                <AvField
                                    type="select"
                                    name="user_id"
                                    required
                                    label="Username"
                                    value={this.state.specprice.user_id}
                                    errorMessage="Please select an option!">
                                    <option value="0" />
                                    {this.state.mainresellers.map((mainreseller, index) => (
                                        <option key={index} value={mainreseller._id}>{mainreseller.username}</option>
                                    ))}
                                </AvField>
                                <AvGroup>
                                    <Label><IntlMessages id="form.credit" /></Label>
                                    <AvInput name="price" value={this.state.specprice.price} required />
                                    <AvFeedback><IntlMessages id="form.reqcredit" /></AvFeedback>
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

export default EditSpecpriceForm;
