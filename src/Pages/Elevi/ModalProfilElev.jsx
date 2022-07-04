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
import { getPrescurtare } from "../../utils/utils";
function ModalProfilElev({ show, setShow, studentData, setStudentData }) {
  const [activeIndex, setActiveIndex] = useState();
  const [Materii, setMaterii] = useState([]);
  const [open, setOpen] = useState(false);
  const [meditatiiOfElev, setMeditatiiOfElev] = useState([]);
  const handleAccordion = (value) => {
    if (activeIndex === value) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(value);
  };
  function compare(a, b) {
    if (a.seMaiTine < b.seMaiTine) {
      return 1;
    }
    if (a.seMaiTine > b.seMaiTine) {
      return -1;
    }
    return 0;
  }
  React.useEffect(() => {
    setMeditatiiOfElev([]);
    if (studentData?.meditatii?.length > 0) {
      let array = [...studentData.meditatii];
      array.sort(compare);
      setMeditatiiOfElev(array);
    }
  }, [studentData]);
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
          <h6>Pregatiri in cadrul Maniera</h6>
          <div>
            <Accordion styled>
              {
                //e obiect
                meditatiiOfElev.map((meditatie, index) => {
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
                        {new Date(
                          meditatie.Start.seconds * 1000.0
                        ).toLocaleTimeString("ro-RO", {
                          // en-US can be set to 'default' to use user's browser settings
                          hour: "2-digit",
                          minute: "2-digit",
                        }) +
                          " " +
                          getPrescurtare(meditatie.materie) +
                          "-" +
                          meditatie.profesor +
                          " (" +
                          meditatie.grupa.map((elev) => elev + ", ") +
                          ")"}
                      </Accordion.Title>
                      <Accordion.Content active={activeIndex === index}>
                        {meditatie.seMaiTine === false && (
                          <div>
                            <h3 style={{ color: "red" }}>
                              ATENTIE! PREGATIREA A FOST STEARSA.
                            </h3>
                            <h3 style={{ color: "red" }}>
                              PREGATIREA A FOST ARHIVATA
                            </h3>
                          </div>
                        )}

                        <ul>
                          <li>{meditatie.frecventa}</li>
                          <li>Profesor: {meditatie.profesor}</li>
                          <li>Pret: {meditatie.pretPerSedinta}</li>
                          <li>Materie: {meditatie.materie}</li>

                          <li>
                            Grupa: {meditatie.grupa.map((elev) => elev + ", ")}
                          </li>
                          <li>
                            Efectuat din abonament: 2/4 (16.08.2022, 18.08.2022,
                            18.08.2022)
                          </li>
                        </ul>
                      </Accordion.Content>
                    </>
                  );
                })
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
