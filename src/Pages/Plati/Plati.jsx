import React from "react";
import { useState, useEffect } from "react";
import { Button } from "@progress/kendo-react-buttons";
import { Input, Segment } from "semantic-ui-react";
import { Image, Loader } from "semantic-ui-react";

import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, orderBy } from "@progress/kendo-data-query";

const initialSort = [
  {
    field: "Suma",
    dir: "des",
  },
];

const cellWithBackGround = (props) => {
  const style = {
    color: "red",
  };
  const field = props.field || "";
  return <td style={style}>{props.dataItem[field]}</td>;
};

export default function Plati() {
  const elevi = useSelector((state) => state.elevi);
  const [filter, setFilter] = React.useState();
  const [financialData, setFinancialData] = useState([]);
  const [sort, setSort] = React.useState(initialSort);
  const navigate = useNavigate();

  useEffect(() => {
    if (elevi === undefined) return;

    elevi.forEach((elev) => {
      elev.meditatii.forEach((meditatie) => {
        const neplatite = meditatie.sedinte.filter(
          (sedinta) => sedinta.starePlata === "neplatit"
        );

        if (neplatite?.length > 0) {
          if (
            financialData.find((data) => data.TaskID === meditatie.TaskID) ===
            undefined
          )
            setFinancialData([
              ...financialData,
              {
                numar: neplatite.length,
                suma: neplatite?.reduce((total, currentValue) => {
                  return total + parseInt(currentValue.Pret);
                }, 0),
                profesor: meditatie.profesor,
                grupa: meditatie.grupa,
                materie: meditatie.materie,
                theOldest: new Date(
                  neplatite?.reduce((total, currentValue) => {
                    return Math.min(total, currentValue.Start.seconds);
                  }, neplatite[0].Start.seconds) * 1000
                ),
                text: elev.text,
                id: elev.id,
                TaskID: meditatie.TaskID,
              },
            ]);
        }
      });
    });
  }, [elevi]);

  return (
    <>
      <h2>Plati</h2>
      <br />
      <Grid
        style={{}}
        data={orderBy(filterBy(financialData, filter), sort)}
        sortable={true}
        sort={sort}
        onSortChange={(e) => {
          setSort(e.sort);
        }}
        filterable={true}
        filter={filter}
        onFilterChange={(e) => setFilter(e.filter)}
      >
        <Column
          field="text"
          title="Numele Elevului"
          cell={(props) => {
            return (
              <td
                onClick={() => {
                  navigate(`/plati-elev/${props.dataItem["id"]}`);
                }}
                style={{ color: "blue", textDecoration: "underline" }}
              >
                {props.dataItem["text"]}
              </td>
            );
          }}
        />
        <Column field="materie" title="Materie" filterable={false} />
        <Column
          field="profesor"
          filter="string"
          title="Profesor"
          filterable={false}
        />
        <Column
          field="numar"
          title="Numar Sedinte Neplatite"
          filterable={false}
        />
        <Column
          field="theOldest"
          filter="date"
          title="Cea mai veche sedinta neplatita"
          filterable={false}
        />
        <Column
          field="suma"
          title="Suma de Platit"
          filterable={false}
          cell={cellWithBackGround}
        />
      </Grid>
    </>
  );
}
