import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import {
  Table,
  Button,
  Row,
  Col,
  // Collapse,
  Dropdown,
  // Container,
  // Form,
} from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listOrders } from "../actions/orderActions";
import Page from "../components/Pages";
import { ExportCSV } from "../components/exportToCSV";
import OffCanvasExample from "../components/OffCanvasExample";
// import { Offcanvas } from "react-bootstrap/Offcanvas";

function OrderListScreen({ history }) {
  const dispatch = useDispatch();

  // const [email, setEmail] = useState("");
  // const [orderId, setOrderId] = useState("");

  const orderList = useSelector((state) => state.orderList);
  const {
    loading,
    error,
    orders,
    // pages,
    page,
    // has_previous,
    // has_next,
    total_items,
  } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  let keyword = history.location.search;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders(keyword));
      // dispatch(listVesselSchedules());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo, keyword]);

  function handlePageChange(pageNumber) {
    if (keyword) {
      keyword = keyword.split("?keyword=")[1].split("&")[0];
    }
    history.push(`/admin/orderlist/?keyword=${keyword}&page=${pageNumber}`);
  }

  // console.log("email", filters);

  return (
    <div>
      {/* <OffCanvasExample /> */}
      <Row className="align-items-center">
        <Col>
          <h1>Orders</h1>
        </Col>

        <Col className="text-right">
          <Dropdown>
            <Dropdown.Toggle variant="success" id="dropdown-basic">
              Actions
            </Dropdown.Toggle>

            <Dropdown.Menu>
              <ExportCSV csvData={orders} fileName={"orders"} />
              <Dropdown.Item>Export With Filters</Dropdown.Item>
            </Dropdown.Menu>
          </Dropdown>
        </Col>
      </Row>

      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Table
            filterable
            filterBy={["id_", "isPaid"]}
            striped
            bordered
            hover
            responsive
            className="table-sm"
          >
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>Total</th>
                <th>PAID</th>
                <th>DELIVERED</th>
                <th></th>
                <th></th>
              </tr>
            </thead>

            <tbody>
              {orders.map((order) => (
                <tr key={order._id}>
                  <td>{order._id}</td>
                  <td>{order.user && order.user.name}</td>
                  <td>{order.createdAt.substring(0, 10)}</td>
                  <td>${order.totalPrice}</td>

                  <td>
                    {order.isPaid ? (
                      order.paidAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-check" style={{ color: "red" }}></i>
                    )}
                  </td>

                  <td>
                    {order.isDelivered ? (
                      order.deliveredAt.substring(0, 10)
                    ) : (
                      <i className="fas fa-check" style={{ color: "red" }}></i>
                    )}
                  </td>

                  <td>
                    <LinkContainer to={`/order/${order._id}`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                  <td>
                    <i
                      className="fas fa-edit"
                      // onClick={() => setShow(true)}
                    ></i>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          {undefined === page ? (
            <Loader />
          ) : error ? (
            <Message variant="danger">{error}</Message>
          ) : (
            <Page
              className="pagination-bar"
              currentPage={page}
              totalCount={total_items}
              pageSize={20}
              onPageChange={(page) => handlePageChange(page)}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default OrderListScreen;
