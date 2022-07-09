import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, orderBy } from "@progress/kendo-data-query";
import { Icon, Tab, Checkbox, Button, Input } from "semantic-ui-react";
import {
  doc,
  updateDoc,
  getDoc,
  arrayRemove,
  arrayUnion,
} from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./Plati.css";
import { getElevi } from "../../redux/actions";
import { useDispatch } from "react-redux";
const initialSort = [
  {
    field: "materie",
    dir: "des",
  },
];

function PlatiElev() {
  const elevi = useSelector((state) => state.elevi);
  const id = useParams();
  const [elevData, setElevData] = useState({});
  const [deplatit, setDeplatit] = useState([]);
  const [adauga, setAdauga] = useState(false);
  const [selectedAll, setSelectedAll] = useState(false);
  const [addMoney, setAddMoney] = useState(0);
  const dispatch = useDispatch();
  const [sort, setSort] = React.useState(initialSort);
  useEffect(() => {
    setElevData(elevi.find((elev) => elev.id === id.id));
  }, [id, elevi]);
  const platesteCash = async (dataItem) => {
    //sedinte database
    let docRef = doc(
      db,
      "sedinte",
      dataItem.sedintaID + Date.parse(dataItem.data)
    );
    let docSnap = await getDoc(docRef);
    let plati = docSnap.data().plati;
    plati[elevData.id].starePlata = "platit";

    await updateDoc(docRef, {
      plati: plati,
    });

    let MeditatieToFind = elevData.meditatii.find(
      (meditatie) => meditatie.TaskID === dataItem.TaskID
    );
    let indexEL = elevData.meditatii.indexOf(MeditatieToFind);
    let meditatiii = JSON.parse(JSON.stringify(elevData.meditatii));
    let indexIDK = 0;
    let elevRef = doc(db, "elevi", elevData.id);
    let sedinta = MeditatieToFind.sedinte.find(
      (sedinta) => sedinta.sedintaID === dataItem.sedintaID
    );
    let index = MeditatieToFind.sedinte.indexOf(sedinta);
    meditatiii[indexEL].sedinte[index].starePlata = "platit";
    console.log(MeditatieToFind, "bag");
    await updateDoc(elevRef, {
      meditatii: meditatiii,
    });
    dispatch(getElevi());
  };
  const cellWithBackGround = (props) => {
    const style = {
      color: "red",
    };
    const field = props.field || "";
    return <td style={style}>{props.dataItem[field]}</td>;
  };
  const addMoneyToCont = async () => {
    const washingtonRef = doc(db, "elevi", elevData.id);
    await updateDoc(washingtonRef, {
      cont: parseInt(elevData.cont) + parseInt(addMoney),
    });
    setElevData({
      ...elevData,
      cont: parseInt(elevData.cont) + parseInt(addMoney),
    });
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
          onClick={() => {
            platesteCash(props.dataItem);
          }}
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
    let array = [];
    elevData?.meditatii?.forEach((meditatie) => {
      let neplatite = meditatie.sedinte.filter(
        (sedinta) => sedinta.starePlata === "neplatit"
      );

      if (neplatite?.length > 0) {
        neplatite.forEach((sedinta) => {
          if (
            array.find((data) => data.sedintaID === sedinta.sedintaID) ===
            undefined
          )
            array.push({
              profesor: meditatie.profesor,
              grupa: meditatie.grupa,
              materie: meditatie.materie,
              text: elevData.text,
              id: elevData.id,
              sedintaID: sedinta.sedintaID,
              starePlata: sedinta.starePlata,
              Pret: sedinta.Pret,
              data: new Date(sedinta.Start.seconds * 1000),
              TaskID: meditatie.TaskID,
            });
        });
      }
    });
    setDeplatit(array);
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

              <Grid
                style={{}}
                data={orderBy(deplatit, sort)}
                sortable={true}
                sort={sort}
                onSortChange={(e) => {
                  setSort(e.sort);
                }}
              >
                <Column title="Selecteaza" cell={facturaCell} width="90px" />

                <Column field="text" title="Numele Elevului" />
                <Column field="data" title="Data" />

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
                  title="Plateste cash"
                  filterable={false}
                  cell={PlatesteCell}
                  width="110px"
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
        <h3> Cont:{elevData?.cont}</h3>
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
            <Input
              placeholder="Suma"
              type="number"
              value={addMoney}
              onChange={(e) => setAddMoney(e.target.value)}
            />
            <Button
              style={{ backgroundColor: "#21ba45", color: "white" }}
              onClick={async () => {
                await addMoneyToCont();

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
