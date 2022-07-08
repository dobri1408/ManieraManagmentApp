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

const sampleProducts = [
  {
    ProductID: 1,
    ProductName: "Chai",
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: "10 boxes x 20 bags",
    UnitPrice: 18,
    UnitsInStock: 39,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
      CategoryID: 1,
      CategoryName: "Beverages",
      Description: "Soft drinks, coffees, teas, beers, and ales",
    },
    FirstOrderedOn: new Date(1996, 8, 20),
  },
  {
    ProductID: 2,
    ProductName: "Chang",
    SupplierID: 1,
    CategoryID: 1,
    QuantityPerUnit: "24 - 12 oz bottles",
    UnitPrice: 19,
    UnitsInStock: 17,
    UnitsOnOrder: 40,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 1,
      CategoryName: "Beverages",
      Description: "Soft drinks, coffees, teas, beers, and ales",
    },
    FirstOrderedOn: new Date(1996, 7, 12),
  },
  {
    ProductID: 3,
    ProductName: "Aniseed Syrup",
    SupplierID: 1,
    CategoryID: 2,
    QuantityPerUnit: "12 - 550 ml bottles",
    UnitPrice: 10,
    UnitsInStock: 13,
    UnitsOnOrder: 70,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
    FirstOrderedOn: new Date(1996, 8, 26),
  },
  {
    ProductID: 4,
    ProductName: "Chef Anton's Cajun Seasoning",
    SupplierID: 2,
    CategoryID: 2,
    QuantityPerUnit: "48 - 6 oz jars",
    UnitPrice: 22,
    UnitsInStock: 53,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
    FirstOrderedOn: new Date(1996, 9, 19),
  },
  {
    ProductID: 5,
    ProductName: "Chef Anton's Gumbo Mix",
    SupplierID: 2,
    CategoryID: 2,
    QuantityPerUnit: "36 boxes",
    UnitPrice: 21.35,
    UnitsInStock: 0,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
    FirstOrderedOn: new Date(1996, 7, 17),
  },
  {
    ProductID: 6,
    ProductName: "Grandma's Boysenberry Spread",
    SupplierID: 3,
    CategoryID: 2,
    QuantityPerUnit: "12 - 8 oz jars",
    UnitPrice: 25,
    UnitsInStock: 120,
    UnitsOnOrder: 0,
    ReorderLevel: 25,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
    FirstOrderedOn: new Date(1996, 9, 19),
  },
  {
    ProductID: 7,
    ProductName: "Uncle Bob's Organic Dried Pears",
    SupplierID: 3,
    CategoryID: 7,
    QuantityPerUnit: "12 - 1 lb pkgs.",
    UnitPrice: 30,
    UnitsInStock: 15,
    UnitsOnOrder: 0,
    ReorderLevel: 10,
    Discontinued: false,
    Category: {
      CategoryID: 7,
      CategoryName: "Produce",
      Description: "Dried fruit and bean curd",
    },
    FirstOrderedOn: new Date(1996, 7, 22),
  },
  {
    ProductID: 8,
    ProductName: "Northwoods Cranberry Sauce",
    SupplierID: 3,
    CategoryID: 2,
    QuantityPerUnit: "12 - 12 oz jars",
    UnitPrice: 40,
    UnitsInStock: 6,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 2,
      CategoryName: "Condiments",
      Description: "Sweet and savory sauces, relishes, spreads, and seasonings",
    },
    FirstOrderedOn: new Date(1996, 11, 1),
  },
  {
    ProductID: 9,
    ProductName: "Mishi Kobe Niku",
    SupplierID: 4,
    CategoryID: 6,
    QuantityPerUnit: "18 - 500 g pkgs.",
    UnitPrice: 97,
    UnitsInStock: 29,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: true,
    Category: {
      CategoryID: 6,
      CategoryName: "Meat/Poultry",
      Description: "Prepared meats",
    },
    FirstOrderedOn: new Date(1997, 1, 21),
  },
  {
    ProductID: 10,
    ProductName: "Ikura",
    SupplierID: 4,
    CategoryID: 8,
    QuantityPerUnit: "12 - 200 ml jars",
    UnitPrice: 31,
    UnitsInStock: 31,
    UnitsOnOrder: 0,
    ReorderLevel: 0,
    Discontinued: false,
    Category: {
      CategoryID: 8,
      CategoryName: "Seafood",
      Description: "Seaweed and fish",
    },
    FirstOrderedOn: new Date(1996, 8, 5),
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
  useEffect(() => {
    if (elevi === undefined) return;

    elevi.forEach((elev) => {
      elev.meditatii.forEach((meditatie) => {
        const neplatite = meditatie.sedinte.filter(
          (sedinta) => sedinta.starePlata === "neplatit"
        );
        console.log({ neplatite });
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
  console.log(financialData);
  console.log(elevi);
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
        <Column field="text" title="Numele Elevului" />
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
