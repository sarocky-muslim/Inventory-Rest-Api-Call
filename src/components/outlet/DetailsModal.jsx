import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, ListGroup, Row, Col } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const DetailsModal = (props) => {
  const [show, setShow] = useState(false);
  const [outlet, setOutlet] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    setCurrentUrl(window.location.pathname);
    axios
      .get("http://127.0.0.1:8000/api/outlet/" + props.Id + "/")
      .then((response) => {
        const { status, getSingle } = response.data;
        if (status) setOutlet(getSingle);
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
      {currentUrl === "/outlet" ? (
        <Button variant="info" size="sm" onClick={handleShow}>
          Details
        </Button>
      ) : (
        <Button variant="light" size="sm" onClick={handleShow}>
          {outlet.Name}
        </Button>
      )}

      <Modal show={show} onHide={handleClose} size="md">
        <Modal.Header closeButton>
          <Modal.Title>Details Outlet</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush">
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Name</h6>
                </Col>
                <Col>{outlet.Name}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Address</h6>
                </Col>
                <Col>{outlet.Address}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Number</h6>
                </Col>
                <Col>{outlet.Number}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>Email</h6>
                </Col>
                <Col>{outlet.Email}</Col>
              </Row>
            </ListGroup.Item>
            <ListGroup.Item>
              <Row>
                <Col>
                  <h6>About</h6>
                </Col>
                <Col>{outlet.Note}</Col>
              </Row>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DetailsModal;
