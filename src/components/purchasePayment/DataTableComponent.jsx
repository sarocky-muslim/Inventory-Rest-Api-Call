import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";
import moment from "moment";

const DataTableComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [dataList, setDataList] = useState([]);
  const { payments, searchText } = props;
  let totalAmount = 0;

  useEffect(() => {
    setDataList(
      payments.filter((each) => {
        const purchase = each.Purchase.InvoiceNumber.toLowerCase();
        const amount = each.Amount.toString().toLowerCase();
        const date = moment(each.Date)
          .utc()
          .format("DD MMM YYYY")
          .toLowerCase();
        if (auth.Role === "admin") {
          if (
            purchase.indexOf(searchText) >= 0 ||
            amount.indexOf(searchText) >= 0 ||
            date.indexOf(searchText) >= 0
          ) {
            return each;
          }
        } else {
          if (
            each.Purchase.Outlet === auth.Outlet.id &&
            (purchase.indexOf(searchText) >= 0 ||
              amount.indexOf(searchText) >= 0 ||
              date.indexOf(searchText) >= 0)
          ) {
            return each;
          }
        }

        return null;
      })
    );
  }, [payments, searchText]);

  const callBackHandle = (action) => {
    props.callBack(action);
  };

  return (
    <Row>
      <Col>
        <Table bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice</th>
              <th>Amount</th>
              <th>Date</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((purchasePayment, index) => {
              totalAmount += purchasePayment.Amount;

              return (
                <tr key={purchasePayment.id}>
                  <td>{index}</td>
                  <td>{purchasePayment.Purchase.InvoiceNumber}</td>
                  <td>{purchasePayment.Amount}</td>
                  <td>
                    {moment(purchasePayment.Date).utc().format("DD MMM YYYY")}
                  </td>
                  <td>
                    <ToastProvider>
                      <UpdateModalComponent
                        Id={purchasePayment.id}
                        payments={props.payments}
                        callBack={callBackHandle}
                      />{" "}
                      <DeleteModalComponent
                        Id={purchasePayment.id}
                        callBack={callBackHandle}
                      />
                    </ToastProvider>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <thead>
            <tr>
              <th colSpan="2">Total</th>
              <th>{totalAmount}</th>
              <th colSpan="2"></th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
