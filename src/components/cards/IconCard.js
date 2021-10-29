import React from "react";
import { Card, CardBody } from "reactstrap";
import styles from '../../assets/css/animation.scss';

const IconCard = ({ className = "mb-4", icon, title, value }) => {
  return (
    <div className={`icon-row-item ${className} ${styles.animcard} animcard`}>
      <Card >
        <CardBody className="text-center">
          <p style={{ fontSize: "20px" }} className="card-text font-weight-bold mb-4">
            {title}
          </p>
          <p className="lead text-center">
            <i className={icon} />
            {"    "}
            {value}
          </p>
        </CardBody>
      </Card>
    </div>
  );
};

export default IconCard;