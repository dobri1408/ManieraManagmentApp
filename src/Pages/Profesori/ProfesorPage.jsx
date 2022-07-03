import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Orar from "../../Components/Orar/Orar";
import { Button } from "semantic-ui-react";
import ModalRegisterProfesor from "./ModalProfilProfesor";
import { useSelector } from "react-redux";
function ProfesorPage() {
  const id = useParams()?.id;
  const [show, setShow] = useState(false);
  const profesorData = useSelector((state) =>
    state.profesori.find((profesor) => profesor.id === id)
  );

  return (
    <>
      <ModalRegisterProfesor
        show={show}
        setShow={setShow}
        profesorData={profesorData}
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
