import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Orare from "./Pages/Orare/Orare";
import Navbar from "./Components/Navbar";
import Elevi from "./Pages/Elevi/Elevi";
import ElevPage from "./Pages/Elevi/ElevPage";
import ProfesorPage from "./Pages/Profesori/ProfesorPage";
import Profesori from "./Pages/Profesori/Profesori";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Orare />} />
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
