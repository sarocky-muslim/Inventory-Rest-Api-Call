import React, { useState, useEffect } from "react";
import axios from "axios";
import { Modal, Button, Form } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const CreateModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const [input, setInput] = useState("");
  const [inputError, setInputError] = useState("");
  const [categoryList, setcategoryList] = useState([]);
  const [brandList, setbrandList] = useState([]);
  const [unitList, setunitList] = useState([]);
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

  const getCategory = () => {
    axios
      .get("http://127.0.0.1:8000/api/category/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setcategoryList(getList);
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

  const getBrand = () => {
    axios
      .get("http://127.0.0.1:8000/api/brand/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setbrandList(getList);
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

  const getUnit = () => {
    axios
      .get("http://127.0.0.1:8000/api/unit/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setunitList(getList);
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
    getCategory();
    getBrand();
    getUnit();
  }, []);

  const onClickHandler = () => {
    axios
      .post("http://127.0.0.1:8000/api/product/create/", input)
      .then((response) => {
        console.log(response.data);
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
          <Modal.Title>Create Product</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Category"
                onChange={onChangeHandler}
              >
                <option hidden>Select Category</option>
                {categoryList.map((category, index) => (
                  <option value={category.id}>{category.Name}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">
                {inputError.Category}
              </Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Brand"
                placeholder="Brand*"
                onChange={onChangeHandler}
              >
                <option hidden>Select Brand</option>
                {brandList.map((brand, index) => (
                  <option value={brand.id}>{brand.Name}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">{inputError.Brand}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                as="select"
                name="Unit"
                placeholder="Unit*"
                onChange={onChangeHandler}
              >
                <option hidden>Select Unit</option>
                {unitList.map((unit, index) => (
                  <option value={unit.id}>{unit.Name}</option>
                ))}
              </Form.Control>
              <Form.Text className="text-danger">{inputError.Unit}</Form.Text>
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
                type="date"
                name="Mfg"
                placeholder="Mfg"
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">{inputError.Mfg}</Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="date"
                name="Exp"
                placeholder="Exp"
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
                onChange={onChangeHandler}
              />
              <Form.Text className="text-danger">
                {inputError.Details}
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
