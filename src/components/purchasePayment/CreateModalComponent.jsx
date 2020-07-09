import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import moment from "moment";

const CreateModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [purchaseList, setPurchaseList] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [due, setDue] = useState("");
  const [inputDisable, setInputDisable] = useState(false);
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
    setInput("");
    setInputError("");
    setDue("");
    setInputDisable(false);
  };
  const handleShow = () => {
    if (!input.Date) {
      setInput({ Date: moment().format("YYYY-MM-DDTkk:mm") });
    }
    setShow(true);
  };

  const getPurchaseItems = () => {
    axios
      .get("http://127.0.0.1:8000/api/purchaseItems/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setPurchaseItems(getList);
        else {
          addToast(response.data.errorMessage, {
            appearance: "error",
            autoDismiss: true,
          });
          setShow(true);
        }
      })
      .catch((error) => {
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
        setShow(true);
      });
  };

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });

    let totalPurchase = 0;
    let totalPayment = 0;
    let totalDue = 0;

    if (name === "Purchase") {
      props.payments.map((payment, index) => {
        if (payment.Purchase.id == value) {
          totalPayment += payment.Amount;
        }
      });

      purchaseItems.map((item, index) => {
        if (item.Purchase.id == value) {
          totalPurchase += item.Quantity * item.PurchasePrice;
        }
      });

      purchaseList.map((purchase, index) => {
        if (purchase.id == value) {
          let discountPrice = (totalPurchase * purchase.Discount) / 100;
          totalDue = Math.ceil(totalPurchase - discountPrice - totalPayment);
          setDue(totalDue);
          if (totalDue == 0) {
            setInputDisable(true);
          } else {
            setInputDisable(false);
          }
        }
      });
    }
  };

  const getPurchase = () => {
    axios
      .get("http://127.0.0.1:8000/api/purchase/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setPurchaseList(getList);
        else {
          addToast(response.data.errorMessage, {
            appearance: "error",
            autoDismiss: true,
          });
        }
      })
      .catch((error) => {
        addToast(error.message, {
          appearance: "error",
          autoDismiss: true,
        });
      });
  };

  useEffect(() => {
    getPurchase();
    getPurchaseItems();
  }, []);

  const onClickHandler = () => {
    axios
      .post("http://127.0.0.1:8000/api/purchasePayment/create/", input)
      .then((response) => {
        const { status, postMessage } = response.data;
        if (status) {
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
          <Modal.Title>Create PurchasePayment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Purchase"
                onChange={onChangeHandler}
              >
                <option hidden>Select Purchase</option>
                {purchaseList.map((purchase, index) => (
                  <option value={purchase.id}>{purchase.InvoiceNumber}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {inputError.Purchase}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="number"
                name="Amount"
                placeholder="Amount"
                onChange={onChangeHandler}
                disabled={inputDisable}
              />
              <Form.Text className="text-danger">{inputError.Amount}</Form.Text>
              <Form.Text className="text-dark">
                {due === ""
                  ? due
                  : due == 0
                  ? "Paid All Payment"
                  : `Due: ${due}`}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="datetime-local"
                name="Date"
                placeholder="Date"
                onChange={onChangeHandler}
                defaultValue={moment().format("YYYY-MM-DDTkk:mm")}
                disabled={inputDisable}
              />
              <Form.Text className="text-danger">{inputError.Date}</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="success"
            className="w-100"
            onClick={onClickHandler}
            disabled={inputDisable}
          >
            SAVE NEW
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default CreateModalComponent;
