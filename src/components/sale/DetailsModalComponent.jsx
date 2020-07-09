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
import CustomerDetailsModal from "../customer/CustomerDetailsModal";
import OutletDetailsModal from "../outlet/DetailsModal";

const DetailsModalComponent = (props) => {
  const [show, setShow] = useState(false);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const { sale, pItems, sItems, payments } = props;
  let i = 0,
    j = 0,
    totalQuantity = 0,
    totalPurchasePrice = 0,
    totalSalePrice = 0,
    totalProfitPrice = 0,
    totalPaymentAmount = 0,
    totalSalePriceDiscount = 0;

  return (
    <>
      {/* <Button variant="info" size="sm" onClick={handleShow}>
        Details
      </Button> */}
      <Dropdown.Item className="bg-info text-light" onClick={handleShow}>
        Details
      </Dropdown.Item>

      <Modal show={show} onHide={handleClose} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            Details Sale of{" "}
            <span className="text-secondary">{sale.InvoiceNumber}</span>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ListGroup variant="flush" className="text-center">
            {/* <ListGroup.Item className="border-0">
              <Row>
                <Col>
                  <h6>Outlet</h6>
                  <OutletDetailsModal Id={sale.Outlet.id} />
                </Col>
                <Col>
                  <h6>Customer</h6>
                  <CustomerDetailsModal Id={sale.Customer.id} />
                </Col>
                <Col>
                  <h6>Date</h6>
                  <p>
                    {moment(sale.Date).utc().format("DD MMM YYYY - hh:mm a")}
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
                  {sItems.map((sItem, index) => {
                    return sale.id === sItem.Sale.id
                      ? (() => {
                          let purchasePrice;
                          pItems.map((pItem, index) => {
                            return pItem.Product.id === sItem.Product.id
                              ? (purchasePrice = pItem.PurchasePrice)
                              : null;
                          });
                          i++;
                          totalQuantity += sItem.Quantity;
                          let purchaseAmount = purchasePrice * sItem.Quantity;
                          totalPurchasePrice += purchaseAmount;
                          let saleAmount = sItem.Price * sItem.Quantity;
                          totalSalePrice += saleAmount;
                          let profitAmount = saleAmount - purchaseAmount;
                          totalProfitPrice += profitAmount;
                          return (
                            <tr key={index}>
                              <td>{i}</td>
                              <td>{sItem.Product.SKU}</td>
                              <td>{purchasePrice}</td>
                              <td>{sItem.Price}</td>
                              <td>{sItem.Quantity}</td>
                              <td>{purchaseAmount}</td>
                              <td>{saleAmount}</td>
                              <td>{profitAmount}</td>
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
                    <th colSpan="5"></th>
                    <th>Discount</th>
                    <th>{sale.Discount} %</th>
                  </tr>
                </tbody>
                <thead>
                  <tr>
                    <th colSpan="5"></th>
                    <th>Total</th>
                    <th>
                      {
                        (totalSalePriceDiscount = Math.ceil(
                          totalSalePrice -
                            (totalSalePrice * sale.Discount) / 100
                        ))
                      }
                    </th>
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
                    return sale.id === payment.Sale.id
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
                    <th>{totalSalePriceDiscount - totalPaymentAmount}</th>
                  </tr>
                </thead>
              </Table>
            </ListGroup.Item>
          </ListGroup>
        </Modal.Body>
        <Modal.Footer></Modal.Footer>
      </Modal>
    </>
  );
};

export default DetailsModalComponent;
