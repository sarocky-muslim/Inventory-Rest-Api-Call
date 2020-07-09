import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import DetailsModal from "./DetailsModal";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const DataTableComponent = (props) => {
  const [dataList, setDataList] = useState([]);
  const { data, searchText } = props;

  useEffect(() => {
    setDataList(
      data.filter((each) => {
        const name = each.Name.toLowerCase();
        const address = each.Address.toLowerCase();
        const number =
          each.number != null ? each.Number.toString().toLowerCase() : "";
        if (
          name.indexOf(searchText) >= 0 ||
          address.indexOf(searchText) >= 0 ||
          number.indexOf(searchText) >= 0
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
              <th>Address</th>
              <th>Number</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((outlet, index) => (
              <tr key={outlet.id}>
                <td>{index}</td>
                <td>{outlet.Name}</td>
                <td>{outlet.Address.substr(0, 50)}</td>
                <td>{outlet.Number}</td>
                <td>
                  <ToastProvider>
                    <DetailsModal Id={outlet.id} callBack={callBackHandle} />{" "}
                    <UpdateModalComponent
                      Id={outlet.id}
                      callBack={callBackHandle}
                    />{" "}
                    <DeleteModalComponent
                      Id={outlet.id}
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
              <th>Address</th>
              <th>Number</th>
              <th>Action</th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
