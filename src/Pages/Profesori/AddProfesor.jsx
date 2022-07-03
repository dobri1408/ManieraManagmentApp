import React, { useState, useEffect } from "react";
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
import { doc, setDoc, getDocs, collection } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import { useSelector } from "react-redux";
import { getMaterii, getProfesori } from "../../redux/actions";
import { useDispatch } from "react-redux";
function AddProfesor({
  setShow,
  show,
  materiiDefault = [],
  numeDeFamilieDefault = "",
  prenumeDefault = "",
  anDefault = "",
  ziDefault = "",
  lunaDefault = "",
  localitateDefault = "",
  clasaDefault = "",
  id = "",
}) {
  const [materii, setMaterii] = useState(
    JSON.parse(JSON.stringify(materiiDefault))
  );
  const dispatch = useDispatch();
  const [numeDeFamilie, setNumeDeFamilie] = useState(
    JSON.parse(JSON.stringify(numeDeFamilieDefault))
  );
  const [prenume, setPrenume] = useState(
    JSON.parse(JSON.stringify(prenumeDefault))
  );
  const [an, setAn] = useState(JSON.parse(JSON.stringify(anDefault)));
  const [zi, setZi] = useState(JSON.parse(JSON.stringify(ziDefault)));
  const [luna, setLuna] = useState(JSON.parse(JSON.stringify(lunaDefault)));
  const [Materii, setMATERII] = useState([]);
  const materiiFromRedux = useSelector((state) => state.materii);

  const [localitatea, setLocalitatea] = useState(
    JSON.parse(JSON.stringify(localitateDefault))
  );

  useEffect(() => {
    let array = [];
    materiiFromRedux.forEach((doc) => {
      array.push({
        text: doc.numeMaterie,
        key: doc.numeMaterie,
        value: doc.numeMaterie,
        profesori: doc.profesori,
      });
    });

    array.sort();
    setMATERII(array);
  }, [materiiFromRedux]);
  async function addToDatabase() {
    if (id === "") id = prenume + numeDeFamilie + an + zi + luna;
    await setDoc(doc(db, "profesori", id), {
      prenume,
      numeDeFamilie,
      an,
      zi,
      luna,
      localitatea,
      materii: materii,
    });
    if (prenumeDefault) window.location.reload(false);
    materii.forEach(async (materie) => {
      if (
        Materii.find((el) => el?.text === materie)?.profesori?.find(
          (el) => el === id
        ) === undefined
      )
        await setDoc(doc(db, "materii", materie), {
          numeMaterie: materie,
          profesori: [
            ...Materii.find((el) => el?.text === materie)?.profesori,
            id,
          ],
        });
    });
    dispatch(getMaterii());
    dispatch(getProfesori());
  }

  return (
    <Modal
      size="small"
      onClose={() => {
        setShow(false);
        setMaterii(materiiDefault);
        setLocalitatea(localitateDefault);
        setPrenume(prenumeDefault);
        setNumeDeFamilie(numeDeFamilieDefault);
        setAn(anDefault);
        setLuna(lunaDefault);
        setZi(ziDefault);
      }}
      onOpen={() => setShow(true)}
      open={show}
      style={{ position: "relative" }}
    >
      <Modal.Header>Adauga un Profesor nou</Modal.Header>
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
            <Input
              type="text"
              placeholder="Localitatea"
              value={localitatea}
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
              value={materii}
              options={Materii}
              onChange={(e, data) => {
                setMaterii(data.value);
                console.log(data.value);
              }}
            />
          </Form.Field>
          <Divider />
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

export default AddProfesor;
