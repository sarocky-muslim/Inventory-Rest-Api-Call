import React, { useState, useEffect } from "react";
import SuperNavbar from "./NavbarComponent";
import NavbarComponent from "../components/brand/NavbarComponent";
import DataTableComponent from "../components/brand/DataTableComponent";
import axios from "axios";
import { Container, Alert } from "react-bootstrap";

const Brand = () => {
  const [getdata, setGetdata] = useState([]);
  const [searchText, setSearchText] = useState("");
  const [alert, setAlert] = useState("");
  const [show, setShow] = useState(false);

  const getBrand = () => {
    axios
      .get("http://127.0.0.1:8000/api/brand/")
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
    getBrand();
  }, []);

  const callBackHandle = (action) => {
    if (action) {
      getBrand();
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
          data={getdata}
          searchText={searchText}
          callBack={callBackHandle}
        />
      </Container>
    </div>
  );
};

export default Brand;
