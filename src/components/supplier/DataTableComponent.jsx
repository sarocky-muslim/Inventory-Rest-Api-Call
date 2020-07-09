import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import SupplierDetailsModal from "./SupplierDetailsModal";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const DataTableComponent = (props) => {
  const [dataList, setDataList] = useState([]);
  const { data, searchText } = props;

  useEffect(() => {
    setDataList(
      data.filter((each) => {
        const company = each.Company.toLowerCase();
        const owner = each.Owner != null ? each.Owner.toLowerCase() : "";
        const number =
          each.Number != null ? each.Number.toString().toLowerCase() : "";
        const email = each.Email != null ? each.Email.toLowerCase() : "";
        const address = each.Address != null ? each.Address.toLowerCase() : "";
        const note = each.Note != null ? each.Note.toLowerCase() : "";
        if (
          company.indexOf(searchText) >= 0 ||
          owner.indexOf(searchText) >= 0 ||
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
              <th>Company</th>
              <th>Number</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((supplier, index) => (
              <tr key={supplier.id}>
                <td>{index}</td>
                <td>{supplier.Company}</td>
                <td>{supplier.Number}</td>
                <td>{supplier.Email}</td>
                <td>
                  <ToastProvider>
                    <SupplierDetailsModal
                      Id={supplier.id}
                      callBack={callBackHandle}
                    />{" "}
                    <UpdateModalComponent
                      Id={supplier.id}
                      callBack={callBackHandle}
                    />{" "}
                    <DeleteModalComponent
                      Id={supplier.id}
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
              <th>Company</th>
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
