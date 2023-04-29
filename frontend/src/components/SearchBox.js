import React, { useState } from "react";
import { Button, Form } from "react-bootstrap";
import { useHistory, useLocation } from "react-router-dom";

function SearchBox() {
  const [keyword, setKeyword] = useState("");

  let history = useHistory();
  const location = useLocation();
  const pathname = location.pathname;
  //   const pathname = history.location.pathname;
  console.log(window.location.pathname);

  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword) {
      if (history) {
        if (history.location.pathname === "/") {
          history.push(`/?keyword=${keyword}&page=1`);
        } else {
          history.push(`${pathname}/?keyword=${keyword}&page=1`);
        }
      }
    } else {
      history.push(history.push(history.location.pathname));
    }
  };
  return (
    <Form onSubmit={submitHandler} inline>
      <Form.Control
        type="text"
        name="q"
        onChange={(e) => setKeyword(e.target.value)}
        className="mr-sm-2 ml-sm-5"
      ></Form.Control>

      <Button type="submit" variant="outline-success" className="p-2">
        Submit
      </Button>
    </Form>
  );
}

export default SearchBox;
