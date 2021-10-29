import React, { Component, Fragment } from "react";
import { Row, Card, CardBody, CardTitle, Table, Button, Modal, ModalHeader, ModalBody } from "reactstrap";
import IntlMessages from "../../../helpers/IntlMessages";
import { Colxx, Separator } from "../../../components/common/CustomBootstrap";
import Breadcrumb from "../../../containers/navs/Breadcrumb";
import IconCard from "../../../components/cards/IconCard";
import axios from 'axios';
import config from '../../../config.json';
import AddProductPicForm from "../../../containers/form-validations/AddProductPicForm";
import EditProductPicForm from "../../../containers/form-validations/EditProductPicForm";
import '../../../assets/css/animation.scss';
import Moment from 'moment';

export default class Dashboard extends Component {

  constructor(props) {
    super();
    this.state = {
      credits: "",
      mainresellers: "",
      categorys: "",
      products: "",
      codes: "",
      news: [],
      productpics: [],
      modalAdd: false,
      modalEdit: false,
      editId: "",
      modalConfirmAlert: false
    };

    this.getInfo();    
  }

  getInfo() {
    axios.get(config.api.url + '/admin/info/' + localStorage.getItem("user_id"))
    .then((res) => {
      if (res.status === 200) {
        this.setState({
          credits: res.data.credits,
          mainresellers: res.data.mainresellers,
          categorys: res.data.categorys,
          products: res.data.products,
          codes: res.data.codes,
          productpics: res.data.productpic
        });
        axios.get(config.api.url + '/admin/getallpurchase/')
          .then((purchase) => {
            if (purchase.status === 200) {
              let news = purchase.data;
              for (let i = 0; i < news.length; i++) {
                axios.get(config.api.url + '/admin/user/' + news[i].user_id)
                  .then((user) => {
                    news[i].username = user.data[0].username;
                    axios.get(config.api.url + '/admin/product/list/' + news[i].product_id)
                      .then((product) => {
                        news[i].product_name = product.data[0].product_name;
                        if (i + 1 === news.length) {
                          this.setState({ news: news });
                        }
                      })

                  })
                  .catch((err) => {
                    console.log(err);
                  })
              }
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

  toggleAddProductPic = () => {
    this.setState(prevState => ({
      modalAdd: !prevState.modalAdd
    }));
  };

  toggleEditProductPic = (_id) => {
    this.setState(prevState => ({
      modalEdit: !prevState.modalEdit,
      editId: _id
    }));
  };

  deleteProductPic() {
    axios.post(config.api.url + '/admin/productpic/delete/' + this.state.selectedId)
      .then((res) => {
        if (res.status === 200) {
          this.toggleConfirmAlertModal();
          this.getInfo();
        }
      })
      .catch((err) => {
        console.log(err);
        this.setState({ mainResellers: [] });
      });
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
              <IconCard icon="simple-icon-people" title={<IntlMessages id="dashboard.mainresellers" />} value={this.state.mainresellers} className="mb-4" />
            </div>
          </Colxx>
          <Colxx lg="12" xl="2">
            <div>
              <IconCard icon="simple-icon-list" title={<IntlMessages id="dashboard.categories" />} value={this.state.categorys} className="mb-4" />
            </div>
          </Colxx>
          <Colxx lg="12" xl="2">
            <div>
              <IconCard icon="simple-icon-basket-loaded" title={<IntlMessages id="dashboard.products" />} value={this.state.products} className="mb-4" />
            </div>
          </Colxx>
          <Colxx lg="12" xl="2">
            <div>
              <IconCard icon="iconsminds-coding" title={<IntlMessages id="dashboard.codes" />} value={this.state.codes} className="mb-4" />
            </div>
          </Colxx>
        </Row>
        <Row className="mb-2">
          <Colxx xxs="10">
            <Card className="mb-4 animtablenews">
              <CardBody>
                <CardTitle>
                  <IntlMessages id="table.purchasehistory" />
                </CardTitle>
                <Table>
                  <thead>
                    <tr>
                      <th>#</th>
                      <th><IntlMessages id="dashboard.time" /></th>
                      <th><IntlMessages id="dashboard.user" /></th>
                      <th><IntlMessages id="dashboard.purchasedproduct" /></th>
                      <th><IntlMessages id="dashboard.purchasedamount" /></th>
                    </tr>
                  </thead>
                  <tbody>
                    {this.state.news.map((nPurchase, index) => (
                      <tr key={index}>
                        <th scope="row">{index + 1}</th>
                        <td>{Moment(nPurchase.updatedAt).format('MM-DD-YYYY  HH:mm:ss')}</td>
                        <td>{nPurchase.username}</td>
                        <td>{nPurchase.product_name}</td>
                        <td>{nPurchase.amount}</td>
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
                  <Button className="mb-4" onClick={() => this.toggleAddProductPic()} color="primary" ><IntlMessages id="button.addproductpic" /></Button>
                </Row>
                <Row>
                  {this.state.productpics.map((productpic, index) => (
                    <Colxx key={index} lg="3">
                      <img key={index} className="mb-2" style={{ width: "100%", height: "240px" }} alt="Product Pic" src={"/assets/img/products/" + productpic.meta_data.filename} />
                      <Button className="mb-4" onClick={() => this.toggleConfirmAlertModal(productpic._id)} style={{ float: "right" }} color="danger" size="xs"><IntlMessages id="button.delete" /></Button> {"  "}
                      <Button className="mb-4" onClick={() => this.toggleEditProductPic(productpic._id)} style={{ float: "right" }} color="secondary" size="xs"><IntlMessages id="button.edit" /></Button> {"  "}
                    </Colxx>
                  ))
                  }
                </Row>
              </CardBody>
            </Card>
          </Colxx>
        </Row>
        <Modal
          isOpen={this.state.modalAdd}
          size="lg"
          toggle={this.toggleAddProductPic}
        >
          <ModalHeader toggle={this.toggleAddProductPic}>
            Upload Product Pic
                    </ModalHeader>
          <ModalBody style={{ textAlign: "center" }}>
            <AddProductPicForm />
          </ModalBody>
        </Modal>
        <Modal
          isOpen={this.state.modalEdit}
          size="lg"
          toggle={this.toggleEditProductPic}
        >
          <ModalHeader toggle={this.toggleEditProductPic}>
            Upload Product Pic
                    </ModalHeader>
          <ModalBody style={{ textAlign: "center" }}>
            <EditProductPicForm productpicid={this.state.editId} />
          </ModalBody>
        </Modal>

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
            <Button onClick={() => this.deleteProductPic()} color="danger" className="mb-2">
              OK
          </Button>{"   "}
            <Button onClick={() => this.toggleConfirmAlertModal()} color="primary" className="mb-2">
              Cancel
          </Button>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  }
}
