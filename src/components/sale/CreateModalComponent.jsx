import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import moment from "moment";

const CreateModalComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  let ol;
  if (auth.Role == "admin") {
    ol = "";
  } else {
    ol = auth.Outlet.id;
  }
  const [show, setShow] = useState(false);
  const [input, setInput] = useState({ Outlet: ol });
  const [inputError, setInputError] = useState("");
  const [outletyList, setoutletyList] = useState([]);
  const [customerList, setCustomerList] = useState([]);
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
    setInput({ Outlet: ol });
    setInputError("");
  };
  const handleShow = () => {
    if (!input.Date) {
      setInput({ ...input, Date: moment().format("YYYY-MM-DDTkk:mm") });
    }
    setShow(true);
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  const getOutlet = () => {
    axios
      .get("http://127.0.0.1:8000/api/outlet/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setoutletyList(getList);
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

  const getCustomer = () => {
    axios
      .get("http://127.0.0.1:8000/api/customer/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setCustomerList(getList);
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

  useEffect(() => {
    getOutlet();
    getCustomer();
  }, []);

  const onClickHandler = () => {
    axios
      .post("http://127.0.0.1:8000/api/sale/create/", input)
      .then((response) => {
        const { status, postMessage } = response.data;
        console.log(response);
        if (status === true) {
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

  return (
    <>
      <Button variant="success" onClick={handleShow}>
        Create New
      </Button>

      <Modal show={show} onHide={handleClose} size="sm">
        <Modal.Header closeButton>
          <Modal.Title>Create Sale</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            {auth.Role == "admin" ? (
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  as="select"
                  name="Outlet"
                  onChange={onChangeHandler}
                >
                  <option hidden>Select Outlet</option>
                  {outletyList.map((outlet, index) => (
                    <option value={outlet.id}>{outlet.Name}</option>
                  ))}
                </Form.Control>
                <Form.Text className="text-danger">
                  {inputError.Outlet}
                </Form.Text>
              </Form.Group>
            ) : null}

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Customer"
                onChange={onChangeHandler}
              >
                <option hidden>Select Customer</option>
                {customerList.map((customer, index) => (
                  <option value={customer.id}>{customer.Name}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {inputError.Customer}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="number"
                name="Discount"
                placeholder="Discount"
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.Discount}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="datetime-local"
                name="Date"
                placeholder="Date"
                defaultValue={moment().format("YYYY-MM-DDTkk:mm")}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Date}</Form.Text>
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
