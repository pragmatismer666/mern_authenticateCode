import React, { Component } from "react";
import {
    AvForm,
    AvField,
    AvGroup,
    AvInput,
    AvFeedback
} from "availity-reactstrap-validation";
import { Button, Label, Card, CardBody } from "reactstrap";
import { Colxx } from "../../components/common/CustomBootstrap";
import axios from 'axios';
import config from '../../config.json';
import IntlMessages from "../../helpers/IntlMessages";

class AddCodeOneForm extends Component {
    constructor(props) {
        super();
        this.state = {
            products: []
        };
        this.getProducts();
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

    handleSubmit(event, errors, values) {
        values.is_active = true;
        if (errors.length === 0) {
            axios.post(config.api.url + '/admin/code/addone', values)
                .then((res) => {
                    if (res.status === 200) {
                        try {
                            if(res.data.error !== 'Exist') {
                                this.props.history.push("list");
                            }
                        } catch (error) {
                            console.log(error);   
                        }
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
                    <Colxx xs="12" md="6" className="mb-3">
                        <h6 className="mb-4"><IntlMessages id="form.editcode" /></h6>
                        <AvForm
                            className="av-tooltip tooltip-label-right"
                            onSubmit={this.handleSubmit}>
                            <AvField
                                type="select"
                                name="product_id"
                                required
                                label="Product"
                                errorMessage="Please select an option!">
                                <option value="0" />
                                {this.state.products.map((product, index) => (
                                    <option key={index} value={product._id}>{product.product_name}</option>
                                ))}
                            </AvField>
                            <AvGroup>
                                <Label><IntlMessages id="form.code" /></Label>
                                <AvInput name="code" required />
                                <AvFeedback><IntlMessages id="form.reqcode" /></AvFeedback>
                            </AvGroup>
                            <Button color="primary"><IntlMessages id="form.submit" /></Button>
                        </AvForm>
                    </Colxx>
                </CardBody>
            </Card>
        );
    }
}

export default AddCodeOneForm;
