import React, { useState, useEffect } from "react";
import SuperNavbar from "./NavbarComponent";
import NavbarComponent from "../components/saleItems/NavbarComponent";
import DataTableComponent from "../components/saleItems/DataTableComponent";
import axios from "axios";
import { Container, Alert } from "react-bootstrap";

const SaleItems = () => {
  const [pItems, setpItems] = useState([]);
  const [sItems, setsItems] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [alert, setAlert] = useState("");
  const [show, setShow] = useState(false);

  const getPurchaseItems = () => {
    axios
      .get("http://127.0.0.1:8000/api/purchaseItems/")
      .then((response) => {
        const { status, getList } = response.data;
        if (status) setpItems(getList);
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

  useEffect(() => {
    getPurchaseItems();
    getSaleItems();
  }, []);

  const callBackHandle = (action) => {
    if (action) {
      getSaleItems();
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
          pItems={pItems}
          sItems={sItems}
          callBack={callBackHandle}
          searchCallBack={searchCallBackHandle}
        />
        <Alert variant="danger" show={show}>
          <Alert.Heading>{alert}</Alert.Heading>
        </Alert>
        <DataTableComponent
          pItems={pItems}
          sItems={sItems}
          searchText={searchText}
          callBack={callBackHandle}
        />
      </Container>
    </div>
  );
};

export default SaleItems;
