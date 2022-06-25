import logo from "./logo.svg";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Orare from "./Pages/Orare/Orare";
import Navbar from "./Components/Navbar";
import Elevi from "./Pages/Elevi/Elevi";
function App() {
  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<Orare />} />
          <Route path="/elevi" element={<Elevi />} />
        </Routes>
      </Router>
    </>
  );
}

export default App;
