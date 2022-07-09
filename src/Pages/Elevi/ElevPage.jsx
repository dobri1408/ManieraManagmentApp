import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Orare from "../../Components/Scheduler/Orare";
import { Button, Icon, Input } from "semantic-ui-react";
import ModalRegisterElev from "./ModalProfilElev";
import { useSelector } from "react-redux";

function ElevPage({ resources, materiiFromDataBase, meditatii }) {
  const id = useParams()?.id;
  const studentData = useSelector((state) =>
    state.elevi.find((elev) => elev.id === id)
  );
  const [adauga, setAdauga] = useState(false);
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
        <h1>
          {studentData?.prenume +
            " " +
            studentData?.numeDeFamilie +
            " -- " +
            "Cont:0"}
        </h1>
      </div>
      <div style={{ display: "flex", gap: "30px" }}>
        {adauga === false && (
          <Button
            style={{ backgroundColor: "#21ba45", color: "white" }}
            onClick={() => {
              setAdauga(true);
            }}
          >
            {" "}
            Adauga bani in cont
          </Button>
        )}
        {adauga === true && (
          <>
            <Input placeholder="Suma" />
            <Button
              style={{ backgroundColor: "#21ba45", color: "white" }}
              onClick={() => {
                setAdauga(false);
              }}
            >
              Adauga
            </Button>
            <Button
              style={{ backgroundColor: "red", color: "white" }}
              onClick={() => {
                setAdauga(false);
              }}
            >
              Cancel
            </Button>
          </>
        )}
      </div>
      <br />
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
