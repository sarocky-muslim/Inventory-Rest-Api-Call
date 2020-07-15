import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import DetailsModalComponent from "./DetailsModalComponent";
import InvoicePrintComponent from "./InvoicePrintComponent";
import {
  Row,
  Col,
  Table,
  Dropdown,
  ButtonGroup,
  Button,
} from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";
import moment from "moment";

const DataTableComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [dataList, setDataList] = useState([]);
  const { data, purchaseItems, purchasePayment, purchaseCost, filter } = props;
  let totalAmount = 0,
    totalPaid = 0,
    totalDue = 0,
    totalCost = 0,
    totalSubTotalCost = 0;

  useEffect(() => {
    setDataList(
      data.filter((each) => {
        const outlet = each.Outlet.Name.toLowerCase();
        const invoiceNumber = each.InvoiceNumber.toLowerCase();
        const supplier = each.Supplier.Company.toLowerCase();
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
            supplier.indexOf(filter) >= 0 ||
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
              supplier.indexOf(filter) >= 0 ||
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
              <th>Supplier</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Paid</th>
              <th>Due</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((purchase, index) => {
              let amount = 0,
                paid = 0,
                due = 0,
                cost = 0,
                subTotalCost = 0;

              let datetime = "";

              purchaseItems.map((purchaseItem, index) => {
                purchase.id === purchaseItem.Purchase.id
                  ? (amount +=
                      purchaseItem.Quantity * purchaseItem.PurchasePrice)
                  : (amount += 0);
                return null;
              });
              purchasePayment.map((purchasePayment, index) => {
                purchase.id === purchasePayment.Purchase.id
                  ? (paid += purchasePayment.Amount)
                  : (paid += 0);
                return null;
              });
              purchaseCost.map((purchaseCost, index) => {
                purchase.id === purchaseCost.Purchase.id
                  ? (cost += purchaseCost.Amount)
                  : (cost += 0);
                return null;
              });
              amount = Math.ceil(amount - (amount * purchase.Discount) / 100);
              due = amount - paid;
              subTotalCost = amount + cost;
              datetime = moment(purchase.Date).utc().format("DD MMM YYYY");
              totalAmount += amount;
              totalPaid += paid;
              totalDue += due;
              totalCost += cost;
              totalSubTotalCost += subTotalCost;
              return (
                <tr key={purchase.id}>
                  <td>{index}</td>
                  {auth.Role == "admin" ? (
                    <td>{purchase.Outlet.Name}</td>
                  ) : null}

                  <td>{purchase.InvoiceNumber}</td>
                  <td>{purchase.Supplier.Company}</td>
                  <td>{datetime}</td>
                  <td>{amount}</td>
                  <td>{paid}</td>
                  <td>{paid === 0 ? "Unpaid" : due === 0 ? "Paid" : due}</td>
                  <td>
                    <ToastProvider>
                      <Dropdown as={ButtonGroup} size="sm">
                        <InvoicePrintComponent
                          purchase={purchase}
                          items={purchaseItems}
                          payments={purchasePayment}
                          costs={purchaseCost}
                          callBack={callBackHandle}
                        />

                        <Dropdown.Toggle
                          split
                          variant="success"
                          id="dropdown-split-basic"
                        />

                        <Dropdown.Menu>
                          <DetailsModalComponent
                            purchase={purchase}
                            items={purchaseItems}
                            payments={purchasePayment}
                            costs={purchaseCost}
                            callBack={callBackHandle}
                          />
                          <UpdateModalComponent
                            Id={purchase.id}
                            callBack={callBackHandle}
                          />
                          <DeleteModalComponent
                            Id={purchase.id}
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
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
