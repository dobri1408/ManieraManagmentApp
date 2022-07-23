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
  numeFacturaDefault = "",
  serieBuletinFacturaDefault = "",
  orasFacturaDefault = "",
  stradaFacturaDefault = "",
  numarBuletinFacturaDefault = "",
  numarAdresaFacturaDefault = "",
  blocFacturaDefault = "",
  apartamentFacturaDefault = "",
  judetFacturaDefault = "",
  facturiNeplatite = [],
  sedinteNeplatite = [],
  numarFacturi = 0,
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
  const [numeFactura, setNumeFactura] = useState(numeFacturaDefault);
  const meditatii = new Map(Object.entries(pregatiriDefault));
  const Materii = useSelector((state) => state.materii);
  const profesori = useSelector((state) => state.profesori);
  const [serieBuletinFactura, setSerieBuletinFactura] = useState(
    serieBuletinFacturaDefault
  );
  const [orasFactura, setOrasFactura] = useState(orasFacturaDefault);
  const [stradaFactura, setStradaFactura] = useState(stradaFacturaDefault);
  const [numarBuletinFactura, setNumarBuletinFactura] = useState(
    numarBuletinFacturaDefault
  );
  const [numarAdresaFactura, setNumarAdresaFactura] = useState(
    numarAdresaFacturaDefault
  );
  const [blocFactura, setBlocFactura] = useState(blocFacturaDefault);
  const [apartamentFactura, setApartamentFactura] = useState(
    apartamentFacturaDefault
  );
  const [judetFactura, setJudetFactura] = useState(judetFacturaDefault);

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
      numeFactura,
      serieBuletinFactura,
      orasFactura,
      stradaFactura,
      numarBuletinFactura,
      numarAdresaFactura,
      blocFactura,
      apartamentFactura,
      numarFacturi,
      sedinteNeplatite,
      facturiNeplatite,
      judetFactura,
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
          Facturare
          <Form.Field inline>
            <Label>Date personale</Label>
            <Input
              type="text"
              placeholder="Nume"
              value={numeFactura}
              onChange={(e) => {
                setNumeFactura(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Serie"
              value={serieBuletinFactura}
              onChange={(e) => {
                setSerieBuletinFactura(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Numar Buletin"
              value={numarBuletinFactura}
              onChange={(e) => {
                setNumarBuletinFactura(e.target.value);
              }}
            />
          </Form.Field>
          <Divider />
          <Form.Field></Form.Field>
          <Divider />
          <Form.Field inline>
            <Label>Adresa Facturare</Label>
            <Input
              type="text"
              value={orasFactura}
              placeholder="Oras"
              onChange={(e) => {
                setOrasFactura(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Strada"
              value={stradaFactura}
              onChange={(e) => {
                setStradaFactura(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="numar"
              value={numarAdresaFactura}
              onChange={(e) => {
                setNumarAdresaFactura(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Bloc"
              value={blocFactura}
              onChange={(e) => {
                if (e.target.value === "-") setApartamentFactura("");
                setBlocFactura(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Apartament"
              value={apartamentFactura}
              onChange={(e) => {
                if (e.target.value === "-") setApartamentFactura("");
                setApartamentFactura(e.target.value);
              }}
            />
            <Input
              type="text"
              placeholder="Judet"
              value={judetFactura}
              onChange={(e) => {
                setJudetFactura(e.target.value);
              }}
            />
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
