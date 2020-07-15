import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const DataTableComponent = (props) => {
  const [dataList, setDataList] = useState([]);
  const { data, searchText } = props;

  useEffect(() => {
    setDataList(
      data.filter((each) => {
        if (each.Role === "manager") {
          const outlet = each.Outlet.Name.toLowerCase();
          const name = each.Name.toLowerCase();
          const email = each.Email.toLowerCase();

          if (
            outlet.indexOf(searchText) >= 0 ||
            name.indexOf(searchText) >= 0 ||
            email.indexOf(searchText) >= 0
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
        <Table bordered hover>
          <thead>
            <tr>
              <th>#</th>
              <th>Outlet</th>
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((manager, index) => (
              <tr key={manager.id}>
                <td>{index}</td>
                <td>{manager.Outlet.Name}</td>
                <td>{manager.Name}</td>
                <td>{manager.Email}</td>
                <td>
                  {/* <UpdateModalComponent
                      Id={manager.id}
                      callBack={callBackHandle}
                    />{" "} */}
                  <DeleteModalComponent
                    Id={manager.id}
                    callBack={callBackHandle}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <thead>
            <tr>
              <th>#</th>
              <th>Outlet</th>
              <th>Name</th>
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
