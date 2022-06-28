import React from "react";
import {
  Button,
  Header,
  Image,
  Modal,
  Divider,
  Accordion,
  Icon,
} from "semantic-ui-react";
import { useState } from "react";
import { Materii } from "./data";
import AddProfesor from "./AddProfesor";
function ModalProfilProfesor({ show, setShow, profesorData, setStudentData }) {
  const [activeIndex, setActiveIndex] = useState();
  const [open, setOpen] = useState(false);
  const handleAccordion = (value) => {
    if (activeIndex === value) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(value);
  };
  return (
    <Modal
      onClose={() => setShow(false)}
      onOpen={() => setShow(true)}
      open={show}
      size={"small"}
    >
      <AddProfesor
        show={open}
        setShow={setOpen}
        numeDeFamilieDefault={profesorData?.numeDeFamilie}
        prenumeDefault={profesorData?.prenume}
        anDefault={profesorData?.an}
        lunaDefault={profesorData?.luna}
        ziDefault={profesorData?.zi}
        localitateDefault={profesorData?.localitatea}
        materiiDefault={profesorData?.materii}
      />
      <Modal.Header>Detalii Profesor</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Header>
            {profesorData?.prenume + " " + profesorData?.numeDeFamilie}
          </Header>
          <h6>Date personale</h6>
          <div style={{ paddingLeft: "4vw" }}>
            <ul>
              <li>
                Data de nastere:{" "}
                {profesorData?.zi +
                  "/" +
                  profesorData?.luna +
                  "/" +
                  profesorData?.an}
              </li>
              <li>Localitatea: {profesorData?.localitatea}</li>
              <li>
                Materii: {profesorData?.materii.map((materie) => materie + " ")}
              </li>
            </ul>
          </div>
        </Modal.Description>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content="Editeaza Profil"
          labelPosition="right"
          icon="edit"
          onClick={() => setOpen(true)}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default ModalProfilProfesor;
