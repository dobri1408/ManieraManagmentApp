import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import ModalRegisterProfesor from "./ModalProfilProfesor";
import { Input, Segment } from "semantic-ui-react";
import { Grid, Image, Loader } from "semantic-ui-react";
import AddProfesor from "./AddProfesor";
import { getDocs, collection } from "firebase/firestore";
import { useNavigate } from "react-router-dom";
import { db } from "../../firebase/firebase";
import { useSelector } from "react-redux";
export default function Profesori() {
  const [show, setShow] = useState(false);
  const [modal, setModal] = useState(false);
  const [profesori, setProfesori] = useState([]);
  const [profesoriGrid, setProfesoriGrid] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const profesoriFromRedux = useSelector((state) => state.profesori);
  const navigate = useNavigate();
  let inputHandler = (e) => {
    //convert input text to lower case
    var lowerCase = e.target.value.toLowerCase();
    setInputValue(lowerCase);
  };
  let gridArray = [];
  useEffect(() => {
    setProfesori([]);
    const array = profesoriFromRedux;

    setProfesori(
      array.filter((el) => {
        if (inputValue === "") {
          return el;
        } else {
          return (
            el.prenume +
            el.numeDeFamilie +
            "( " +
            el.materii.map((materie) => materie + " ") +
            " )"
          )
            .toLowerCase()
            .includes(inputValue);
        }
      })
    );
  }, [show, modal, inputValue, profesoriFromRedux]);
  useEffect(() => {
    const chunkSize = 10;
    gridArray = [];
    for (let i = 0; i < profesori.length; i += chunkSize) {
      const chunk = profesori.slice(i, i + chunkSize);
      gridArray.push(chunk);
    }
    setProfesoriGrid(gridArray);
  }, [profesori]);

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
          placeholder="Cauta un Profesor, dupa nume sau materie"
          onChange={(e) => {
            inputHandler(e);
          }}
        />

        <Button
          onClick={() => {
            setModal(true);
          }}
        >
          Adauga Profesor
        </Button>
      </div>
      <Grid style={{ paddingLeft: "5vw" }}>
        {profesoriGrid.map((array) => {
          return (
            <Grid.Row columns={4} style={{ paddingTop: "5vh" }}>
              {array.map((profesor) => {
                return (
                  <Grid.Column style={{ paddingTop: "5vh" }}>
                    <Segment
                      style={{ fontWeight: "bold" }}
                      onClick={() => {
                        navigate(`/profesor/${profesor.id}`);
                      }}
                    >
                      {profesor.prenume +
                        " " +
                        profesor.numeDeFamilie +
                        "( " +
                        profesor.materii.map((materie) => materie + " ") +
                        ")"}
                    </Segment>
                  </Grid.Column>
                );
              })}
            </Grid.Row>
          );
        })}
      </Grid>

      <AddProfesor show={modal} setShow={setModal} />
    </>
  );
}
