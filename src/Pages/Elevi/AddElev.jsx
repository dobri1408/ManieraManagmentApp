import React, { useState } from "react";
import {
  Button,
  Header,
  Image,
  Modal,
  Select,
  Input,
  Dropdown,
} from "semantic-ui-react";
import { Divider, Form, Label } from "semantic-ui-react";
import { doc, setDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { Materii } from "./data";

function AddElev({
  setShow,
  show,
  materiiDefault = [],
  pregatiriDefault = [],
  liceuDefault = "",
  numeDeFamilieDefault = "",
  prenumeDefault = "",
  anDefault = "",
  ziDefault = "",
  lunaDefault = "",
  localitateDefault = "",
  clasaDefault = "",
  id = "",
}) {
  const [materii, setMaterii] = useState(materiiDefault);
  const [pregatiri, setPregatiri] = useState(pregatiriDefault);
  const [liceu, setLiceu] = useState(liceuDefault);
  const [numeDeFamilie, setNumeDeFamilie] = useState(numeDeFamilieDefault);
  const [prenume, setPrenume] = useState(prenumeDefault);
  const [an, setAn] = useState(anDefault);
  const [zi, setZi] = useState(ziDefault);
  const [luna, setLuna] = useState(lunaDefault);
  const [localitatea, setLocalitatea] = useState(localitateDefault);
  const [clasa, setClasa] = useState(clasaDefault);
  const meditatii = new Map(Object.entries(pregatiriDefault));
  async function addToDatabase() {
    console.log(Object.fromEntries(meditatii));
    if (id === "") id = prenume + numeDeFamilie + an + zi + luna;
    await setDoc(doc(db, "elevi", id), {
      prenume,
      numeDeFamilie,
      an,
      zi,
      luna,
      localitatea,
      liceu,
      clasa,
      pregatiri: Object.fromEntries(meditatii),
    });
    if (prenumeDefault) window.location.reload(false);
  }
  console.log({ pregatiri });
  return (
    <Modal
      size="small"
      onClose={() => {
        setShow(false);
        setMaterii(materiiDefault);
        setPregatiri(pregatiriDefault);
        setLocalitatea(localitateDefault);
        setPrenume(prenumeDefault);
        setNumeDeFamilie(numeDeFamilieDefault);
        setLiceu(liceuDefault);
        setAn(anDefault);
        setLuna(lunaDefault);
        setZi(ziDefault);
        setClasa(clasaDefault);
      }}
      onOpen={() => setShow(true)}
      open={show}
      style={{ position: "relative" }}
    >
      <Modal.Header>Adauga un elev nou</Modal.Header>
      <Modal.Content scrolling>
        <Form>
          <Form.Field inline>
            <Label>Nume</Label>
            <Input
              type="text"
              placeholder="Nume de Familie"
              value={numeDeFamilie}
              onChange={(e) => {
                setNumeDeFamilie(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Prenume"
              value={prenume}
              onChange={(e) => {
                setPrenume(e.target.value);
              }}
            />
          </Form.Field>
          <Divider />

          <Form.Field></Form.Field>
          <Divider />
          <Form.Field inline>
            <Label>Data de nastere</Label>
            <Input
              type="number"
              value={an}
              placeholder="An"
              onChange={(e) => {
                setAn(e.target.value);
              }}
            />
            <Input
              type="number"
              placeholder="Luna"
              value={luna}
              onChange={(e) => {
                setLuna(e.target.value);
              }}
            />
            <Input
              type="number"
              placeholder="Zi"
              value={zi}
              onChange={(e) => {
                setZi(e.target.value);
              }}
            />
            <Label pointing="left">
              in cifre, fara 0 in fata daca e doar o cifra
            </Label>
          </Form.Field>
          <Form.Field inline>
            <Label>Liceu</Label>
            <Input
              type="text"
              placeholder="Liceu"
              value={liceu}
              onChange={(e) => {
                setLiceu(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Localitatea"
              value={localitatea}
              onChange={(e) => {
                setLocalitatea(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Clasa"
              value={clasa}
              onChange={(e) => {
                setClasa(e.target.value);
              }}
            />
          </Form.Field>
          <Divider />

          <Divider />

          <Form.Field inline>
            <Label pointing="right">Materii</Label>
            <Dropdown
              placeholder="Materii"
              fluid
              multiple
              selection
              value={materii}
              options={Materii}
              onChange={(e, data) => {
                setMaterii(data.value);
                console.log(data.value);
              }}
            />
          </Form.Field>
          <Divider />
          <Form.Field inline>
            <Label pointing="right">Detalii Pregatiri</Label>
          </Form.Field>
          <Form.Field>
            {materii.map((materie) => {
              return (
                <>
                  <h1>{Materii.find((e) => e.value === materie).text}</h1>
                  <Form.Field
                    inline
                    style={{
                      display: "block",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Label>Profesor</Label>
                    <Select
                      placeholder="Profesor"
                      fluid
                      selection
                      value={meditatii.get(materie)?.profesor}
                      onChange={(e, data) =>
                        meditatii.set(materie, { profesor: data.value })
                      }
                      options={[
                        {
                          key: "andreeabucur",
                          text: "Andreea Bucur",
                          value: "andreeabucur",
                        },
                        {
                          key: "radustefan",
                          text: "Stfean Radu",
                          value: "stefanradu",
                        },
                        {
                          key: "mirceaignat",
                          text: "Mircea Ignat",
                          value: "Mircea Ignat",
                        },
                      ]}
                    />

                    <Label>Tip Plata</Label>
                    <Select
                      placeholder="Tip Plata"
                      fluid
                      value={meditatii.get(materie)?.plata}
                      onChange={(e, data) => {
                        meditatii.set(materie, {
                          ...meditatii.get(materie),
                          plata: data.value,
                        });
                      }}
                      options={[
                        {
                          key: "abonament",
                          text: "Abonament 4",
                          value: "abonament",
                        },
                        {
                          key: "persedinta",
                          text: "Plata per sedinta",
                          value: "Plata per sedinta",
                        },
                      ]}
                    />
                  </Form.Field>
                </>
              );
            })}
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setShow(false)}>
          Anuleaza
        </Button>
        <Button
          content="Adauga"
          labelPosition="right"
          icon="checkmark"
          onClick={async () => {
            await addToDatabase();
            setShow(false);
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
}

export default AddElev;
