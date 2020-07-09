import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import moment from "moment";

const UpdateModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [purchaseList, setPurchaseList] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [due, setDue] = useState("");
  const [inputDisable, setInputDisable] = useState(false);
  const { addToast } = useToasts();
  let purchaseId;

  const handleClose = () => {
    setShow(false);
    setInputError("");
    setDue("");
    setInputDisable(false);
  };
  const handleShow = () => {
    setShow(true);
    getPurchasePayment();
  };

  const getPurchase = () => {
    axios
      .get("http://127.0.0.1:8000/api/purchase/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setPurchaseList(getList);
        else {
          setInputError("purchaseError", response.data.errorMessage);
        }
      })
      .catch((error) => {
        setInputError("purchaseError", error.message);
      });
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

  const getPurchasePayment = () => {
    axios
      .get("http://127.0.0.1:8000/api/purchasePayment/" + props.Id + "/")
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
  };

  useEffect(() => {
    getPurchase();
    getPurchaseItems();
  }, [props.Id, addToast]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });

    let totalPurchase = 0;
    let totalPayment = 0;
    let totalDue = 0;

    if (name === "Purchase") {
      props.payments.map((payment, index) => {
        if (payment.Purchase.id == value && payment.id != input.id) {
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

  const onClickHandler = () => {
    console.log(input);
    axios
      .patch(
        "http://127.0.0.1:8000/api/purchasePayment/edit/" + props.Id + "/",
        input
      )
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
          <Modal.Title>Update PurchasePayment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Purchase"
                value={input.Purchase}
                onChange={onChangeHandler}
              >
                <option hidden>Select Purchase</option>
                {purchaseList.map((purchase, index) => (
                  <option value={purchase.id}>{purchase.InvoiceNumber}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {inputError.purchaseError}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="number"
                name="Amount"
                placeholder="Amount"
                value={input.Amount}
                disabled={inputDisable}
                onChange={onChangeHandler}
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
                value={moment(input.Date).utc().toISOString().replace("Z", "")}
                disabled={inputDisable}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Date}</Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="primary"
            className="w-100"
            disabled={inputDisable}
            onClick={onClickHandler}
          >
            SAVE CHANGES
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UpdateModalComponent;
