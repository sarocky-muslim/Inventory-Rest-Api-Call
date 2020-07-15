import React, { useState, useRef, useEffect } from "react";
import {
  Modal,
  Button,
  ListGroup,
  Row,
  Col,
  Table,
  Navbar,
  Nav,
  NavLink,
} from "react-bootstrap";
import moment from "moment";
import { useReactToPrint } from "react-to-print";
import ReactToPdf from "react-to-pdf";

const InvoicePrintComponent = (props) => {
  const [show, setShow] = useState(false);
  const [totalPaid, setTotalPaid] = useState(0);
  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);
  const componentRef = useRef();
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });
  const { sale, items, payments } = props;
  let i = 0,
    totalPurchasePrice = 0,
    totalSalePrice = 0,
    total = 0;

  const paidAmount = () => {
    let totalPaidAmount = 0;
    payments.map((payment, index) => {
      if (sale.id === payment.Sale.id) {
        totalPaidAmount += payment.Amount;
      }
    });
    setTotalPaid(totalPaidAmount);
  };

  useEffect(() => {
    paidAmount();
  });

  return (
    <>
      <Button variant="dark" size="sm" onClick={handleShow}>
        Invoice
      </Button>

      <Modal show={show} onHide={handleClose} size="lg">
        <Navbar bg="secondary" variant="dark" className="w-100">
          <Navbar.Brand as={NavLink} to="/purchase">
            Print Preview
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ml-auto">
              <Nav.Link onClick={handlePrint}>Print</Nav.Link>
              <ReactToPdf targetRef={componentRef} filename="invoice.pdf">
                {({ toPdf }) => <Nav.Link onClick={toPdf}>PDF</Nav.Link>}
              </ReactToPdf>
              <Nav.Link onClick={handleClose}>Close</Nav.Link>
            </Nav>
          </Navbar.Collapse>
        </Navbar>
        <Modal.Body className="p-5" ref={componentRef}>
          <Row>
            <Col>
              <ListGroup variant="flush" className="text-center">
                <ListGroup.Item className="p-1">
                  <h5 className="text-center">My Company Name</h5>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 p-1">
                  <span>Outlet:</span> <span>{sale.Outlet.Name}</span>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 p-1">
                  <span>Number:</span> <span>{sale.Outlet.Number}</span>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 p-1">
                  <span>Email:</span> <span>{sale.Outlet.Email}</span>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 p-1">
                  <span>Address:</span> <span>{sale.Outlet.Address}</span>
                </ListGroup.Item>
              </ListGroup>
            </Col>
            <Col>
              <ListGroup variant="flush" className="text-center">
                <ListGroup.Item className="p-1">
                  <h5 className="text-center">INVOICE</h5>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 p-1">
                  <span>Customer Id:</span> <span>{sale.Customer.id}</span>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 p-1">
                  <span>Invoice No:</span> <span>{sale.InvoiceNumber}</span>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 p-1">
                  <span>Issue:</span>{" "}
                  <span>{moment().format("DD MMM YYYY - hh:mm a")}</span>
                </ListGroup.Item>
                <ListGroup.Item className="border-0 p-1">
                  <span>Sale:</span>{" "}
                  <span>
                    {moment(sale.Date).utc().format("DD MMM YYYY - hh:mm a")}
                  </span>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
          <hr />
          <Row>
            <Col>
              <h5 className="text-center">Product List</h5>
              <Table bordered hover size="sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Product</th>
                    <th>Quantity</th>
                    <th>Price</th>
                    <th>Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    return sale.id === item.Sale.id
                      ? (() => {
                          i++;
                          totalSalePrice += item.Price * item.Quantity;
                          return (
                            <tr key={index}>
                              <td>{i}</td>
                              <td>{item.Product.Name}</td>
                              <td>{item.Quantity}</td>
                              <td>{item.Price}</td>
                              <td>{item.Price * item.Quantity}</td>
                            </tr>
                          );
                        })()
                      : (() => {
                          return null;
                        })();
                  })}
                </tbody>
              </Table>
            </Col>
          </Row>
          <Row>
            <Col></Col>
            <Col>
              <ListGroup variant="flush">
                <ListGroup.Item className="p-1">
                  <Row>
                    <Col>
                      <strong>Subtotal</strong>
                    </Col>
                    <Col>{totalSalePrice}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="p-1">
                  <Row>
                    <Col>
                      <strong>Discount</strong>
                    </Col>
                    <Col>{sale.Discount} %</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="p-1">
                  <Row>
                    <Col>
                      <strong>Total</strong>
                    </Col>
                    <Col>
                      {
                        (total = Math.ceil(
                          totalSalePrice -
                            (totalSalePrice * sale.Discount) / 100
                        ))
                      }
                    </Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="p-1">
                  <Row>
                    <Col>
                      <strong>Paid</strong>
                    </Col>
                    <Col>{totalPaid}</Col>
                  </Row>
                </ListGroup.Item>
                <ListGroup.Item className="p-1">
                  <Row>
                    <Col>
                      <strong>Due</strong>
                    </Col>
                    <Col>{total - totalPaid}</Col>
                  </Row>
                </ListGroup.Item>
              </ListGroup>
            </Col>
          </Row>
        </Modal.Body>
        <Modal.Footer className="text-center">
          <div className="m-auto">
            <div>
              If you have any question about this invoice, please contact us.
            </div>
            <h6>Thank you, stay connected with us.</h6>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default InvoicePrintComponent;
