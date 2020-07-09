import React, { useState, useEffect } from "react";
import CreateModalComponent from "./CreateModalComponent";
import { NavLink } from "react-router-dom";
import { Row, Col, Nav, Navbar, Form, FormControl } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import { ToastProvider } from "react-toast-notifications";
import axios from "axios";

const NavbarComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const { addToast } = useToasts();

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
          <Navbar.Brand as={NavLink} to="/sale">
            All Sale
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto">
              <Nav.Link as={NavLink} to="/saleItems">
                Items
              </Nav.Link>
              <Nav.Link as={NavLink} to="/salePayment">
                Payment
              </Nav.Link>
            </Nav>
            <Form inline>
              <Form.Group controlId="formBasicEmail">
                <FormControl
                  type="text"
                  name="Search"
                  placeholder={
                    auth.Role == "admin"
                      ? "Search by outlet, invoice, customer, date"
                      : "Search by invoice, customer, date"
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
