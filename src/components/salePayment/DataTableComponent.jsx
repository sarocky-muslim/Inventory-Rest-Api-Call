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
        const sale = each.Sale.InvoiceNumber.toLowerCase();
        const amount = each.Amount.toString().toLowerCase();
        const date = moment(each.Date)
          .utc()
          .format("DD MMM YYYY")
          .toLowerCase();
        if (auth.Role === "admin") {
          if (
            sale.indexOf(searchText) >= 0 ||
            amount.indexOf(searchText) >= 0 ||
            date.indexOf(searchText) >= 0
          ) {
            return each;
          }
        } else {
          if (
            each.Sale.Outlet === auth.Outlet.id &&
            (sale.indexOf(searchText) >= 0 ||
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
            {dataList.map((salePayment, index) => {
              totalAmount += salePayment.Amount;
              return (
                <tr key={salePayment.id}>
                  <td>{index}</td>
                  <td>{salePayment.Sale.InvoiceNumber}</td>
                  <td>{salePayment.Amount}</td>
                  <td>
                    {moment(salePayment.Date).utc().format("DD MMM YYYY")}
                  </td>
                  <td>
                    <ToastProvider>
                      <UpdateModalComponent
                        Id={salePayment.id}
                        payments={payments}
                        callBack={callBackHandle}
                      />{" "}
                      <DeleteModalComponent
                        Id={salePayment.id}
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
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
