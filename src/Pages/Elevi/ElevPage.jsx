import React from "react";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
function ElevPage() {
  const id = useParams();
  const [studentData, setStudentData] = useState();
  async function getStudentFromDatabase() {
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
  return <h1>{studentData?.prenume + studentData?.nume}</h1>;
}

export default ElevPage;
