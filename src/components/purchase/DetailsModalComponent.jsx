import React, { useState } from "react";
import { NavLink } from "react-router-dom";
import {
  Modal,
  Button,
  ListGroup,
  Row,
  Col,
  Table,
  Dropdown,
} from "react-bootstrap";
import moment from "moment";
import SupplierDetailsModal from "../supplier/SupplierDetailsModal";
import OutletDetailsModal from "../outlet/DetailsModal";

const DetailsModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { purchase, items, payments, costs } = props;
  let i = 0,
    j = 0,
    k = 0,
    totalQuantity = 0,
    totalPurchasePrice = 0,
    totalSalePrice = 0,
    totalProfitPrice = 0,
    totalPaymentAmount = 0,
    totalCostAmount = 0,
    totalPurchasePriceDiscount = 0;

  return (
    <>
      {/* <Button variant="info" size="sm" className="d-block" onClick={handleShow}>
        Details
      </Button> */}
      <Dropdown.Item className="bg-info text-light" onClick={handleShow}>
        Details
      </Dropdown.Item>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Details Purchase of{" "}
            <span className="text-secondary">{purchase.InvoiceNumber}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush" className="text-center">
            {/* <ListGroup.Item className="border-0">
              <Row>
                <Col>
                  <h6>Outlet</h6>
                  <OutletDetailsModal Id={purchase.Outlet.id} />
                </Col>
                <Col>
                  <h6>Supplier</h6>
                  <SupplierDetailsModal Id={purchase.Supplier.id} />
                </Col>
                <Col>
                  <h6>Date</h6>
                  <p>
                    {moment(purchase.Date)
                      .utc()
                      .format("DD MMM YYYY / hh:mm a")}
                  </p>
                </Col>
              </Row>
            </ListGroup.Item> */}
            <ListGroup.Item className="border-0">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>SKU</th>
                    <th>P. Price</th>
                    <th>S. Price</th>
                    <th>Qty</th>
                    <th>P. Amount</th>
                    <th>S. Amount</th>
                    <th>Profit</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    return purchase.id === item.Purchase.id
                      ? (() => {
                          i++;

                          let purchaseAmount =
                            item.PurchasePrice * item.Quantity;
                          let saleAmount = item.SalePrice * item.Quantity;
                          let profitPrice = saleAmount - purchaseAmount;

                          totalQuantity += item.Quantity;
                          totalPurchasePrice += purchaseAmount;
                          totalSalePrice += saleAmount;
                          totalProfitPrice += profitPrice;

                          return (
                            <tr key={index}>
                              <td>{i}</td>
                              <td>{item.Product.SKU}</td>
                              <td>{item.PurchasePrice}</td>
                              <td>{item.SalePrice}</td>
                              <td>{item.Quantity}</td>
                              <td>{purchaseAmount}</td>
                              <td>{saleAmount}</td>
                              <td>{profitPrice}</td>
                            </tr>
                          );
                        })()
                      : (() => {
                          return null;
                        })();
                  })}
                  <tr>
                    <th colSpan="4">Total</th>
                    <th>{totalQuantity}</th>
                    <th>{totalPurchasePrice}</th>
                    <th>{totalSalePrice}</th>
                    <th>{totalProfitPrice}</th>
                  </tr>
                  <tr>
                    <th colSpan="4"></th>
                    <th>Discount</th>
                    <th>{purchase.Discount} %</th>
                    <th colSpan="2"></th>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <th colSpan="4"></th>
                    <th>Total</th>
                    <th>
                      {
                        (totalPurchasePriceDiscount = Math.ceil(
                          totalPurchasePrice -
                            (totalPurchasePrice * purchase.Discount) / 100
                        ))
                      }
                    </th>
                    <th colSpan="2"></th>
                  </tr>
                </thead>
              </Table>
            </ListGroup.Item>
            <ListGroup.Item className="border-0">
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Payment</th>
                    <th>Date</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {payments.map((payment, index) => {
                    return purchase.id === payment.Purchase.id
                      ? (() => {
                          j++;
                          totalPaymentAmount += payment.Amount;
                          return (
                            <tr key={index}>
                              <td>{j}</td>
                              <td>
                                {moment(payment.Date)
                                  .utc()
                                  .format("DD MMM YYYY / hh:mm a")}
                              </td>
                              <td>{payment.Amount}</td>
                            </tr>
                          );
                        })()
                      : (() => {
                          return null;
                        })();
                  })}
                </tbody>
                <thead>
                  <tr>
                    <th colSpan="2">Total</th>
                    <th>{totalPaymentAmount}</th>
                  </tr>
                  <tr>
                    <th colSpan="2">Due</th>
                    <th>{totalPurchasePriceDiscount - totalPaymentAmount}</th>
                  </tr>
                </thead>
              </Table>
            </ListGroup.Item>
            {/* <ListGroup.Item>
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>Cost</th>
                    <th>Name</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {costs.map((cost, index) => {
                    return purchase.id === cost.Purchase.id
                      ? (() => {
                          k++;
                          totalCostAmount += cost.Amount;
                          return (
                            <tr key={index}>
                              <td>{k}</td>
                              <td>{cost.Cost.Name}</td>
                              <td>{cost.Amount}</td>
                            </tr>
                          );
                        })()
                      : (() => {
                          return null;
                        })();
                  })}
                </tbody>
                <thead>
                  <tr>
                    <th colSpan="2">Total</th>
                    <th>{totalCostAmount}</th>
                  </tr>
                  <tr>
                    <th colSpan="3">
                      Total Cost ={" "}
                      {totalPurchasePriceDiscount + totalCostAmount}
                    </th>
                  </tr>
                </thead>
              </Table>
            </ListGroup.Item> */}
          </ListGroup>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default DetailsModalComponent;
