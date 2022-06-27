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

function AddElev({ setShow, show }) {
  const [materii, setMaterii] = useState([]);
  const [pregatiri, setPregatiri] = useState([]);
  const [liceu, setLiceu] = useState("");
  const [numeDeFamilie, setNumeDeFamilie] = useState("");
  const [prenume, setPrenume] = useState("");
  const [an, setAn] = useState(0);
  const [zi, setZi] = useState(0);
  const [luna, setLuna] = useState(0);
  const [localitatea, setLocalitatea] = useState("");

  const meditatii = new Map();
  async function addToDatabase() {
    console.log(Object.fromEntries(meditatii));
    await setDoc(doc(db, "elevi", prenume + numeDeFamilie + an + zi + luna), {
      prenume,
      numeDeFamilie,
      an,
      zi,
      luna,
      localitatea,
      liceu,
      pregatiri: Object.fromEntries(meditatii),
    });
  }
  return (
    <Modal
      size="small"
      onClose={() => {
        setShow(false);
        setMaterii([]);
        setPregatiri([]);
        setLocalitatea("");
        setPrenume("");
        setNumeDeFamilie("");
        setLiceu("");
        setAn(0);
        setLuna(0);
        setZi(0);
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
              onChange={(e) => {
                setNumeDeFamilie(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Prenume"
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
              placeholder="An"
              onChange={(e) => {
                setAn(e.target.value);
              }}
            />
            <Input
              type="number"
              placeholder="Luna"
              onChange={(e) => {
                setLuna(e.target.value);
              }}
            />
            <Input
              type="number"
              placeholder="Zi"
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
              onChange={(e) => {
                setLiceu(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Localitatea"
              onChange={(e) => {
                setLocalitatea(e.target.value);
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
              {
                console.log(materie);
              }
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
                      selection
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
                          value: "stefanradu",
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
