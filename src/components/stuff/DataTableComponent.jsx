import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const DataTableComponent = (props) => {
  const [auth, setAuth] = useState(JSON.parse(localStorage.getItem("auth")));
  const [dataList, setDataList] = useState([]);
  const { data, searchText } = props;

  useEffect(() => {
    setDataList(
      data.filter((each) => {
        if (each.Role === "stuff" && auth.Outlet.id === each.Outlet) {
          const name = each.Name.toLowerCase();
          const email = each.Email.toLowerCase();
          if (name.indexOf(searchText) >= 0 || email.indexOf(searchText) >= 0) {
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
              <th>Name</th>
              <th>Email</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((stuff, index) => (
              <tr key={stuff.id}>
                <td>{index}</td>
                <td>{stuff.Name}</td>
                <td>{stuff.Email}</td>
                <td>
                  {/* <UpdateModalComponent
                      Id={stuff.id}
                      callBack={callBackHandle}
                    />{" "} */}
                  <DeleteModalComponent
                    Id={stuff.id}
                    callBack={callBackHandle}
                  />
                </td>
              </tr>
            ))}
          </tbody>
          <thead>
            <tr>
              <th>#</th>
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
