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
import { Label, Menu, Table } from "semantic-ui-react";
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
  function timeConverter(UNIX_timestamp) {
    var a = new Date(UNIX_timestamp * 1000);
    var months = [
      "Ian",
      "Feb",
      "Mar",
      "Apr",
      "Mai",
      "Iun",
      "Iul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = months[a.getMonth()];
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + " " + month + " " + year + " " + hour + ":" + min;
    return time;
  }
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
        meditatiiDefault={studentData?.meditatii}
        contDefault={studentData?.cont}
        numeFacturaDefault={studentData?.numeFactura}
        serieBuletinFacturaDefault={studentData?.serieBuletinFactura}
        orasFacturaDefault={studentData?.orasFactura}
        stradaFacturaDefault={studentData?.stradaFactura}
        numarBuletinFacturaDefault={studentData?.numarBuletinFactura}
        numarAdresaFacturaDefault={studentData?.numarAdresaFactura}
        blocFacturaDefault={studentData?.blocFactura}
        apartamentFacturaDefault={studentData?.apartamentFactura}
        judetFacturaDefault={studentData?.judetFactura}
        facturiNeplatite={studentData?.facturiNeplatite}
        sedinteNeplatite={studentData?.sedinteNeplatite}
        numarFacturi={studentData?.numarFacturi}
      />
      <Modal.Header>Detalii Elev</Modal.Header>
      <Modal.Content image scrolling>
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
          <h6>Date Facturare</h6>
          <div style={{ paddingLeft: "4vw" }}>
            <ul>
              <li>Nume {studentData?.numeFactura}</li>
              <li>
                Serie Buletin+Numar:{" "}
                {studentData?.serieBuletinFactura +
                  " " +
                  studentData?.numarBuletinFactura}
              </li>
              <li>
                Adresa:{" "}
                {"oras " +
                  studentData?.orasFactura +
                  ", " +
                  studentData?.stradaFactura +
                  ", " +
                  studentData?.numarAdresaFactura +
                  ", Bloc: " +
                  studentData?.blocFactura +
                  ", Apart:" +
                  studentData?.apartamentFactura +
                  ", " +
                  studentData?.judetFactura}{" "}
              </li>
            </ul>
          </div>
          <h6>Pregatiri in cadrul Maniera</h6>
          <div>
            <Accordion styled>
              {
                //e obiect
                meditatiiOfElev.map((meditatie, index) => {
                  const platite = meditatie.sedinte.filter(
                    (meditatie) =>
                      meditatie.starePlata === "cash" ||
                      meditatie.starePlata === "cont"
                  );
                  const neplatite = meditatie.sedinte.filter(
                    (meditatie) => meditatie.starePlata === "neplatit"
                  );
                  const absente = meditatie.sedinte.filter(
                    (meditatie) => meditatie.starePlata === "absent"
                  );
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
                        </ul>
                        <h3 style={{ alignText: "center", color: "red" }}>
                          Sedinte neplatite ({neplatite.length})
                        </h3>
                        <Table celled>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>Data</Table.HeaderCell>
                              <Table.HeaderCell>Suma</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>

                          <Table.Body>
                            {neplatite.map((sedinta) => {
                              return (
                                <Table.Row>
                                  <Table.Cell>
                                    {timeConverter(sedinta.Start.seconds)}
                                  </Table.Cell>
                                  <Table.Cell style={{ color: "red" }}>
                                    {sedinta.Pret}
                                  </Table.Cell>
                                </Table.Row>
                              );
                            })}
                          </Table.Body>
                        </Table>
                        <h3 style={{ alignText: "center", color: "grey" }}>
                          Sedinte Absentate ({absente.length})
                        </h3>
                        <Table celled>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>Data</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>

                          <Table.Body>
                            {absente.map((sedinta) => {
                              return (
                                <Table.Row>
                                  <Table.Cell>
                                    {timeConverter(sedinta.Start.seconds)}
                                  </Table.Cell>
                                </Table.Row>
                              );
                            })}
                          </Table.Body>
                        </Table>
                        <h3 style={{ alignText: "center", color: "green" }}>
                          Sedinte Platite ({platite.length})
                        </h3>
                        <Table celled>
                          <Table.Header>
                            <Table.Row>
                              <Table.HeaderCell>Data</Table.HeaderCell>
                              <Table.HeaderCell>Suma</Table.HeaderCell>
                              <Table.HeaderCell>Mod</Table.HeaderCell>
                            </Table.Row>
                          </Table.Header>

                          <Table.Body>
                            {platite.map((sedinta) => {
                              return (
                                <Table.Row>
                                  <Table.Cell>
                                    {timeConverter(sedinta.Start.seconds)}
                                  </Table.Cell>
                                  <Table.Cell style={{ color: "green" }}>
                                    {sedinta.Pret}
                                  </Table.Cell>
                                  <Table.Cell style={{ color: "green" }}>
                                    {sedinta.starePlata}
                                  </Table.Cell>
                                </Table.Row>
                              );
                            })}
                          </Table.Body>
                        </Table>
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
