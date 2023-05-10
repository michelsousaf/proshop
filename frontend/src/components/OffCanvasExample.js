import { useState } from "react";
import Button from "react-bootstrap/Button";
import { Offcanvas, OffcanvasHeader, OffcanvasBody } from "react-bootstrap";

function OffCanvasExample() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Launch
      </Button>

      <Offcanvas show={show} onHide={handleClose}>
        <OffcanvasHeader closeButton>
          <Offcanvas.Title>Offcanvas</Offcanvas.Title>
        </OffcanvasHeader>
        <OffcanvasBody>
          Some text as placeholder. In real life you can have the elements you
          have chosen. Like, text, images, lists, etc.
        </OffcanvasBody>
      </Offcanvas>
    </>
  );
}

export default OffCanvasExample;
