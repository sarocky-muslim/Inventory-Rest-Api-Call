import React, { useState, useEffect } from "react";
import { Redirect } from "react-router-dom";
import { Container, Row, Col, Form, Button, Alert } from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import axios from "axios";

const Login = () => {
  const [input, setInput] = useState();
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [authError, setAuthError] = useState();
  const { addToast } = useToasts();

  const onChangeHandle = (event) => {
    const { name, value } = event.target;
    setInput({ ...input, [name]: value });
  };

  const onClickHandle = () => {
    login(input);
  };

  const login = (input) => {
    axios
      .post("http://127.0.0.1:8000/api/user/login/", input)
      .then((response) => {
        const { status, login } = response.data;
        if (status === true) {
          setAuth(login);
        } else {
          addToast(login, {
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

  if (auth) {
    localStorage.setItem("auth", JSON.stringify(auth));
    return <Redirect to="/" />;
  }
  return (
    <Container>
      <Row>
        <Col>
          <h1 className="display-4">Login</h1>
          <Form className="w-50 m-auto border p-5">
            {/* <Alert variant="warning">This is a alert—check it out!</Alert> */}
            <Form.Group controlId="formBasicEmail">
              <Form.Control
                type="email"
                name="Email"
                placeholder="Email"
                onChange={onChangeHandle}
              />
              <Form.Text className="text-muted"></Form.Text>
            </Form.Group>

            <Form.Group controlId="formBasicPassword">
              <Form.Control
                type="password"
                name="Password"
                placeholder="Password"
                onChange={onChangeHandle}
              />
            </Form.Group>

            <Button variant="primary" onClick={onClickHandle}>
              Login
            </Button>
          </Form>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
