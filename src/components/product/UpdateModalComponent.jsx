import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const UpdateModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [categoryList, setcategoryList] = useState([]);
  const [brandList, setbrandList] = useState([]);
  const [unitList, setunitList] = useState([]);
  const { addToast } = useToasts();

  const handleClose = () => {
    setShow(false);
    setInputError("");
  };
  const handleShow = () => setShow(true);

  const getCategory = () => {
    axios
      .get("http://127.0.0.1:8000/api/category/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setcategoryList(getList);
        else {
          setInputError("categoryError", response.data.errorMessage);
        }
      })
      .catch((error) => {
        setInputError("categoryError", error.message);
      });
  };

  const getBrand = () => {
    axios
      .get("http://127.0.0.1:8000/api/brand/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setbrandList(getList);
        else {
          setInputError("brandError", response.data.errorMessage);
        }
      })
      .catch((error) => {
        setInputError("brandError", error.message);
      });
  };

  const getUnit = () => {
    axios
      .get("http://127.0.0.1:8000/api/unit/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setunitList(getList);
        else {
          setInputError("unitError", response.data.errorMessage);
        }
      })
      .catch((error) => {
        setInputError("unitError", error.message);
      });
  };

  useEffect(() => {
    axios
      .get("http://127.0.0.1:8000/api/product/" + props.Id + "/")
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

    getCategory();
    getBrand();
    getUnit();
  }, [props.Id, addToast]);

  const onChangeHandler = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  const onClickHandler = () => {
    console.log(input);
    axios
      .patch("http://127.0.0.1:8000/api/product/edit/" + props.Id + "/", input)
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
          <Modal.Title>Update Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Category"
                value={input.Category}
                onChange={onChangeHandler}
              >
                <option hidden>Select Category</option>
                {categoryList.map((category, index) => (
                  <option value={category.id}>{category.Name}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {inputError.categoryError}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Brand"
                value={input.Brand}
                onChange={onChangeHandler}
              >
                <option hidden>Select Brand</option>
                {brandList.map((brand, index) => (
                  <option value={brand.id}>{brand.Name}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {inputError.brandError}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Unit"
                value={input.Unit}
                onChange={onChangeHandler}
              >
                <option hidden>Select Unit</option>
                {unitList.map((unit, index) => (
                  <option value={unit.id}>{unit.Name}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {inputError.unitError}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="text"
                name="Name"
                placeholder="Name*"
                value={input.Name}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Name}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="date"
                name="Mfg"
                placeholder="Mfg"
                value={input.Mfg}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Mfg}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="date"
                name="Exp"
                placeholder="Exp"
                value={input.Exp}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Exp}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="textarea"
                name="Details"
                rows="3"
                placeholder="Details"
                value={input.Details}
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.Details}
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
