import React, { useState, useEffect } from "react";
import SuperNavbar from "./NavbarComponent";
import { NavLink, Redirect } from "react-router-dom";
import NavbarComponent from "../components/category/NavbarComponent";
import DataTableComponent from "../components/category/DataTableComponent";
import axios from "axios";
import { Container, Alert, Form, Button, Col, Row } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";

const Profile = () => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [input, setInput] = useState(
    auth == null
      ? ""
      : {
          Name: auth.Name,
          Email: auth.Email,
          Password: auth.Password,
        }
  );
  const [inputError, setInputError] = useState("");
  const [getdata, setGetdata] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [alert, setAlert] = useState("");
  const [show, setShow] = useState(false);
  const [newpass, setNewpass] = useState(true);
  const { addToast } = useToasts();

  const onChangeHandler = (event) => {
    const { name, value } = event.target;

    if (name == "oldPassword") {
      if (auth.Password == value) {
        setNewpass(false);
      } else {
        setNewpass(true);
      }
    } else {
      setInput({ ...input, [name]: value });
    }
  };

  const onClickHandler = () => {
    axios
      .patch("http://127.0.0.1:8000/api/user/update/" + auth.id + "/", input)
      .then((response) => {
        const { status, patchMessage } = response.data;
        if (status == true) {
          setAuth(localStorage.removeItem("auth"));
          addToast(patchMessage, {
            appearance: "success",
            autoDismiss: true,
          });
        } else if (status === false) {
          setInputError(response.data.patchError);
        } else {
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

  if (auth == null) {
    return <Redirect to="/login" />;
  }
  return (
    <div>
      <SuperNavbar />
      <Container>
        <Row>
          <Col>
            <Form className="w-50 m-auto">
              <h3>My Profile</h3>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="text"
                  name="Name"
                  placeholder="Name*"
                  value={input.Name}
                  onChange={onChangeHandler}
                />
                <Form.Text className="text-danger text-left">
                  {inputError.Name}
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="email"
                  name="Email"
                  placeholder="Email"
                  value={input.Email}
                  onChange={onChangeHandler}
                />
                <Form.Text className="text-danger text-left">
                  {inputError.Email}
                </Form.Text>
              </Form.Group>

              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="password"
                  name="oldPassword"
                  placeholder="old password"
                  onChange={onChangeHandler}
                />
                {/* <Form.Text className="text-danger">{inputError.Password}</Form.Text> */}
              </Form.Group>
              <Form.Group controlId="formBasicEmail">
                <Form.Control
                  type="password"
                  name="Password"
                  placeholder="new password"
                  disabled={newpass}
                  onChange={onChangeHandler}
                />
                {/* <Form.Text className="text-danger">{inputError.Password}</Form.Text> */}
              </Form.Group>
              <Button
                variant="success"
                className="w-100"
                onClick={onClickHandler}
              >
                Update Profile
              </Button>
            </Form>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Profile;
