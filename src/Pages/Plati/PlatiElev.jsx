import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, orderBy } from "@progress/kendo-data-query";
import { Icon, Tab, Checkbox, Button } from "semantic-ui-react";
import "./Plati.css";
function PlatiElev() {
  const elevi = useSelector((state) => state.elevi);
  const id = useParams();
  const [elevData, setElevData] = useState({});
  const [deplatit, setDeplatit] = useState([]);
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
      neplatite = neplatite.map((neplatit) => {
        return {
          text: elevData.text,
          materie: meditatie.materie,
          profesor: meditatie.profesor,
          Pret: neplatit.Pret,
          data: new Date(neplatit.Start.seconds * 1000),
        };
      });
      if (neplatite?.length > 0) {
        if (
          deplatit.find((data) => data.TaskID === meditatie.TaskID) ===
          undefined
        )
          setDeplatit([
            ...deplatit,
            {
              numar: neplatite.length,
              suma: neplatite?.reduce((total, currentValue) => {
                return total + parseInt(currentValue.Pret);
              }, 0),
              profesor: meditatie.profesor,
              grupa: meditatie.grupa,
              materie: meditatie.materie,

              text: elevData.text,
              sedinte: neplatite,
              id: elevData.id,
              TaskID: meditatie.TaskID,
            },
          ]);
      }
    });
  }, [elevData]);
  console.log(deplatit);
  const panes = [
    {
      menuItem: "Sedinte Neplatite",
      render: () => (
        <Tab.Pane>
          {deplatit.map((meditatie, index) => {
            return (
              <div style={{ marginLeft: "3vw" }}>
                <div id="container">
                  <div class="first">
                    <Button
                      style={{ backgroundColor: "#32ba4d", color: "white" }}
                    >
                      Exporta Factura
                    </Button>
                  </div>
                  <h2 class="second">
                    {index +
                      1 +
                      ". " +
                      meditatie.materie +
                      "-" +
                      meditatie.profesor}
                  </h2>
                </div>
                <br />
                <Grid style={{}} data={meditatie.sedinte}>
                  <Column title="    Factura" cell={facturaCell} width="70px" />

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
            );
          })}
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
      <Tab panes={panes} />
    </>
  );
}

export default PlatiElev;
