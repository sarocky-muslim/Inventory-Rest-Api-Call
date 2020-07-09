import React, { useState, useEffect } from "react";
import { Container, Alert, Row, Col } from "react-bootstrap";
import SuperNavbar from "./NavbarComponent";
import SubNavbar from "../components/home/NavbarComponent";
import PurchaseInfo from "../components/home/PurchaseInfo";
import SaleInfo from "../components/home/SaleInfo";
import { ToastProvider } from "react-toast-notifications";
import { useToasts } from "react-toast-notifications";
import axios from "axios";
import moment from "moment";

const Home = () => {
  let nowday = moment().format("YYYY-MM-DD");
  const [outlet, setOutlet] = useState("all");
  const [firstDate, setFirstDate] = useState(nowday);
  const [lastDate, setLastDate] = useState(nowday);

  useEffect(() => {
    purchasePost([outlet, firstDate, lastDate]);
    salePost([outlet, firstDate, lastDate]);
  }, []);

  const [purchaseInfo, setPurchaseInfo] = useState({
    count: 0,
    amount: 0,
    paid: 0,
    due: 0,
  });
  const [saleInfo, setSaleInfo] = useState({
    count: 0,
    amount: 0,
    paid: 0,
    due: 0,
    profit: 0,
  });
  const { addToast } = useToasts();

  const callbackHandle = (data) => {
    purchasePost(data);
    salePost(data);
  };

  const purchasePost = (input) => {
    axios
      .post("http://127.0.0.1:8000/api/home/purchase/", input)
      .then((response) => {
        const { status, purchase } = response.data;
        if (status === true) {
          setPurchaseInfo(purchase);
        } else {
          addToast(purchase, {
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

  const salePost = (input) => {
    axios
      .post("http://127.0.0.1:8000/api/home/sale/", input)
      .then((response) => {
        const { status, sale } = response.data;
        if (status === true) {
          setSaleInfo(sale);
        } else {
          addToast(sale, {
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

  return (
    <div>
      <SuperNavbar />
      <Container>
        <SubNavbar callback={callbackHandle} />
        <hr className="mt-0" />
        <Row>
          <Col>
            <PurchaseInfo purchase={purchaseInfo} />
          </Col>
          <Col>
            <SaleInfo sale={saleInfo} />
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Home;
