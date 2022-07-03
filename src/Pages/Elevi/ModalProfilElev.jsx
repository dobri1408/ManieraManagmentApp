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
import { getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import AddElev from "./AddElev";
function ModalProfilElev({ show, setShow, studentData, setStudentData }) {
  const [activeIndex, setActiveIndex] = useState();
  const [Materii, setMaterii] = useState([]);
  const [open, setOpen] = useState(false);
  console.log({ studentData });
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
      <AddElev
        show={open}
        setShow={setOpen}
        materiiDefault={Object.keys({ ...studentData?.pregatiri })}
        pregatiriDefault={studentData?.pregatiri}
        liceuDefault={studentData?.liceu}
        numeDeFamilieDefault={studentData?.numeDeFamilie}
        prenumeDefault={studentData?.prenume}
        anDefault={studentData?.an}
        lunaDefault={studentData?.luna}
        ziDefault={studentData?.zi}
        localitateDefault={studentData?.localitatea}
        clasaDefault={studentData?.clasa}
      />
      <Modal.Header>Detalii Elev</Modal.Header>
      <Modal.Content image>
        <Modal.Description>
          <Header>
            {studentData?.prenume + " " + studentData?.numeDeFamilie}
          </Header>
          <h6>Date personale</h6>
          <div style={{ paddingLeft: "4vw" }}>
            <ul>
              <li>
                Data de nastere:{" "}
                {studentData?.zi +
                  "/" +
                  studentData?.luna +
                  "/" +
                  studentData?.an}
              </li>
              <li>
                Liceu: {studentData?.liceu + " " + studentData?.localitatea}
              </li>
              <li>Clasa: {studentData?.clasa}</li>
            </ul>
          </div>
          <h6>Pregatiri in cadru Maniera</h6>
          <div>
            <Accordion styled>
              {
                //e obiect
                Object.entries({ ...studentData?.pregatiri }).map(
                  ([materie, value], index) => {
                    return (
                      <>
                        <Accordion.Title
                          active={activeIndex === index}
                          index={0}
                          onClick={() => {
                            handleAccordion(index);
                          }}
                        >
                          <Icon name="dropdown" />
                          {materie}
                        </Accordion.Title>
                        <Accordion.Content active={activeIndex === index}>
                          <ul>
                            <li>Profesor: {value.profesor}</li>
                            <li>Tip Plata: {value.plata}</li>
                            <li>
                              Efectuat din abonament: 2/4 (16.08.2022,
                              18.08.2022, 18.08.2022)
                            </li>
                          </ul>
                        </Accordion.Content>
                      </>
                    );
                  }
                )
              }
            </Accordion>
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

export default ModalProfilElev;
