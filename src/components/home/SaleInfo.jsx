import React, { useState, useEffect } from "react";
import { Row, Col, Card } from "react-bootstrap";
import CarouselCaption from "react-bootstrap/CarouselCaption";

const SaleInfo = (props) => {
  const { count, amount, paid, due, profit } = props.sale;
  return (
    <div>
      <Row>
        <Col>
          <h1 className="display-4">Sale Info</h1>
        </Col>
      </Row>
      <hr className="mt-0" />
      <Row>
        <Col md="6" className="mb-2">
          <Card border="dark">
            <Card.Header>Number of Invoice</Card.Header>
            <Card.Body>
              <Card.Title>
                <h1 className="display-4">{count}</h1>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6" className="mb-2">
          <Card border="success">
            <Card.Header>Total Amount</Card.Header>
            <Card.Body>
              <Card.Title>
                <h1 className="display-4">{amount}</h1>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6" className="mb-2">
          <Card border="primary">
            <Card.Header>Total Paid</Card.Header>
            <Card.Body>
              <Card.Title>
                <h1 className="display-4">{paid}</h1>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6" className="mb-2">
          <Card border="danger">
            <Card.Header>Total Due</Card.Header>
            <Card.Body>
              <Card.Title>
                <h1 className="display-4">{due}</h1>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
        <Col md="6" className="mb-2">
          <Card border="warning">
            <Card.Header>Total Profit</Card.Header>
            <Card.Body>
              <Card.Title>
                <h1 className="display-4">{profit}</h1>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default SaleInfo;
