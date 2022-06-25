import React from "react";
import { useState } from "react";
import { Button } from "@progress/kendo-react-buttons";
import ModalRegisterElev from "./ModalRegisterElev";
export default function Elevi() {
  const [show, setShow] = useState(false);
  return (
    <>
      <h1>Bucur-Sabau Maria-Mirabela</h1>
      <ModalRegisterElev show={show} setShow={setShow} />
    </>
  );
}
