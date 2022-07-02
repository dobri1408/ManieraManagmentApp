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
      color: "#FF7272",
    },
    {
      text: "Sala 3",
      value: 3,
      color: "#FF7274",
    },
    {
      text: "Sala 4",
      value: 4,
      color: "#FF7274",
    },
    {
      text: "Sala 5",
      value: 5,
      color: "#FF7274",
    },
    {
      text: "Sala 6",
      value: 6,
      color: "#FF7274",
    },
    {
      text: "Sala 7",
      value: 7,
      color: "#FF7274",
    },
    {
      text: "Sala 8",
      value: 8,
      color: "#FF7274",
    },
  ],
  field: "RoomID",
  valueField: "value",
  textField: "text",
  colorField: "color",
};
function App() {
  const [resources, setResources] = useState([]);
  const [students, setStudents] = useState([]);
  const [profesori, setProfesori] = useState([]);
  const [materii, setMaterii] = useState([]);
  const [meditatii, setMeditatii] = useState([]);

  async function getEleviFromDatabase() {
    const querySnapshot = await getDocs(collection(db, "elevi"));

    let array = [];
    querySnapshot.forEach((doc) => {
      array.push({
        ...doc.data(),
        id: doc.id,
        text: doc.data().prenume + " " + doc.data().numeDeFamilie,
        value: doc.id,
        color: getRandomColor(),
      });
    });
    array.sort();

    setStudents(array);
  }
  async function getProfesorFromDatabase() {
    const querySnapshot = await getDocs(collection(db, "profesori"));

    let array = [];
    querySnapshot.forEach((doc) => {
      array.push({
        ...doc.data(),
        id: doc.id,
        text: doc.data().prenume + " " + doc.data().numeDeFamilie,
        value: doc.id,
        color: getRandomColor(),
      });
    });
    array.sort();

    setProfesori(array);
  }
  async function getMateriiFromDatabase() {
    const querySnapshot = await getDocs(collection(db, "materii"));

    let array = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      array.push({
        ...doc.data(),
        id: doc.id,
        text: doc.data().numeMaterie,
        value: doc.id,
        color: getRandomColor(),
      });
    });
    array.sort();

    setMaterii(array);
  }
  async function getMeditatiiFromDatabse() {
    const querySnapshot = await getDocs(collection(db, "meditatii"));

    let array = [];
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots

      array.push({
        ...doc.data(),
      });
    });

    setMeditatii(array);
  }
  useEffect(() => {
    getEleviFromDatabase();
    getProfesorFromDatabase();
    getMateriiFromDatabase();
    getMeditatiiFromDatabse();
  }, []);
  useEffect(() => {
    const resourcesArray = [];
    resourcesArray.push(saliResource);
    const eleviResource = {
      name: "Elevi",
      data: students.map((student) => {
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
  }, [students, profesori, materii]);

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
                elevi={students}
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
        </Routes>
      </Router>
    </>
  );
}

export default App;
