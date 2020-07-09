import React, { useState, useEffect } from "react";
import DeleteModalComponent from "./DeleteModalComponent";
import UpdateModalComponent from "./UpdateModalComponent";
import { Row, Col, Table } from "react-bootstrap";
import { ToastProvider } from "react-toast-notifications";

const DataTableComponent = (props) => {
  const [dataList, setDataList] = useState([]);
  const { data, searchText } = props;

  useEffect(() => {
    console.log("Category Datatable");
    console.log(searchText);
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
            {dataList.map((outlet, index) => (
              <tr key={outlet.id}>
                <td>{index}</td>
                <td>{outlet.Name}</td>
                <td>{outlet.Note}</td>
                <td>
                  <ToastProvider>
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
