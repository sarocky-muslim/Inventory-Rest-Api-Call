import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const UpdateModalComponent = (props) => {
  const data = {
    id: props.sItem.id,
    Price: props.sItem.Price,
    Quantity: props.sItem.Quantity,
    Sale: props.sItem.Sale.id,
    Product: props.sItem.Product.id,
  };
  const [show, setShow] = useState(false);
  const [input, setInput] = useState(data);
  const [inputError, setInputError] = useState("");
  const [saleList, setSaleList] = useState([]);
  const [productList, setProductList] = useState([]);
  const [availableQty, setAvailableQty] = useState();
  const [qtyDisable, setQtyDisable] = useState(false);
  const [pPrice, setpPrice] = useState();
  const [sPrice, setsPrice] = useState();
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
    setInputError("");
    setQtyDisable(false);
    setInput(data);
  };
  const handleShow = () => {
    purchaseInfo("Product", input.Product, true);
    setShow(true);
  };

  const getSale = () => {
    axios
      .get("http://127.0.0.1:8000/api/sale/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setSaleList(getList);
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

  const purchaseInfo = (name, value, onLoad) => {
    if (name == "Product") {
      let pQty = 0,
        sQty = 0,
        avaQty = 0,
        price = 0;
      props.pItems.map((pItem, index) => {
        if (value == pItem.Product.id) {
          pQty += pItem.Quantity;
          price = pItem.SalePrice;
          setpPrice(pItem.PurchasePrice);
          setsPrice(pItem.SalePrice);
          if (!onLoad) {
            setInput({
              ...input,
              Product: value,
              Price: price,
            });
          }
        }
      });
      props.sItems.map((sItem, index) => {
        if (value == sItem.Product.id && sItem.id != input.id) {
          sQty += sItem.Quantity;
        }
      });
      avaQty = pQty - sQty;
      if (avaQty <= 0) {
        setQtyDisable(true);
        setAvailableQty(0);
        if (!onLoad) {
          setInput({
            ...input,
            Product: value,
            Quantity: "",
            Price: price,
          });
        }
      } else {
        setQtyDisable(false);
        setAvailableQty(avaQty);
        if (!onLoad) {
          setInput({
            ...input,
            Product: value,
            Quantity: 1,
            Price: price,
          });
        }
      }
    } else if (name == "Quantity") {
      if (parseInt(value) < 1) {
        console.log(input);
        setInput({ ...input, Quantity: 1 });
      } else if (parseInt(value) > availableQty) {
        console.log(input);
        setInput({ ...input, Quantity: availableQty });
      }
    }
  };

  useEffect(() => {
    getSale();
    getProduct();
  }, [props.Id, addToast]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });

    purchaseInfo(name, value, false);
  };

  const onClickHandler = () => {
    console.log(input);
    axios
      .patch(
        "http://127.0.0.1:8000/api/saleItems/edit/" + input.id + "/",
        input
      )
      .then((response) => {
        const { status, patchMessage } = response.data;
        console.log(response);
        if (status === true) {
          handleClose();
          addToast(patchMessage, {
            appearance: "success",
            autoDismiss: true,
          });
          props.callBack(true);
        } else if (status === false) {
          setInputError(response.data.patchError);
          // addToast(response.data.patchError, {
          //   appearance: "error",
          //   autoDismiss: true,
          // });
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
          <Modal.Title>Update SaleItem</Modal.Title>
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
              <Form.Text className="text-danger">{inputError.Sale}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Product"
                value={input.Product}
                onChange={onChangeHandler}
              >
                <option hidden>Select Product</option>
                {productList.map((product, index) => {
                  let match = false;
                  props.pItems.map((pItem, index) => {
                    return product.id === pItem.Product.id
                      ? (match = true)
                      : null;
                  });
                  return match ? (
                    <option value={product.id}>{product.Name}</option>
                  ) : null;
                })}
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
                min="1"
                max={availableQty}
                value={input.Quantity}
                disabled={qtyDisable}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.Quantity}
              </Form.Text>
              <Form.Text className="text-dark">
                {availableQty != null
                  ? `Available Quantity: ${availableQty}`
                  : ""}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="number"
                name="Price"
                placeholder="Price"
                value={input.Price}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Price}</Form.Text>
              <Form.Text className="text-dark">
                {pPrice != null && sPrice != null
                  ? `Purchase Price: ${pPrice}, Sale Price: ${sPrice}`
                  : ""}
              </Form.Text>
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
