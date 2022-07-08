import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Orare from "../../Components/Scheduler/Orare";
import { Button } from "semantic-ui-react";
import ModalRegisterElev from "./ModalProfilElev";
import { useSelector } from "react-redux";
function ElevPage({ resources, materiiFromDataBase, meditatii }) {
  const id = useParams()?.id;
  const studentData = useSelector((state) =>
    state.elevi.find((elev) => elev.id === id)
  );
  const [show, setShow] = useState(false);

  return (
    <>
      <ModalRegisterElev
        show={show}
        setShow={setShow}
        studentData={studentData}
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
          Detalii elev
        </Button>
        <h1>{studentData?.prenume + " " + studentData?.numeDeFamilie}</h1>
      </div>
      {studentData?.text && (
        <Orare
          resources={resources}
          meditatii={meditatii}
          materiiFromDataBase={materiiFromDataBase}
          orientare={{ tip: "elev", text: studentData?.text }}
        />
      )}
    </>
  );
}

export default ElevPage;
