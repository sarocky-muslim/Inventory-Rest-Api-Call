import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const UpdateModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
    setInputError("");
  };

  const handleShow = () => setShow(true);

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/supplier/" + props.Id + "/")
      .then((response) => {
        const { status, getSingle } = response.data;
        if (status) setInput(getSingle);
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

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  const onClickHandler = () => {
    axios
      .patch("http://127.0.0.1:8000/api/supplier/edit/" + props.Id + "/", input)
      .then((response) => {
        const { status, patchMessage } = response.data;
        if (status) {
          handleClose();
          addToast(patchMessage, {
            appearance: "success",
            autoDismiss: true,
          });
          props.callBack(true);
        } else if (status === false) {
          setInputError(response.data.patchError);
        } else {
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
  };

  return (
    <>
      <Button variant="primary" size="sm" onClick={handleShow}>
        Update
      </Button>

      <Modal show={show} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Update Supplier</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                name="Company"
                placeholder="Company*"
                value={input.Company}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.Company}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                name="Owner"
                placeholder="Owner"
                value={input.Owner}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Owner}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="number"
                name="Number"
                placeholder="Number"
                value={input.Number}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Number}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                name="Email"
                placeholder="Email"
                value={input.Email}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Email}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                name="Address"
                placeholder="Address"
                value={input.Address}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.Address}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="textarea"
                name="Note"
                rows="3"
                placeholder="Note"
                value={input.Note}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Note}</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="primary" className="w-100" onClick={onClickHandler}>
            SAVE CHANGES
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateModalComponent;
