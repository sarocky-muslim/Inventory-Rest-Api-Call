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
        const name = each.Name.toLowerCase();
        const note = each.Note != null ? each.Note.toLowerCase() : "";
        if (name.indexOf(searchText) >= 0 || note.indexOf(searchText) >= 0) {
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
              <th>About</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((cost, index) => (
              <tr key={cost.id}>
                <td>{index}</td>
                <td>{cost.Name}</td>
                <td>{cost.Note}</td>
                <td>
                  <ToastProvider>
                    <UpdateModalComponent
                      Id={cost.id}
                      callBack={callBackHandle}
                    />{" "}
                    <DeleteModalComponent
                      Id={cost.id}
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
              <th>About</th>
              <th>Action</th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
