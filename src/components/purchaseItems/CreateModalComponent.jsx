import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const CreateModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [purchaseList, setPurchaseList] = useState([]);
  const [productList, setProductList] = useState([]);
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
    setInput("");
    setInputError("");
  };
  const handleShow = () => setShow(true);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
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

  const getProduct = () => {
    axios
      .get("http://127.0.0.1:8000/api/product/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setProductList(getList);
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
    getProduct();
  }, []);

  const onClickHandler = () => {
    axios
      .post("http://127.0.0.1:8000/api/purchaseItems/create/", input)
      .then((response) => {
        const { status, postMessage } = response.data;
        if (status) {
          // handleClose();
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
          <Modal.Title>Create PurchaseItems</Modal.Title>
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
                as="select"
                name="Product"
                onChange={onChangeHandler}
              >
                <option hidden>Select Product</option>
                {productList.map((product, index) => (
                  <option value={product.id}>{product.Name}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {inputError.Product}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="number"
                name="Quantity"
                placeholder="Quantity"
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.Quantity}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="number"
                name="PurchasePrice"
                placeholder="PurchasePrice"
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.PurchasePrice}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="number"
                name="SalePrice"
                placeholder="SalePrice"
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.SalePrice}
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
