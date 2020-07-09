import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const CreateModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState({ Role: "manager" });
  const [outletList, setOutletList] = useState([]);
  const [inputError, setInputError] = useState("");
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
    setInput({ Role: "manager" });
    setInputError("");
  };
  const handleShow = () => setShow(true);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  const getOutlet = () => {
    axios
      .get("http://127.0.0.1:8000/api/outlet/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status == true) setOutletList(getList);
        else {
          addToast(response.data.errorMessage, {
            appearance: "success",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        addToast(error.message, {
          appearance: "success",
          autoDismiss: true,
        });
      });
  };

  const onClickHandler = () => {
    axios
      .post("http://127.0.0.1:8000/api/manager/create/", input)
      .then((response) => {
        const { status, postMessage } = response.data;
        console.log(response.data);
        if (status == true) {
          handleClose();
          addToast(postMessage, {
            appearance: "success",
            autoDismiss: true,
          });
          props.callBack(true);
        } else if (status === false) {
          setInputError(response.data.postError);
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

  useEffect(() => {
    getOutlet();
  }, []);

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Create New
      </Button>

      <Modal show={show} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Create Manager</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Outlet"
                onChange={onChangeHandler}
              >
                <option hidden>Select Outlet</option>
                {outletList.map((outlet, index) => (
                  <option value={outlet.id}>{outlet.Name}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">{inputError.Outlet}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                name="Name"
                placeholder="Name*"
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Name}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                name="Email"
                placeholder="Email*"
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Email}</Form.Text>
            </Form.Group>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="password"
                name="Password"
                placeholder="Password*"
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.Password}
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="success" className="w-100" onClick={onClickHandler}>
            SAVE NEW
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateModalComponent;
