import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, ListGroup, Row, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const CustomerDetailsModal = (props) => {
  const [show, setShow] = useState(false);
  const [customer, setCustomer] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    setCurrentUrl(window.location.pathname);
    axios
      .get("http://127.0.0.1:8000/api/customer/" + props.Id + "/")
      .then((response) => {
        const { status, getSingle } = response.data;
        if (status) setCustomer(getSingle);
        else {
          handleClose();
          addToast(response.data.errorMessage, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        handleClose();
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  }, [props.Id, addToast]);

  return (
    <>
      {currentUrl === "/customer" ? (
        <Button variant="info" size="sm" onClick={handleShow}>
          Details
        </Button>
      ) : (
        <Button variant="light" size="sm" onClick={handleShow}>
          {customer.Name}
        </Button>
      )}

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Details Customer</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Name</h6>
                  <p>{customer.Name}</p>
                </Col>
                <Col>
                  <h6>Contact Number</h6>
                  <p>{customer.Number}</p>
                </Col>
                <Col>
                  <h6>Email</h6>
                  <p>{customer.Email}</p>
                </Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Address</h6>
                  <p>{customer.Address}</p>
                </Col>
                <Col>
                  <h6>About</h6>
                  <p>{customer.Note}</p>
                </Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default CustomerDetailsModal;
