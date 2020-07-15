import React, { useState, useEffect } from "react";
import { NavLink, Redirect } from "react-router-dom";
import {
  Row,
  Col,
  Nav,
  Navbar,
  Form,
  FormControl,
  Button,
} from "react-bootstrap";
import { useToasts } from "react-toast-notifications";
import moment from "moment";
import axios from "axios";

const NavbarComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  let ol;

  if (auth != null) {
    if (auth.Role == "admin") {
      ol = "all";
    } else {
      ol = auth.Outlet.id;
    }
  }
  const [outlet, setOutlet] = useState(ol);
  let nowday = moment().format("YYYY-MM-DD");
  const [firstDate, setFirstDate] = useState(nowday);
  const [lastDate, setLastDate] = useState(nowday);
  const [outletList, setOutletList] = useState([]);
  const { addToast } = useToasts();

  const onClickHandle = (btn) => {
    let name = btn.target.name;
    let todayDay = moment().format("DD");
    let todayMonth = moment().format("MM");
    let todayYear = moment().format("YYYY");
    let today = moment(`${todayYear}-${todayMonth}-${todayDay}`).format(
      "YYYY-MM-DD"
    );
    let lastDay = moment(`${todayYear}-${todayMonth}-${todayDay - 1}`).format(
      "YYYY-MM-DD"
    );
    let thisMonthF = moment(`${todayYear}-${todayMonth}-01`).format(
      "YYYY-MM-DD"
    );
    let lastMonthF = moment(`${todayYear}-${todayMonth - 1}-01`).format(
      "YYYY-MM-DD"
    );
    let thisYearF = moment(`${todayYear}-01-01`).format("YYYY-MM-DD");
    let lastYearF = moment(`${todayYear - 1}-01-01`).format("YYYY-MM-DD");

    if (name === "today") {
      props.callback([outlet, today, today]);
      setFirstDate(today);
      setLastDate(today);
    } else if (name === "lastDay") {
      props.callback([outlet, lastDay, lastDay]);
      setFirstDate(lastDay);
      setLastDate(lastDay);
    } else if (name === "thisMonth") {
      props.callback([outlet, thisMonthF, today]);
      setFirstDate(thisMonthF);
      setLastDate(today);
    } else if (name === "lastMonth") {
      props.callback([outlet, lastMonthF, thisMonthF]);
      setFirstDate(lastMonthF);
      setLastDate(thisMonthF);
    } else if (name === "thisYear") {
      props.callback([outlet, thisYearF, today]);
      setFirstDate(thisYearF);
      setLastDate(today);
    } else if (name === "lastYear") {
      props.callback([outlet, lastYearF, thisYearF]);
      setFirstDate(lastYearF);
      setLastDate(thisYearF);
    }
  };

  const getOutlet = () => {
    axios
      .get("http://127.0.0.1:8000/api/outlet/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status === true) setOutletList(getList);
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
    getOutlet();
  }, []);

  const onChangeHandle = (input) => {
    let { name, value } = input.target;

    if (name === "Outlet") {
      setOutlet(value);
      props.callback([value, firstDate, lastDate]);
    } else if (name === "FirstDate") {
      setFirstDate(value);
      props.callback([outlet, value, lastDate]);
    } else if (name === "LastDate") {
      setLastDate(value);
      props.callback([outlet, firstDate, value]);
    }
  };

  if (auth == null) {
    return <Redirect to="/login" />;
  }
  return (
    <Row>
      <Col>
        <Navbar expand="lg">
          <Navbar.Brand as={NavLink} to="/">
            Dashboard
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="mr-auto"></Nav>
            {auth.Role == "admin" ? (
              <Form.Control
                as="select"
                name="Outlet"
                style={{ width: 100, marginRight: 10 }}
                size="sm"
                onChange={onChangeHandle}
              >
                <option value="all">All Outlet</option>
                {outletList.map((outlet, index) => (
                  <option value={outlet.id}>{outlet.Name}</option>
                ))}
              </Form.Control>
            ) : null}

            <Button
              variant="light"
              size="sm"
              className="mr-2"
              name="lastYear"
              onClick={onClickHandle}
            >
              Last Year
            </Button>
            <Button
              variant="light"
              size="sm"
              className="mr-2"
              name="lastMonth"
              onClick={onClickHandle}
            >
              Last Month
            </Button>
            <Button
              variant="light"
              size="sm"
              className="mr-2"
              name="lastDay"
              onClick={onClickHandle}
            >
              Last Day
            </Button>
            <Button
              variant="light"
              size="sm"
              className="mr-2"
              name="today"
              onClick={onClickHandle}
            >
              Today
            </Button>
            <Button
              variant="light"
              size="sm"
              className="mr-2"
              name="thisMonth"
              onClick={onClickHandle}
            >
              This Month
            </Button>
            <Button
              variant="light"
              size="sm"
              className="mr-2"
              name="thisYear"
              onClick={onClickHandle}
            >
              This Year
            </Button>
            <Form inline>
              <FormControl
                type="date"
                size="sm"
                className="mr-2"
                name="FirstDate"
                defaultValue={moment().format("YYYY-MM-DD")}
                value={moment(firstDate).format("YYYY-MM-DD")}
                onChange={onChangeHandle}
              />
              <FormControl
                type="date"
                size="sm"
                name="LastDate"
                defaultValue={moment().format("YYYY-MM-DD")}
                value={moment(lastDate).format("YYYY-MM-DD")}
                onChange={onChangeHandle}
              />
            </Form>
          </Navbar.Collapse>
        </Navbar>
      </Col>
    </Row>
  );
};

export default NavbarComponent;
