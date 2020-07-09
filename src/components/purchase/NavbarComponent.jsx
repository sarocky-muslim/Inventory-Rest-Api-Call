import React, { useState, useEffect } from "react";
import CreateModalComponent from "./CreateModalComponent";
import { NavLink } from "react-router-dom";
import { Row, Col, Nav, Navbar, Form, FormControl } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { ToastProvider } from "react-toast-notifications";
import axios from "axios";

const NavbarComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  // const [suppliers, setSupplies] = useState([]);
  // const [products, setProducts] = useState([]);
  const { addToast } = useToasts();

  // const getSupplier = () => {
  //   axios
  //     .get("http://127.0.0.1:8000/api/supplier/")
  //     .then((response) => {
  //       const { status, getList } = response.data;
  //       if (status) setSupplies(getList);
  //       else {
  //         addToast(response.data.errorMessage, {
  //           appearance: "error",
  //           autoDismiss: true,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       addToast(error.message, {
  //         appearance: "error",
  //         autoDismiss: true,
  //       });
  //     });
  // };
  // const getProduct = () => {
  //   axios
  //     .get("http://127.0.0.1:8000/api/product/")
  //     .then((response) => {
  //       const { status, getList } = response.data;
  //       if (status) setProducts(getList);
  //       else {
  //         addToast(response.data.errorMessage, {
  //           appearance: "error",
  //           autoDismiss: true,
  //         });
  //       }
  //     })
  //     .catch((error) => {
  //       addToast(error.message, {
  //         appearance: "error",
  //         autoDismiss: true,
  //       });
  //     });
  // };

  // useEffect(() => {
  //   getSupplier();
  //   getProduct();
  // }, []);

  const callBackHandle = (isCreate) => {
    props.callBack(isCreate);
  };
  const onChangeHandler = (input) => {
    let filter = input.target.value.toLowerCase();
    props.filterCallBack(filter);
  };

  return (
    <Row>
      <Col>
        <Navbar expand="lg">
          <Navbar.Brand as={NavLink} to="/purchase">
            All Purchase
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/purchaseItems">
                Items
              </Nav.Link>
              <Nav.Link as={NavLink} to="/purchasePayment">
                Payment
              </Nav.Link>
              {/* <Nav.Link as={NavLink} to="/purchaseCost">
                Cost
              </Nav.Link> */}
            </Nav>
            <Form inline>
              <Form.Group controlId="formBasicEmail">
                {/* <Form.Control
                  as="select"
                  name="Supplier"
                  onChange={onChangeHandler}
                  className="mr-2"
                >
                  <option hidden>Select Supplier</option>
                  {suppliers.map((supplier, index) => (
                    <option value={supplier.Company}>{supplier.Company}</option>
                  ))}
                </Form.Control>
                <Form.Control
                  as="select"
                  name="Product"
                  onChange={onChangeHandler}
                  className="mr-2"
                >
                  <option hidden>Select Product</option>
                  {products.map((product, index) => (
                    <option value={product.Name}>{product.Name}</option>
                  ))}
                </Form.Control> */}
                <FormControl
                  type="text"
                  name="Search"
                  placeholder={
                    auth.Role == "admin"
                      ? "Search by outlet, invoice, supplier, date"
                      : "Search by invoice, supplier, date"
                  }
                  className="mr-sm-2"
                  style={{ width: 350 }}
                  onChange={onChangeHandler}
                />
              </Form.Group>
            </Form>
            <ToastProvider>
              <CreateModalComponent callBack={callBackHandle} />
            </ToastProvider>
          </Navbar.Collapse>
        </Navbar>
      </Col>
    </Row>
  );
};

export default NavbarComponent;
