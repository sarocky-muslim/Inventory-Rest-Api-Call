import React, { useState } from "react";
import axios from "axios";
import { Modal, Button } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const DeleteModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const { addToast } = useToasts();

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const handleDelete = () => {
    axios
      .delete("http://127.0.0.1:8000/api/manager/delete/" + props.Id + "/")
      .then((response) => {
        const { status, deleteMessage } = response.data;
        if (status) {
          setShow(false);
          addToast(deleteMessage, {
            appearance: "success",
            autoDismiss: true,
          });
          props.callBack(true);
        } else {
          setShow(false);
          addToast(response.data.errorMessage, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        setShow(false);
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  return (
    <>
      <Button variant="danger" size="sm" onClick={handleShow}>
        Delete
      </Button>

      <Modal show={show} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Delete Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are You Sure To Delete?</Modal.Body>
        <Modal.Footer>
          <Button variant="danger" className="w-100" onClick={handleDelete}>
            YES, DELETE
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteModalComponent;
