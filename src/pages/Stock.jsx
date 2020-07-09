import React, { useState, useEffect } from "react";
import SuperNavbar from "./NavbarComponent";
import NavbarComponent from "../components/stock/NavbarComponent";
import DataTableComponent from "../components/stock/DataTableComponent";
import axios from "axios";
import { Container, Alert } from "react-bootstrap";

const Stock = () => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [products, setProducts] = useState([]);
  const [purchase, setPurchase] = useState([]);
  const [pItems, setpItems] = useState([]);
  const [sItems, setsItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [alert, setAlert] = useState("");
  const [show, setShow] = useState(false);

  const getPurchase = () => {
    axios
      .get("http://127.0.0.1:8000/api/purchase/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setPurchase(getList);
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
        if (status == true) {
          setpItems(getList);
        } else {
          setAlert(response.data.errorMessage);
          setShow(true);
        }
      })
      .catch((error) => {
        setAlert(error.message);
        setShow(true);
      });
  };
  const getProduct = () => {
    axios
      .get("http://127.0.0.1:8000/api/product/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) {
          setProducts(getList);
        } else {
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
        if (status) setsItems(getList);
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
  const stock = () => {};

  useEffect(() => {
    getProduct();
    getPurchaseItems();
    getSaleItems();
  }, []);

  const callBackHandle = (action) => {
    if (action) {
      stock();
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
          callBack={callBackHandle}
          searchCallBack={searchCallBackHandle}
        />
        <Alert variant="danger" show={show}>
          <Alert.Heading>{alert}</Alert.Heading>
        </Alert>
        <DataTableComponent
          products={products}
          pItems={pItems}
          sItems={sItems}
          searchText={searchText}
          callBack={callBackHandle}
        />
      </Container>
    </div>
  );
};

export default Stock;
