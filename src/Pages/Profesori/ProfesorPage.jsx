import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Orar from "../../Components/Orar/Orar";
import { Button } from "semantic-ui-react";
import ModalRegisterProfesor from "./ModalProfilProfesor";
function ProfesorPage() {
  const id = useParams()?.id;
  const [profesorData, setProfesorData] = useState();
  const [show, setShow] = useState(false);

  async function getProfesorFromDatabase() {
    const ref = doc(db, "profesori", id);
    const docSnap = await getDoc(ref);
    console.log(docSnap.data());
    setProfesorData({ ...docSnap.data(), id: id });
  }
  useEffect(() => {
    if (id) {
      getProfesorFromDatabase();
    }
  }, [id]);
  console.log({ profesorData });
  return (
    <>
      <ModalRegisterProfesor
        show={show}
        setShow={setShow}
        profesorData={profesorData}
        setProfesorData={setProfesorData}
      />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignText: "center",
          paddingTop: "4vh",
          paddingBottom: "4vh",
          gap: "30vh",
        }}
      >
        <Button
          onClick={() => {
            setShow(true);
          }}
          style={{
            position: "absolute",
            marginTop: "3vh",
            marginRight: "90vw",
          }}
        >
          Detalii Profesor
        </Button>
        <h1>
          {profesorData?.prenume +
            "  " +
            profesorData?.numeDeFamilie +
            "( " +
            profesorData?.materii.map((materie) => materie + "  ") +
            ")"}
        </h1>
      </div>
      <Orar />
    </>
  );
}

export default ProfesorPage;
