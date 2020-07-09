import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const DataTableComponent = (props) => {
  const [dataList, setDataList] = useState([]);
  const { data, searchText } = props;
  let totalAmount = 0;

  useEffect(() => {
    setDataList(
      data.filter((each) => {
        const purchase = each.Purchase.InvoiceNumber.toLowerCase();
        const cost = each.Cost.Name.toLowerCase();
        const amount = each.Amount.toString().toLowerCase();
        if (
          purchase.indexOf(searchText) >= 0 ||
          cost.indexOf(searchText) >= 0 ||
          amount.indexOf(searchText) >= 0
        ) {
          return each;
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
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Invoice</th>
              <th>Cost</th>
              <th>Amount</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((purchaseCost, index) => {
              totalAmount += purchaseCost.Amount;
              return (
                <tr key={purchaseCost.id}>
                  <td>{index}</td>
                  <td>{purchaseCost.Purchase.InvoiceNumber}</td>
                  <td>{purchaseCost.Cost.Name}</td>
                  <td>{purchaseCost.Amount}</td>
                  <td>
                    <ToastProvider>
                      <UpdateModalComponent
                        Id={purchaseCost.id}
                        callBack={callBackHandle}
                      />{" "}
                      <DeleteModalComponent
                        Id={purchaseCost.id}
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
              <th>{totalAmount}</th>
              <th>Action</th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
