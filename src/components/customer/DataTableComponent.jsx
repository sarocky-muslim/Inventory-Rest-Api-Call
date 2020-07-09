import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import CustomerDetailsModal from "./CustomerDetailsModal";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const DataTableComponent = (props) => {
  const [dataList, setDataList] = useState([]);
  const { data, searchText } = props;

  useEffect(() => {
    setDataList(
      data.filter((each) => {
        const name = each.Name.toLowerCase();
        const number = each.Number.toString().toLowerCase();
        const email = each.Email != null ? each.Email.toLowerCase() : "";
        const address = each.Address != null ? each.Address.toLowerCase() : "";
        const note = each.Note != null ? each.Note.toLowerCase() : "";
        if (
          name.indexOf(searchText) >= 0 ||
          number.indexOf(searchText) >= 0 ||
          email.indexOf(searchText) >= 0 ||
          address.indexOf(searchText) >= 0 ||
          note.indexOf(searchText) >= 0
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
              <th>Name</th>
              <th>Number</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((customer, index) => (
              <tr key={customer.id}>
                <td>{index}</td>
                <td>{customer.Name}</td>
                <td>{customer.Number}</td>
                <td>{customer.Email}</td>
                <td>
                  <ToastProvider>
                    <CustomerDetailsModal
                      Id={customer.id}
                      callBack={callBackHandle}
                    />{" "}
                    <UpdateModalComponent
                      Id={customer.id}
                      callBack={callBackHandle}
                    />{" "}
                    <DeleteModalComponent
                      Id={customer.id}
                      callBack={callBackHandle}
                    />
                  </ToastProvider>
                </td>
              </tr>
            ))}
          </tbody>
          <thead>
            <tr>
              <th>#</th>
              <th>Name</th>
              <th>Number</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
