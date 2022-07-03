import React, { useState, useEffect } from "react";
import {
  Button,
  Header,
  Image,
  Modal,
  Icon,
  Input,
  Dropdown,
  Accordion,
} from "semantic-ui-react";
import { Divider, Form, Label } from "semantic-ui-react";
import { doc, setDoc, getDocs, collection, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebase";
import { useSelector, useDispatch } from "react-redux";
import { getMaterii, getProfesori } from "../redux/actions";

function AddMaterie({ setShow, show }) {
  const [profesori, setProfesori] = useState([]);
  const [selectedProfesori, setSelectedProfesori] = useState([]);

  const [numeMaterie, setNumeMaterie] = useState("");
  const [activeIndex, setActiveIndex] = useState();
  const profesoriFromRedux = useSelector((state) => state.profesori);
  const materii = useSelector((state) => state.materii);
  const dispatch = useDispatch();
  async function addToDatabase() {
    await setDoc(doc(db, "materii", numeMaterie), {
      numeMaterie: numeMaterie,
      profesori: selectedProfesori,
      //TO DO: TREBUIE SA MODIFICE SI LA PROFESORI MATERIA
    });
    selectedProfesori.forEach(async (profesor) => {
      const docRef = doc(db, "profesori", profesor);
      const docSnap = await getDoc(docRef);
      const data = docSnap.data();
      let newMaterii = data.materii;
      if (newMaterii.find((el) => el === numeMaterie) === undefined)
        newMaterii = [...newMaterii, numeMaterie];

      await setDoc(doc(db, "profesori", profesor), {
        ...data,
        materii: newMaterii,
      });
    });
    setNumeMaterie("");
    setSelectedProfesori([]);
    dispatch(getMaterii());
    dispatch(getProfesori());
  }
  const handleAccordion = (index) => {
    if (activeIndex === index) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(index);
  };

  useEffect(() => {
    let array = [];

    profesoriFromRedux.forEach((doc) => {
      array.push({
        text: doc.prenume + " " + doc.numeDeFamilie,
        key: doc.id,
        value: doc.id,
      });
    });

    array.sort();
    setProfesori(array);
  }, [profesoriFromRedux]);

  return (
    <Modal
      size="small"
      onClose={() => {
        setShow(false);
        setNumeMaterie("");
        setSelectedProfesori([]);
      }}
      onOpen={() => setShow(true)}
      open={show}
      style={{ position: "relative" }}
    >
      <Modal.Header>Adauga Materie Noua</Modal.Header>
      <Modal.Content scrolling>
        <Form>
          <Form.Field inline>
            <Label>Nume Materie</Label>
            <Input
              type="text"
              placeholder="Nume Materie"
              value={numeMaterie}
              onChange={(e) => {
                setNumeMaterie(e.target.value);
              }}
            />
          </Form.Field>
          <Form.Field inline>
            <Label>Profesorii care o predau</Label>
            <Dropdown
              placeholder="Materii"
              fluid
              multiple
              selection
              value={selectedProfesori}
              options={profesori}
              onChange={(e, data) => {
                setSelectedProfesori(data.value);
              }}
            />
          </Form.Field>
        </Form>
        <Divider />
        <h6
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          Materii deja adaugate
        </h6>
        <Accordion styled>
          {
            //e obiect
            materii.map((materie, index) => {
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
                    {materie.numeMaterie}
                  </Accordion.Title>
                  <Accordion.Content active={activeIndex === index}>
                    {materie?.profesori?.map(
                      (prof) =>
                        profesori?.find((el) => el?.key === prof)?.text + " "
                    )}
                  </Accordion.Content>
                </>
              );
            })
          }
        </Accordion>
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

export default AddMaterie;
