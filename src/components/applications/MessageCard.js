import React, { Fragment } from "react";
import { Card, CardBody } from "reactstrap";
import Moment from 'moment';

const MessageCard = ({ message }) => {
  return (
    <Fragment>
      <div className="pt-1 pr-2 r-0">
        <span className="text-extra-small text-muted">{Moment(message.createdAt).format('MM-DD-YYYY  HH:mm:ss')}</span>
      </div>
      <Card
        className={`d-inline-block mb-3 float-${"left"
          }`}
      >

        <CardBody>
          <div className="d-flex flex-row pb-1">
            <div className=" d-flex flex-grow-1 min-width-zero">
              <div className="m-2 pl-0 align-self-center d-flex flex-column flex-lg-row justify-content-between min-width-zero">
                <div className="min-width-zero">
                  <p className="mb-0 text-semi-muted">
                    {message.username}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="chat-text-left">
            <p className="mb-0 truncate list-item-heading">{message.message}</p>
          </div>
        </CardBody>
      </Card>
      <div className="clearfix" />
    </Fragment>
  );
};

export default MessageCard;
