import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import moment from "moment";

const UpdateModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [saleList, setSaleList] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [due, setDue] = useState("");
  const [inputDisable, setInputDisable] = useState(false);
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
    setInputError("");
    setDue("");
    setInputDisable(false);
  };
  const handleShow = () => {
    setShow(true);
    getSalePayment();
  };

  const getSale = () => {
    axios
      .get("http://127.0.0.1:8000/api/sale/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setSaleList(getList);
        else {
          setInputError("saleError", response.data.errorMessage);
        }
      })
      .catch((error) => {
        setInputError("saleError", error.message);
      });
  };
  const getSaleItems = () => {
    axios
      .get("http://127.0.0.1:8000/api/saleItems/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setSaleItems(getList);
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

  const getSalePayment = () => {
    axios
      .get("http://127.0.0.1:8000/api/salePayment/" + props.Id + "/")
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
    getSale();
    getSaleItems();
  }, [props.Id, addToast]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });

    let totalSale = 0;
    let totalPayment = 0;
    let totalDue = 0;

    if (name === "Sale") {
      props.payments.map((payment, index) => {
        if (payment.Sale.id == value) {
          totalPayment += payment.Amount;
        }
      });

      console.log(`totalPayment = ${totalPayment}`);

      saleItems.map((item, index) => {
        if (item.Sale.id == value) {
          totalSale += item.Quantity * item.Price;
        }
      });

      saleList.map((sale, index) => {
        if (sale.id == value) {
          let discountPrice = (totalSale * sale.Discount) / 100;
          totalDue = Math.ceil(totalSale - discountPrice - totalPayment);
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
    axios
      .patch(
        "http://127.0.0.1:8000/api/salePayment/edit/" + props.Id + "/",
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
          <Modal.Title>Update SalePayment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Sale"
                value={input.Sale}
                onChange={onChangeHandler}
              >
                <option hidden>Select Sale</option>
                {saleList.map((sale, index) => (
                  <option value={sale.id}>{sale.InvoiceNumber}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {inputError.saleError}
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
