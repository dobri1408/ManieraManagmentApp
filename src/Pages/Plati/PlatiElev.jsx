import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";

function PlatiElev() {
  const elevi = useSelector((state) => state.elevi);
  const id = useParams();
  const [elevData, setElevData] = useState({});
  useEffect(() => {
    setElevData(elevi.find((elev) => elev.id === id.id));
  }, [id]);

  return (
    <>
      <div
        style={{
          alignText: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h1>{elevData?.text} - Plati</h1>
      </div>
      <div
        style={{
          alignText: "center",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <h3>Cont:0</h3>
      </div>
    </>
  );
}

export default PlatiElev;
