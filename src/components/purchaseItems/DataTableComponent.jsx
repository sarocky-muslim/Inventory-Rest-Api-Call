import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const DataTableComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [dataList, setDataList] = useState([]);
  const { data, searchText } = props;
  let totalQty = 0,
    totalPurchase = 0,
    totalSale = 0,
    totalPurAmount = 0,
    totalSalAmount = 0,
    totalProfit = 0;

  useEffect(() => {
    setDataList(
      data.filter((each) => {
        const purchase = each.Purchase.InvoiceNumber.toLowerCase();
        const product = each.Product.SKU.toLowerCase();

        if (auth.Role === "admin") {
          if (
            purchase.indexOf(searchText) >= 0 ||
            product.indexOf(searchText) >= 0
          ) {
            return each;
          }
        } else {
          if (
            each.Purchase.Outlet === auth.Outlet.id &&
            (purchase.indexOf(searchText) >= 0 ||
              product.indexOf(searchText) >= 0)
          ) {
            return each;
          }
        }

        return null;
      })
    );
  }, [data, searchText]);

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
              <th>P. Price</th>
              <th>P. Amount</th>
              <th>S. Price</th>
              <th>S. Amount</th>
              <th>Profit</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((purchaseItem, index) => {
              totalQty += purchaseItem.Quantity;
              totalPurchase += purchaseItem.PurchasePrice;
              let purchaseAmount =
                purchaseItem.Quantity * purchaseItem.PurchasePrice;
              totalPurAmount += purchaseAmount;

              totalSale += purchaseItem.SalePrice;
              let saleAmount = purchaseItem.Quantity * purchaseItem.SalePrice;
              totalSalAmount += saleAmount;
              let profit = saleAmount - purchaseAmount;
              totalProfit += profit;
              return (
                <tr key={purchaseItem.id}>
                  <td>{index}</td>
                  <td>{purchaseItem.Purchase.InvoiceNumber}</td>
                  <td>{purchaseItem.Product.SKU}</td>
                  <td>{purchaseItem.Quantity}</td>
                  <td>{purchaseItem.PurchasePrice}</td>
                  <td>{purchaseAmount}</td>
                  <td>{purchaseItem.SalePrice}</td>
                  <td>{saleAmount}</td>
                  <td>{profit}</td>
                  <td>
                    <ToastProvider>
                      <UpdateModalComponent
                        Id={purchaseItem.id}
                        callBack={callBackHandle}
                      />{" "}
                      <DeleteModalComponent
                        Id={purchaseItem.id}
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
              <th>{totalPurchase}</th>
              <th>{totalPurAmount}</th>
              <th>{totalSale}</th>
              <th>{totalSalAmount}</th>
              <th>{totalProfit}</th>
              <th>Action</th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
