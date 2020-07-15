import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import DetailsModalComponent from "./DetailsModalComponent";
import InvoicePrintComponent from "./InvoicePrintComponent";
import {
  Row,
  Col,
  Table,
  Button,
  Dropdown,
  ButtonGroup,
} from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";
import moment from "moment";

const DataTableComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [dataList, setDataList] = useState([]);
  const {
    data,
    purchaseItems,
    saleItems,
    salePayment,
    saleCost,
    filter,
  } = props;

  let totalAmount = 0,
    totalPaid = 0,
    totalDue = 0,
    totalProfit = 0;

  useEffect(() => {
    setDataList(
      data.filter((each) => {
        const outlet = each.Outlet.Name.toLowerCase();
        const invoiceNumber = each.InvoiceNumber.toLowerCase();
        const customer = each.Customer.Name.toLowerCase();
        const date = moment(each.Date)
          .utc()
          .format("DD MMM YYYY")
          .toLowerCase();

        if (auth.Role == "admin") {
          if (filter == "") {
            return each;
          } else if (
            outlet.indexOf(filter) >= 0 ||
            invoiceNumber.indexOf(filter) >= 0 ||
            customer.indexOf(filter) >= 0 ||
            date.indexOf(filter) >= 0
          ) {
            return each;
          } else {
            return null;
          }
        } else {
          if (each.Outlet.id === auth.Outlet.id) {
            if (filter == "") {
              return each;
            } else if (
              invoiceNumber.indexOf(filter) >= 0 ||
              customer.indexOf(filter) >= 0 ||
              date.indexOf(filter) >= 0
            ) {
              return each;
            } else {
              return null;
            }
          } else {
            return null;
          }
        }
      })
    );
  }, [data, filter]);

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
              {auth.Role == "admin" ? <th>Outlet</th> : null}
              <th>Invoice</th>
              <th>Customer</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Due</th>
              <th>profit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((sale, index) => {
              let purchasePrice = 0;
              let purchaseAmount = 0;
              let amount = 0;
              let profit = 0;
              let paid = 0;
              let due = 0;
              let datetime = "";

              saleItems.map((saleItem, index) => {
                return sale.id === saleItem.Sale.id
                  ? (() => {
                      purchaseItems.map((purchaseItem, index) => {
                        return saleItem.Product.id === purchaseItem.Product.id
                          ? (purchasePrice = purchaseItem.PurchasePrice)
                          : null;
                      });
                      let pamount = purchasePrice * saleItem.Quantity;
                      purchaseAmount += pamount;
                      let samount = saleItem.Quantity * saleItem.Price;
                      amount += samount;
                      profit += samount - pamount;
                    })()
                  : (amount += 0);
                return null;
              });
              salePayment.map((salePayment, index) => {
                sale.id === salePayment.Sale.id
                  ? (paid += salePayment.Amount)
                  : (paid += 0);
                return null;
              });
              amount = Math.ceil(amount - (amount * sale.Discount) / 100);

              due = amount - paid;
              datetime = moment(sale.Date).utc().format("DD MMM YYYY");

              totalAmount += amount;
              totalPaid += paid;
              totalDue += due;
              totalProfit += profit;
              return (
                <tr key={sale.id}>
                  <td>{index}</td>
                  {auth.Role == "admin" ? <td>{sale.Outlet.Name}</td> : null}
                  <td>{sale.InvoiceNumber}</td>
                  <td>{sale.Customer.Name}</td>
                  <td>{datetime}</td>
                  <td>{amount}</td>
                  <td>{paid}</td>
                  <td>{paid === 0 ? "Unpaid" : due === 0 ? "Paid" : due}</td>
                  <td>{profit}</td>
                  <td>
                    <ToastProvider>
                      <Dropdown as={ButtonGroup} size="sm">
                        <InvoicePrintComponent
                          sale={sale}
                          items={saleItems}
                          payments={salePayment}
                          callBack={callBackHandle}
                        />

                        <Dropdown.Toggle
                          split
                          variant="success"
                          id="dropdown-split-basic"
                        />

                        <Dropdown.Menu>
                          <DetailsModalComponent
                            sale={sale}
                            pItems={purchaseItems}
                            sItems={saleItems}
                            payments={salePayment}
                            callBack={callBackHandle}
                          />{" "}
                          <UpdateModalComponent
                            Id={sale.id}
                            callBack={callBackHandle}
                          />{" "}
                          <DeleteModalComponent
                            Id={sale.id}
                            callBack={callBackHandle}
                          />
                        </Dropdown.Menu>
                      </Dropdown>
                    </ToastProvider>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <thead>
            <tr>
              {auth.Role == "admin" ? (
                <th colSpan="5">Total</th>
              ) : (
                <th colSpan="4">Total</th>
              )}
              <th>{totalAmount}</th>
              <th>{totalPaid}</th>
              <th>{totalDue}</th>
              <th>{totalProfit}</th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
