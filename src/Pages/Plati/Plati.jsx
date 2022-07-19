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
    let elevFinancialDataArray = [];

    elevi.forEach((elev) => {
      let financialData = {
        text: elev?.text,
        numar: elev?.sedinteNeplatite?.length || 0,
        theOldest:
          new Date(
            elev?.sedinteNeplatite?.reduce(
              (total, current) =>
                Math.min(total, new Date(current.date.seconds * 1000)),
              new Date()
            )
          ) || "-",
        suma:
          elev?.sedinteNeplatite?.reduce(
            (total, current) => total + parseInt(current.Pret),
            0
          ) || 0,
        id: elev.id,
      };
      elevFinancialDataArray.push(financialData);
    });
    setFinancialData(elevFinancialDataArray);
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
