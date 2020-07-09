import React, { useState, useEffect } from "react";
import SuperNavbar from "./NavbarComponent";
import NavbarComponent from "../components/salePayment/NavbarComponent";
import DataTableComponent from "../components/salePayment/DataTableComponent";
import axios from "axios";
import { Container, Alert } from "react-bootstrap";

const SalePayment = () => {
  const [getdata, setGetdata] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [alert, setAlert] = useState("");
  const [show, setShow] = useState(false);

  const getSalePayment = () => {
    axios
      .get("http://127.0.0.1:8000/api/salePayment/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setGetdata(getList);
        else {
          setAlert(response.data.errorMessage);
          setShow(true);
        }
      })
      .catch((error) => {
        setAlert(error.message);
        setShow(true);
      });
  };

  useEffect(() => {
    getSalePayment();
  }, []);

  const callBackHandle = (action) => {
    if (action) {
      getSalePayment();
    }
  };

  const searchCallBackHandle = (searchValue) => {
    setSearchText(searchValue);
  };

  return (
    <div>
      <SuperNavbar />
      <Container>
        <NavbarComponent
          payments={getdata}
          callBack={callBackHandle}
          searchCallBack={searchCallBackHandle}
        />
        <Alert variant="danger" show={show}>
          <Alert.Heading>{alert}</Alert.Heading>
        </Alert>
        <DataTableComponent
          payments={getdata}
          searchText={searchText}
          callBack={callBackHandle}
        />
      </Container>
    </div>
  );
};

export default SalePayment;
