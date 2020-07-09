import React, { useState, useEffect } from "react";
import SuperNavbar from "./NavbarComponent";
import NavbarComponent from "../components/sale/NavbarComponent";
import DataTableComponent from "../components/sale/DataTableComponent";
import axios from "axios";
import { Container, Alert } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const Sale = () => {
  const [getdata, setGetdata] = useState([]);
  const [purchaseItems, setPurchaseItems] = useState([]);
  const [saleItems, setSaleItems] = useState([]);
  const [salePayment, setSalePayment] = useState([]);
  const [saleCost, setSaleCost] = useState([]);
  const [filter, setFilter] = useState("");
  const [alert, setAlert] = useState("");
  const [show, setShow] = useState(false);

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

  const getSale = () => {
    axios
      .get("http://127.0.0.1:8000/api/sale/")
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

  const getSaleItems = () => {
    axios
      .get("http://127.0.0.1:8000/api/saleItems/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setSaleItems(getList);
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

  const getSalePayment = () => {
    axios
      .get("http://127.0.0.1:8000/api/salePayment/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setSalePayment(getList);
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
    getSaleItems();
    getSalePayment();
    getSale();
  }, []);

  const callBackHandle = (action) => {
    if (action) {
      getSale();
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
          saleItems={saleItems}
          salePayment={salePayment}
          filter={filter}
          callBack={callBackHandle}
        />
      </Container>
    </div>
  );
};

export default Sale;
