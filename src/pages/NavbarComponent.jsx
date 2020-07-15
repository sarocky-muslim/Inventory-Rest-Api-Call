import React, { useState, useEffect } from "react";
import { NavLink, Redirect } from "react-router-dom";
import {
  Nav,
  Navbar,
  NavDropdown,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";

const NavbarComponent = () => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));

  const logout = () => {
    setAuth(localStorage.removeItem("auth"));
  };

  if (auth == null) {
    return <Redirect to="/login" />;
  }
  return (
    <Navbar bg="dark" variant="dark" expand="lg" className="mb-3">
      <Navbar.Brand as={NavLink} to="/">
        Inventory{" "}
        {auth.Role != "admin" ? (
          <small className="text-warning"> | {auth.Outlet.Name}</small>
        ) : null}
      </Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          <Nav.Link as={NavLink} to="/product">
            Product
          </Nav.Link>
          <Nav.Link as={NavLink} to="/supplier">
            Supplier
          </Nav.Link>
          {/* <Nav.Link as={NavLink} to="/cost">
            Cost
          </Nav.Link> */}
          <Nav.Link as={NavLink} to="/purchase">
            Purchase
          </Nav.Link>
          <Nav.Link as={NavLink} to="/customer">
            Customer
          </Nav.Link>
          <Nav.Link as={NavLink} to="/sale">
            Sale
          </Nav.Link>
          <Nav.Link as={NavLink} to="/stock">
            Stock
          </Nav.Link>
        </Nav>
        <Nav className="ml-auto">
          {auth.Role == "admin" ? (
            <>
              <Nav.Link as={NavLink} to="/outlet">
                Outlet
              </Nav.Link>
              <Nav.Link as={NavLink} to="/manager">
                Manager
              </Nav.Link>
            </>
          ) : auth.Role == "manager" ? (
            <>
              <Nav.Link as={NavLink} to="/stuff">
                Stuff
              </Nav.Link>
            </>
          ) : null}

          <NavDropdown alignRight title={auth.Name} id="basic-nav-dropdown">
            <NavDropdown.Item as={NavLink} to="/profile">
              Profile
            </NavDropdown.Item>
            <NavDropdown.Item>{auth.Email}</NavDropdown.Item>
            <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default NavbarComponent;
