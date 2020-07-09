import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, ListGroup, Row, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const DetailsModal = (props) => {
  const [show, setShow] = useState(false);
  const [currentUrl, setCurrentUrl] = useState("");
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    setCurrentUrl(window.location.pathname);
  }, []);

  return (
    <>
      {currentUrl === "/product" ? (
        <Button variant="info" size="sm" onClick={handleShow}>
          Details
        </Button>
      ) : (
        <Button variant="light" size="sm" onClick={handleShow}>
          {props.product.Name}
        </Button>
      )}

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Details Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>SKU</h6>
                </Col>
                <Col>{props.product.SKU}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Name</h6>
                </Col>
                <Col>{props.product.Name}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Category</h6>
                </Col>
                <Col>{props.product.Category.Name}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Brand</h6>
                </Col>
                <Col>{props.product.Brand.Name}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Unit</h6>
                </Col>
                <Col>{props.product.Unit.Name}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Mfg</h6>
                </Col>
                <Col>{props.product.Mfg}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Exp</h6>
                </Col>
                <Col>{props.product.Exp}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Details</h6>
                </Col>
                <Col>{props.product.Details}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DetailsModal;
