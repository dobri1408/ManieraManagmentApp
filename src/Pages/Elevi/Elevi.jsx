import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Input, Segment } from "semantic-ui-react";
import { Grid, Image, Loader } from "semantic-ui-react";
import AddElev from "./AddElev";
import { getDocs, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
export default function Elevi() {
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [students, setStudents] = useState([]);
  const [studentsGrid, setStudentsGrid] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const navigate = useNavigate();
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputValue(lowerCase);
  };
  let gridArray = [];
  async function getDataFromDatabase() {
    const querySnapshot = await getDocs(collection(db, "elevi"));
    console.log(querySnapshot);
    let array = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.data());
      console.log(doc.uid);
      console.log({ ...doc.data(), id: doc.uid });
      array.push({ ...doc.data(), id: doc.id });
    });
    array.sort();

    setStudents(
      array.filter((el) => {
        if (inputValue === "") {
          return el;
        } else {
          return (el.prenume + el.numeDeFamilie)
            .toLowerCase()
            .includes(inputValue);
        }
      })
    );
  }
  useEffect(() => {
    setStudents([]);
    getDataFromDatabase(inputValue);
  }, [show, modal, inputValue]);
  useEffect(() => {
    const chunkSize = 10;
    gridArray = [];
    for (let i = 0; i < students.length; i += chunkSize) {
      const chunk = students.slice(i, i + chunkSize);
      gridArray.push(chunk);
    }
    setStudentsGrid(gridArray);
  }, [students]);
  console.log(students);
  return (
    <>
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          gap: "2vw",
          paddingTop: "2vh",
        }}
      >
        <Input
          style={{ border: "1px solid", width: "50vw" }}
          placeholder="Cauta un Elev"
          onChange={(e) => {
            inputHandler(e);
          }}
        />

        <Button
          onClick={() => {
            setModal(true);
          }}
        >
          Adauga Elev
        </Button>
      </div>
      <Grid style={{ paddingLeft: "5vw" }}>
        {studentsGrid.map((array) => {
          return (
            <Grid.Row columns={5} style={{ paddingTop: "5vh" }}>
              {array.map((student) => {
                console.log({ student });
                return (
                  <Grid.Column style={{ paddingTop: "5vh" }}>
                    <Segment
                      style={{ fontWeight: "bold" }}
                      onClick={() => {
                        navigate(`/elev/${student.id}`);
                      }}
                    >
                      {student.prenume + " " + student.numeDeFamilie}
                    </Segment>
                  </Grid.Column>
                );
              })}
            </Grid.Row>
          );
        })}
      </Grid>

      <AddElev show={modal} setShow={setModal} />
    </>
  );
}
