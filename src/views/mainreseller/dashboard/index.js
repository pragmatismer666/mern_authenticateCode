import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import IconCard from "../../../components/cards/IconCard";
import axios from 'axios';
import config from '../../../config.json';
import '../../../assets/css/animation.scss';
import Moment from 'moment';

export default class Dashboard extends Component {

  constructor(props) {
    super();
    this.state = {
      credits: "",
      resellers: "",
      purchasedcodes: "",
      productpics: [],
      news: []
    };

    axios.get(config.api.url + '/mainreseller/info/' + localStorage.getItem("user_id"))
      .then((res) => {
        if (res.status === 200) {
          this.setState({ 
            credits: res.data.credits,
            resellers: res.data.resellers,
            purchasedcodes: res.data.purchasedcodes,            
            productpics: res.data.productpic
           });
          axios.get(config.api.url + '/mainreseller/getnews/')
            .then((res) => {
              if (res.status === 200) {
                this.setState({ news: res.data });
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

  render() {
    return (
      <Fragment>
        <Row>
          <Colxx xxs="12">
            <Breadcrumb heading="menu.dashboard" match={this.props.match} />
            <Separator className="mb-5" />
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="12" className="mb-4">
            <p><IntlMessages id="menu.dashboard" /></p>
          </Colxx>
          <Colxx lg="12" xl="2">
            <div>
              <IconCard icon="iconsminds-diamond" title={<IntlMessages id="dashboard.credits" />} value={this.state.credits} className="mb-4" />
            </div>
          </Colxx>
          <Colxx lg="12" xl="2">
            <div>
              <IconCard icon="simple-icon-people" title={<IntlMessages id="dashboard.resellers" />} value={this.state.resellers} className="mb-4" />
            </div>
          </Colxx>
          <Colxx lg="12" xl="2">
            <div>
              <IconCard icon="iconsminds-shopping-cart" title={<IntlMessages id="dashboard.purchasedcode" />} value={this.state.purchasedcodes} className="mb-4" />
            </div>
          </Colxx>
        </Row>
        <Row className="mb-2">
          <Colxx xxs="10">
            <Card className="mb-4 animtablenews">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="table.news" />
                </CardTitle>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th><IntlMessages id="dashboard.time" /></th>
                      <th><IntlMessages id="table.content" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.news.map((advertise, index) => (
                      <tr key={index}>
                        <th style={{width: "20px"}} scope="row">{index + 1}</th>
                        <td style={{width: "200px"}}>{Moment(advertise.updatedAt).format('MM-DD-YYYY  HH:mm:ss')}</td>
                        <td style={{fontSize: "18px"}}>{advertise.content}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
        <Row>
          <Colxx xxs="10">
            <Card className="mb-4 animtablepic">
              <CardBody>
                <CardTitle>
                  Product Pic
                </CardTitle>
                <Row>
                  {this.state.productpics.map((productpic, index) => (
                    <Colxx key={index} lg="3">
                      <img key={index} className="mb-4" style={{ width: "100%", height: "240px" }} alt="Product Pic" src={"/assets/img/products/" + productpic.meta_data.filename} />
                    </Colxx>
                  ))
                  }
                </Row>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
      </Fragment>
    )
  }
}
