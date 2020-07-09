import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, ListGroup, Row, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const SupplierDetailsModal = (props) => {
  const [show, setShow] = useState(false);
  const [supplier, setSupplier] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    setCurrentUrl(window.location.pathname);
    axios
      .get("http://127.0.0.1:8000/api/supplier/" + props.Id + "/")
      .then((response) => {
        const { status, getSingle } = response.data;
        if (status) setSupplier(getSingle);
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
      {currentUrl === "/supplier" ? (
        <Button variant="info" size="sm" onClick={handleShow}>
          Details
        </Button>
      ) : (
        <Button variant="light" size="sm" onClick={handleShow}>
          {supplier.Company}
        </Button>
      )}

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Details Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Company</h6>
                </Col>
                <Col>{supplier.Company}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Owner</h6>
                </Col>
                <Col>{supplier.Owner}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Number</h6>
                </Col>
                <Col>{supplier.Number}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Email</h6>
                </Col>
                <Col>{supplier.Email}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Address</h6>
                </Col>
                <Col>{supplier.Address}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Note</h6>
                </Col>
                <Col>{supplier.Note}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default SupplierDetailsModal;
