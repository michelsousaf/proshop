import React, { useState, useEffect } from "react";
import { LinkContainer } from "react-router-bootstrap";
import { Table, Button } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import Loader from "../components/Loader";
import Message from "../components/Message";
import { listOrders } from "../actions/orderActions";
import PaginateGeneric from "../components/PaginateGeneric";
import Pagination from "react-bootstrap/Pagination";

function OrderListScreen({ history }) {
  const dispatch = useDispatch();

  const [currentPage, setCurrentPage] = useState(1);

  const orderList = useSelector((state) => state.orderList);
  const {
    loading,
    error,
    orders,
    pages,
    page,
    has_previous,
    has_next,
  } = orderList;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  let keyword = history.location.search;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      dispatch(listOrders(keyword));
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

  return (
    <div>
      <h1>Orders</h1>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : (
        <div>
          <Table striped bordered hover responsive className="table-sm">
            <thead>
              <tr>
                <th>ID</th>
                <th>USER</th>
                <th>DATE</th>
                <th>Total</th>
                <th>PAID</th>
                <th>DELIVERED</th>
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
                </tr>
              ))}
            </tbody>
          </Table>
          <Pagination>
            <Pagination.First onClick={() => handlePageChange(1)} />
            <Pagination.Prev
              onClick={() => handlePageChange(Math.max(page - 1, 1))}
              disabled={!has_previous}
            />
            {Array.from({ length: pages }, (_, i) => (
              <Pagination.Item
                key={i + 1}
                active={i + 1 === page}
                onClick={() => handlePageChange(i + 1)}
              >
                {i + 1}
              </Pagination.Item>
            ))}
            <Pagination.Next
              onClick={() => handlePageChange(Math.min(page + 1, pages))}
              disabled={!has_next}
            />
            <Pagination.Last
              onClick={() => handlePageChange(pages)}
              disabled={!has_next}
            />
          </Pagination>
          {/* <PaginateGeneric
            pages={pages}
            page={page}
            navegation={"/admin/orderlist/"}
          /> */}
        </div>
      )}
    </div>
  );
}

export default OrderListScreen;
