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
import { listVesselSchedules } from "../actions/orderActions";

function OrderListScreen({ history }) {
  const dispatch = useDispatch();

  // const [email, setEmail] = useState("");
  // const [orderId, setOrderId] = useState("");

  const listVessels = useSelector((state) => state.listVessels);
  const { loading, vessels, error } = listVessels;

  const userLogin = useSelector((state) => state.userLogin);
  const { userInfo } = userLogin;

  let keyword = history.location.search;

  const schedule = vessels ? vessels.vesselCalls : null;

  // if (!Array.isArray(vessels)) {
  //   return <div>Invalid items</div>;
  // }
  // if (!vessels.length) {
  //   return <div>No items</div>;
  // }

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      // dispatch(listOrders(keyword));
      dispatch(listVesselSchedules());
    } else {
      history.push("/login");
    }
  }, [dispatch, history, userInfo, keyword]);

  console.log(vessels);

  return (
    <div>
      <Row className="align-items-center">
        <Col>
          <h1>Vessel Schedule for </h1>
        </Col>
      </Row>
      {loading ? (
        <Loader />
      ) : error ? (
        <Message variant="danger">{error}</Message>
      ) : schedule ? (
        <div>
          {" "}
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
                <th>Port</th>
                <th>Terminal</th>
                <th>Arrival Date</th>
                <th>Departure Date</th>
                <th>Country</th>
                <th>City</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {schedule.map((vesselCalls, index) => (
                <tr key={index}>
                  <td>{vesselCalls.facility.portName}</td>
                  <td>{vesselCalls.facility.locationName}</td>
                  <td>{vesselCalls.callSchedules[0].classifierDateTime}</td>
                  <td>{vesselCalls.callSchedules[1].classifierDateTime}</td>
                  <td>{vesselCalls.facility.countryName}</td>
                  <td>{vesselCalls.facility.cityName}</td>
                  <td>
                    <LinkContainer to={`/order/}`}>
                      <Button variant="light" className="btn-sm">
                        Details
                      </Button>
                    </LinkContainer>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </div>
      ) : (
        <Loader />
      )}
    </div>
  );
}

export default OrderListScreen;
