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
import { getElevi } from "../../redux/actions";
import { useSelector, useDispatch } from "react-redux";

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
  meditatiiDefault = [],
  contDefault = 0,
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
  const Materii = useSelector((state) => state.materii);
  const profesori = useSelector((state) => state.profesori);
  const dispatch = useDispatch();
  async function addToDatabase() {
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
      meditatii: meditatiiDefault,
      cont: contDefault,
    });
    dispatch(getElevi());
  }

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
          {
            // <Form.Field inline>
            //   <Label pointing="right">Materii</Label>
            //   <Dropdown
            //     placeholder="Materii"
            //     fluid
            //     multiple
            //     selection
            //     value={materii}
            //     options={Materii.map((materie) => {
            //       return {
            //         text: materie.numeMaterie,
            //         value: materie.numeMaterie,
            //         key: materie.numeMaterie,
            //       };
            //     })}
            //     onChange={(e, data) => {
            //       setMaterii(data.value);
            //     }}
            //   />
            // </Form.Field>
            // <Divider />
            // <Form.Field inline>
            //   <Label pointing="right">Detalii Pregatiri</Label>
            // </Form.Field>
            // <Form.Field>
            //   {materii.map((materie) => {
            //     return (
            //       <Form.Field>
            //         <h1>{materie}</h1>
            //         <Form.Field
            //           inline
            //           style={{
            //             display: "block",
            //             justifyContent: "center",
            //             alignItems: "center",
            //           }}
            //         >
            //           <Label>Profesor</Label>
            //           <Select
            //             placeholder="Profesor"
            //             fluid
            //             selection
            //             value={meditatii.get(materie)?.profesor}
            //             onChange={(e, data) =>
            //               meditatii.set(materie, { profesor: data.value })
            //             }
            //             options={Materii?.find(
            //               (el) => el?.numeMaterie === materie
            //             )?.profesori?.map((profesor) => {
            //               return {
            //                 text:
            //                   profesori?.find((el) => el?.id === profesor)
            //                     ?.numeDeFamilie +
            //                   " " +
            //                   profesori?.find((el) => el?.id === profesor)
            //                     ?.prenume,
            //                 value:
            //                   profesori?.find((el) => el?.id === profesor)
            //                     ?.numeDeFamilie +
            //                   " " +
            //                   profesori?.find((el) => el?.id === profesor)
            //                     ?.prenume,
            //                 key:
            //                   profesori?.find((el) => el?.id === profesor)
            //                     ?.numeDeFamilie +
            //                   " " +
            //                   profesori?.find((el) => el?.id === profesor)
            //                     ?.prenume,
            //               };
            //             })}
            //           />
            //           <Label>Tip Plata</Label>
            //           <Select
            //             placeholder="Tip Plata"
            //             fluid
            //             value={meditatii.get(materie)?.plata}
            //             onChange={(e, data) => {
            //               meditatii.set(materie, {
            //                 ...meditatii.get(materie),
            //                 plata: data.value,
            //               });
            //             }}
            //             options={[
            //               {
            //                 key: "abonament",
            //                 text: "Abonament 4",
            //                 value: "abonament",
            //               },
            //               {
            //                 key: "persedinta",
            //                 text: "Plata per sedinta",
            //                 value: "Plata per sedinta",
            //               },
            //             ]}
            //           />
            //         </Form.Field>
            //       </>
            //     );
            //   })}
            // </Form.Field>
          }
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
