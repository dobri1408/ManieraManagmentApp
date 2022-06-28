import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import Orar from "../../Components/Orar/Orar";
import { Button } from "semantic-ui-react";
import ModalRegisterElev from "./ModalProfilElev";
function ElevPage() {
  const id = useParams()?.id;
  const [studentData, setStudentData] = useState();
  const [show, setShow] = useState(false);
  async function getStudentFromDatabase() {
    console.log(id.id);
    const ref = doc(db, "elevi", id);
    const docSnap = await getDoc(ref);
    setStudentData({ ...docSnap.data(), id: id });
  }
  useEffect(() => {
    if (id) {
      getStudentFromDatabase();
    }
  }, [id]);
  console.log(studentData);
  return (
    <>
      <ModalRegisterElev
        show={show}
        setShow={setShow}
        studentData={studentData}
        setStudentData={setStudentData}
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
        <h1>{studentData?.prenume + "  " + studentData?.numeDeFamilie}</h1>
      </div>
      <Orar />
    </>
  );
}

export default ElevPage;
