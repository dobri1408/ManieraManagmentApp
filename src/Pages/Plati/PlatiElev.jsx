import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, orderBy } from "@progress/kendo-data-query";
import { Icon, Tab, Checkbox, Button, Input } from "semantic-ui-react";
import "./Plati.css";
function PlatiElev() {
  const elevi = useSelector((state) => state.elevi);
  const id = useParams();
  const [elevData, setElevData] = useState({});
  const [deplatit, setDeplatit] = useState([]);
  const [adauga, setAdauga] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);
  useEffect(() => {
    setElevData(elevi.find((elev) => elev.id === id.id));
  }, [id]);
  const cellWithBackGround = (props) => {
    const style = {
      color: "red",
    };
    const field = props.field || "";
    return <td style={style}>{props.dataItem[field]}</td>;
  };

  const facturaCell = (props) => {
    return (
      <td
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          paddingTop: "1vw",
        }}
      >
        <Checkbox />
      </td>
    );
  };
  const PlatesteCell = (props) => {
    return (
      <td>
        <Icon
          name="money bill alternate"
          style={{ color: "#32ba4d", fontSize: "30px" }}
        />
      </td>
    );
  };
  const CardCell = (props) => {
    return (
      <td>
        <Icon name="credit card" style={{ fontSize: "30px" }} />
      </td>
    );
  };

  useEffect(() => {
    elevData?.meditatii?.forEach((meditatie) => {
      let neplatite = meditatie.sedinte.filter(
        (sedinta) => sedinta.starePlata === "neplatit"
      );

      if (neplatite?.length > 0) {
        neplatite.forEach((sedinta) => {
          if (
            deplatit.find((data) => data.sedintaID === sedinta.sedintaID) ===
            undefined
          )
            setDeplatit([
              ...deplatit,
              {
                profesor: meditatie.profesor,
                grupa: meditatie.grupa,
                materie: meditatie.materie,

                text: elevData.text,
                sedinte: neplatite,
                id: elevData.id,
                sedintaID: sedinta.sedintaID,
                Pret: sedinta.Pret,
                data: new Date(sedinta.Start.seconds * 1000),
              },
            ]);
        });
      }
    });
  }, [elevData]);
  console.log(deplatit);
  const panes = [
    {
      menuItem: "Sedinte Neplatite",
      render: () => (
        <Tab.Pane>
          <div style={{ marginLeft: "3vw" }}>
            <div id="container">
              <div class="first">
                {!selectedAll && (
                  <Button
                    onClick={() => {
                      setSelectedAll(true);
                    }}
                  >
                    Selecteaza tot
                  </Button>
                )}
                {selectedAll && (
                  <Button
                    onClick={() => {
                      setSelectedAll(false);
                    }}
                  >
                    Deselecteaza
                  </Button>
                )}
                <Button
                  style={{
                    backgroundColor: "yellow",
                    color: "black",
                    width: "11.5vw",
                  }}
                >
                  <Icon name="file" />
                  Exporta Factura
                </Button>
                <Button
                  style={{
                    backgroundColor: "#32ba4d",
                    color: "white",
                    width: "7.9vw",
                  }}
                >
                  <Icon name="money bill" />
                  Plateste
                </Button>
                <Button style={{ color: "black", width: "12vw" }}>
                  <Icon name="credit card" style={{ color: "black" }} />
                  Plateste din Cont
                </Button>
              </div>

              <br />

              <br />
              <br />

              <Grid style={{}} data={deplatit}>
                <Column title="Selecteaza" cell={facturaCell} width="90px" />

                <Column field="text" title="Numele Elevului" />
                <Column field="materie" title="Materie" filterable={false} />
                <Column
                  field="profesor"
                  filter="string"
                  title="Profesor"
                  filterable={false}
                />
                <Column
                  field="Pret"
                  title="Suma de Platit"
                  filterable={false}
                  cell={cellWithBackGround}
                />
                <Column
                  title="Plateste"
                  filterable={false}
                  cell={PlatesteCell}
                  width="100px"
                />
                <Column
                  title="Plata din cont"
                  filterable={false}
                  cell={CardCell}
                  width="120px"
                />
              </Grid>
            </div>
          </div>
        </Tab.Pane>
      ),
    },
    {
      menuItem: "Facturi",
    },
  ];
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
      <br />
      <div
        style={{
          alignText: "center",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
        <Icon name="credit card" style={{ fontSize: "30px" }} />
        <h3> Cont:0</h3>
      </div>
      <br />
      <div
        style={{
          alignText: "center",
          display: "flex",
          justifyContent: "center",
          gap: "10px",
        }}
      >
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
      <Tab panes={panes} />
    </>
  );
}

export default PlatiElev;
