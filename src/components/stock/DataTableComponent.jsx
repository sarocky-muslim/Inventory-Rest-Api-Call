import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const DataTableComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [dataList, setDataList] = useState([]);
  const { products, pItems, sItems, searchText } = props;
  let totalPrice = 0,
    totalpQty = 0,
    totalsQty = 0,
    totalstQty = 0,
    totalAmount = 0,
    i = 1;

  useEffect(() => {
    setDataList(
      products.filter((each) => {
        const sku = each.SKU.toLowerCase();
        const name = each.Name.toLowerCase();
        if (sku.indexOf(searchText) >= 0 || name.indexOf(searchText) >= 0) {
          return each;
        }
        return null;
      })
    );
  }, [products, searchText]);

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
              <th>SKU</th>
              <th>product</th>
              <th>Price</th>
              <th>Purchase</th>
              <th>Sale</th>
              <th>Stock</th>
              <th>Amount</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((product, index) => {
              let purchasePrice = 0;
              let purchaseQty = 0;
              let saleQty = 0;
              let stockQty = 0;
              let amount = 0;
              if (auth.Role === "admin") {
                pItems.map((pItem, index) => {
                  return product.id === pItem.Product.id
                    ? (() => {
                        purchasePrice = pItem.PurchasePrice;
                        purchaseQty += pItem.Quantity;
                      })()
                    : null;
                });
                sItems.map((sItem, index) => {
                  return product.id === sItem.Product.id
                    ? (() => {
                        saleQty += sItem.Quantity;
                      })()
                    : null;
                });
              } else {
                pItems.map((pItem, index) => {
                  return product.id === pItem.Product.id &&
                    pItem.Purchase.Outlet === auth.Outlet.id
                    ? (() => {
                        purchasePrice = pItem.PurchasePrice;
                        purchaseQty += pItem.Quantity;
                      })()
                    : null;
                });
                sItems.map((sItem, index) => {
                  return product.id === sItem.Product.id &&
                    sItem.Sale.Outlet === auth.Outlet.id
                    ? (() => {
                        saleQty += sItem.Quantity;
                      })()
                    : null;
                });
              }

              stockQty = purchaseQty - saleQty;
              amount = stockQty * purchasePrice;
              totalPrice += purchasePrice;
              totalpQty += purchaseQty;
              totalsQty += saleQty;
              totalstQty += stockQty;
              totalAmount += amount;
              return purchasePrice != 0 ? (
                <tr key={product.id}>
                  <th>{i++}</th>
                  <td>{product.SKU}</td>
                  <td>{product.Name.substr(0, 50)}</td>
                  <td>{purchasePrice}</td>
                  <td>{purchaseQty}</td>
                  <td>{saleQty}</td>
                  <td>{stockQty}</td>
                  <td>{amount}</td>
                </tr>
              ) : null;
            })}
          </tbody>
          <thead>
            <tr>
              <th colSpan="3">Total</th>
              <th>{totalPrice}</th>
              <th>{totalpQty}</th>
              <th>{totalsQty}</th>
              <th>{totalstQty}</th>
              <th>{totalAmount}</th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
