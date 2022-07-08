import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Orare from "./Pages/Orare/Orare";
import Navbar from "./Components/Navbar";
import { useState } from "react";
import { useEffect } from "react";
import Elevi from "./Pages/Elevi/Elevi";
import ElevPage from "./Pages/Elevi/ElevPage";
import ProfesorPage from "./Pages/Profesori/ProfesorPage";
import Profesori from "./Pages/Profesori/Profesori";
import { collection, getDocs } from "firebase/firestore";
import { db } from "./firebase/firebase";
import { getRandomColor } from "./utils/utils";
import { useSelector, useDispatch } from "react-redux";
import About from "./Pages/About";
import Plati from "./Pages/Plati/Plati";
import {
  getProfesori,
  getElevi,
  getMaterii,
  getMeditatii,
} from "./redux/actions";
//EFICIENTA TO DO: cand actualizam un element din elevi, profesori idk, sa nu mai dam dispatch la toti elevii din firebase
//sa actualizam in redux local
//BUG DACA MODIFCI PRIMA REPETITIE A UNEI MEDITATII O DUBLIFICA IN URMATOAREA SAPTAMANA, pentru ca si acolo e deja modifica
const saliResource = {
  name: "Sali",
  data: [
    {
      text: "Sala 1",
      value: 1,
    },
    {
      text: "Sala 2",
      value: 2,
      color: getRandomColor(),
    },
    {
      text: "Sala 3",
      value: 3,
      color: getRandomColor(),
    },
    {
      text: "Sala 4",
      value: 4,
      color: getRandomColor(),
    },
    {
      text: "Sala 5",
      value: 5,
      color: getRandomColor(),
    },
    {
      text: "Sala 6",
      value: 6,
      color: getRandomColor(),
    },
    {
      text: "Sala 7",
      value: 7,
      color: getRandomColor(),
    },
    {
      text: "Sala 8",
      value: 8,
      color: getRandomColor(),
    },
  ],
  field: "RoomID",
  valueField: "value",
  textField: "text",
  colorField: "color",
};
function App() {
  const [resources, setResources] = useState([]);
  const elevi = useSelector((state) => state.elevi);
  const profesori = useSelector((state) => state.profesori);
  const materii = useSelector((state) => state.materii);
  const meditatii = useSelector((state) => state.meditatii);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getMaterii());
    dispatch(getProfesori());
    dispatch(getMeditatii());
    dispatch(getElevi());
  }, []);
  useEffect(() => {
    const resourcesArray = [];
    resourcesArray.push(saliResource);
    const eleviResource = {
      name: "Elevi",
      data: elevi.map((student) => {
        return {
          text: student.prenume + " " + student.numeDeFamilie,
          value: student.id,
          color: getRandomColor(),
        };
      }),
      field: "ElevID",
      valueField: "value",
      multiple: true,
      textField: "text",
      colorField: "color",
    };

    const profesoriResource = {
      name: "Profesori",
      data: profesori.map((profesor) => {
        return {
          text: profesor.prenume + " " + profesor.numeDeFamilie,
          value: profesor.id,
          color: getRandomColor(),
        };
      }),
      field: "PersonIDs",
      valueField: "value",
      textField: "text",
      colorField: "color",
    };
    resourcesArray.push(eleviResource);
    const materiiResource = {
      name: "Materii",
      data: materii.map((materie) => {
        return {
          text: materie.numeMaterie,
          value: materie.id,
          color: getRandomColor(),
        };
      }),
      field: "MateriiIDs",
      valueField: "value",
      textField: "text",
      colorField: "color",
    };
    resourcesArray.push(materiiResource);
    resourcesArray.push(profesoriResource);

    resourcesArray.push(
      {
        name: "SelectedProfesori",
        data: [],
        field: "PersonIDs",
        valueField: "value",
        textField: "text",
        colorField: "color",
      },
      {
        name: "SelectedSali",
        data: [],
        field: "RoomID",
        valueField: "value",
        textField: "text",
        colorField: "color",
      },
      {
        name: "SelectedElevi",
        data: [],
        field: "ElevID",
        valueField: "value",
        textField: "text",
        multiple: true,
        colorField: "color",
      },
      {
        name: "SelectedMaterii",
        data: [],
        field: "MateriiIDs",
        valueField: "value",
        textField: "text",
        colorField: "color",
      }
    );

    setResources(resourcesArray);
  }, [elevi, profesori, materii]);

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route
            path="/"
            element={
              <Orare
                resources={resources}
                profesori={profesori}
                elevi={elevi}
                sali={saliResource}
                materiiFromDataBase={materii}
                meditatii={meditatii}
              />
            }
          />
          <Route path="/elevi" element={<Elevi />} />
          <Route path="/elev/:id" element={<ElevPage />} />
          <Route path="/profesori" element={<Profesori />} />
          <Route path="/profesor/:id" element={<ProfesorPage />} />
          <Route path="/about" element={<About />} />
          <Route path="/plati" element={<Plati />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
