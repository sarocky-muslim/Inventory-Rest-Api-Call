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
        const sku = each.SKU.toLowerCase();
        const category = each.Category.Name.toLowerCase();
        const brand = each.Brand.Name.toLowerCase();
        const unit = each.Unit.Name.toLowerCase();
        const name = each.Name.toLowerCase();
        const mfg = each.Mfg != null ? each.Mfg.toLowerCase() : "";
        const exp = each.Exp != null ? each.Exp.toLowerCase() : "";
        const details = each.Details != null ? each.Details.toLowerCase() : "";
        if (
          sku.indexOf(searchText) >= 0 ||
          category.indexOf(searchText) >= 0 ||
          brand.indexOf(searchText) >= 0 ||
          unit.indexOf(searchText) >= 0 ||
          name.indexOf(searchText) >= 0
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
        <Table bordered hover size="sm">
          <thead>
            <tr>
              <th>#</th>
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {dataList.map((product, index) => (
              <tr key={product.id}>
                <td>{index}</td>
                <td>{product.SKU}</td>
                <td>{product.Name.substr(0, 50)}</td>
                <td>{product.Category.Name}</td>
                <td>{product.Brand.Name}</td>
                <td>
                  <ToastProvider>
                    <DetailsModal product={product} callBack={callBackHandle} />{" "}
                    <UpdateModalComponent
                      Id={product.id}
                      callBack={callBackHandle}
                    />{" "}
                    <DeleteModalComponent
                      Id={product.id}
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
              <th>SKU</th>
              <th>Name</th>
              <th>Category</th>
              <th>Brand</th>
              <th>Action</th>
            </tr>
          </thead>
        </Table>
      </Col>
    </Row>
  );
};

export default DataTableComponent;
