import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const DataTableComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [dataList, setDataList] = useState([]);
  const { pItems, sItems, searchText } = props;
  let totalQty = 0,
    totalSale = 0,
    totalAmount = 0;

  useEffect(() => {
    setDataList(
      sItems.filter((each) => {
        const sale = each.Sale.InvoiceNumber.toLowerCase();
        const product = each.Product.SKU.toLowerCase();
        if (auth.Role === "admin") {
          if (
            sale.indexOf(searchText) >= 0 ||
            product.indexOf(searchText) >= 0
          ) {
            return each;
          }
        } else {
          if (
            each.Sale.Outlet === auth.Outlet.id &&
            (sale.indexOf(searchText) >= 0 || product.indexOf(searchText) >= 0)
          ) {
            return each;
          }
        }

        return null;
      })
    );
  }, [sItems, searchText]);

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
              <th>SKU</th>
              <th>Qty</th>
              <th>Sale</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((saleItem, index) => {
              totalQty += saleItem.Quantity;
              totalSale += saleItem.Price;
              let amount = saleItem.Quantity * saleItem.Price;
              totalAmount += amount;
              return (
                <tr key={saleItem.id}>
                  <td>{index}</td>
                  <td>{saleItem.Sale.InvoiceNumber}</td>
                  <td>{saleItem.Product.SKU}</td>
                  <td>{saleItem.Quantity}</td>
                  <td>{saleItem.Price}</td>
                  <td>{amount}</td>
                  <td>
                    <ToastProvider>
                      <UpdateModalComponent
                        pItems={pItems}
                        sItems={sItems}
                        sItem={saleItem}
                        callBack={callBackHandle}
                      />{" "}
                      <DeleteModalComponent
                        Id={saleItem.id}
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
              <th colSpan="3">Total</th>
              <th>{totalQty}</th>
              <th>{totalSale}</th>
              <th>{totalAmount}</th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
