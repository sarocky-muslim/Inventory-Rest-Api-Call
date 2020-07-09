import React, { useState, useEffect } from "react";
import SuperNavbar from "./NavbarComponent";
import NavbarComponent from "../components/purchase/NavbarComponent";
import DataTableComponent from "../components/purchase/DataTableComponent";
import axios from "axios";
import { Container, Alert } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const Purchase = () => {
  const [getdata, setGetdata] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [purchasePayment, setPurchasePayment] = useState([]);
  const [purchaseCost, setPurchaseCost] = useState([]);
  const [filter, setFilter] = useState("");
  const [alert, setAlert] = useState("");
  const [show, setShow] = useState(false);

  const getPurchase = () => {
    axios
      .get("http://127.0.0.1:8000/api/purchase/")
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

  const getPurchaseItems = () => {
    axios
      .get("http://127.0.0.1:8000/api/purchaseItems/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setPurchaseItems(getList);
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

  const getPurchasePayment = () => {
    axios
      .get("http://127.0.0.1:8000/api/purchasePayment/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setPurchasePayment(getList);
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

  const getPurchaseCost = () => {
    axios
      .get("http://127.0.0.1:8000/api/purchaseCost/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setPurchaseCost(getList);
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
    getPurchaseItems();
    getPurchasePayment();
    getPurchaseCost();
    getPurchase();
  }, []);

  const callBackHandle = (action) => {
    if (action) {
      getPurchase();
    }
  };

  const filterCallBackHandle = (filterValue) => {
    setFilter(filterValue);
  };

  return (
    <div>
      <SuperNavbar />
      <Container>
        <ToastProvider>
          <NavbarComponent
            callBack={callBackHandle}
            filterCallBack={filterCallBackHandle}
          />
        </ToastProvider>
        <Alert variant="danger" show={show}>
          <Alert.Heading>{alert}</Alert.Heading>
        </Alert>
        <DataTableComponent
          data={getdata}
          purchaseItems={purchaseItems}
          purchasePayment={purchasePayment}
          purchaseCost={purchaseCost}
          filter={filter}
          callBack={callBackHandle}
        />
      </Container>
    </div>
  );
};

export default Purchase;
