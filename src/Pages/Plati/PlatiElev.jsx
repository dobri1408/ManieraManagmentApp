import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, orderBy } from "@progress/kendo-data-query";
import { Icon, Tab, Checkbox, Button, Input, Confirm } from "semantic-ui-react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./Plati.css";
import { getElevi } from "../../redux/actions";
import { useDispatch } from "react-redux";
import { arrayRemove } from "firebase/firestore";
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
  const selectedSedinte = useRef([]);
  const [checked, setChecked] = useState({});
  const [confirmationShow, setConfirmationShow] = useState(false);
  const [whichAction, setWichAction] = useState("none");
  const [propsForAction, setProosForAction] = useState({});
  useEffect(() => {
    setElevData(elevi.find((elev) => elev.id === id.id));
  }, [id, elevi]);
  const platesteCash = async (dataItem) => {
    console.log("intru aiciciici");
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
    let elevRef = doc(db, "elevi", elevData.id);
    let sedinta = MeditatieToFind.sedinte.find(
      (sedinta) => sedinta.sedintaID === dataItem.sedintaID
    );
    let index = MeditatieToFind.sedinte.indexOf(sedinta);
    meditatiii[indexEL].sedinte[index].starePlata = "platit";

    await updateDoc(elevRef, {
      meditatii: meditatiii,
    });
    dispatch(getElevi());
  };
  const platesteCard = async (dataItem) => {
    console.log("intru aiciciici");
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

    await updateDoc(elevRef, {
      meditatii: meditatiii,
    });
    const washingtonRef = doc(db, "elevi", elevData.id);
    await updateDoc(washingtonRef, {
      cont: parseInt(elevData.cont) - parseInt(sedinta.Pret),
    });
    setElevData({
      ...elevData,
      cont: parseInt(elevData.cont) - parseInt(sedinta.Pret),
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
        <Checkbox
          className="checker"
          checked={checked[props.dataItem.sedintaID]}
          onChange={(e, data) => {
            let object = { ...checked };
            object[props.dataItem.sedintaID] = data.checked;
            setChecked(object);
            if (data.checked === true) {
              selectedSedinte.current.push(props.dataItem);
            } else {
              let array = [...selectedSedinte.current];
              let index = array.indexOf(props.dataItem);
              if (index > -1) array.splice(index, 1);

              selectedSedinte.current = array;
            }
          }}
        />
      </td>
    );
  };
  const platesteCashAll = () => {
    if (selectedSedinte.current.length > 0)
      selectedSedinte.current.forEach(
        async (sedinta) => await platesteCash(sedinta)
      );
  };
  const platesteCardAll = () => {
    if (selectedSedinte.current.length > 0)
      selectedSedinte.current.forEach(
        async (sedinta) => await platesteCard(sedinta)
      );
  };

  const PlatesteCell = (props) => {
    return (
      <td>
        <Icon
          onClick={() => {
            setProosForAction(props);
            setWichAction("onlyOneCash");
            setConfirmationShow(true);
          }}
          name="money bill alternate"
          style={{ color: "#32ba4d", fontSize: "30px" }}
        />
      </td>
    );
  };
  const CardCell = (props) => {
    if (parseInt(elevData.cont) >= parseInt(props.dataItem["Pret"]))
      return (
        <td>
          <Icon
            name="credit card outline"
            style={{ fontSize: "30px" }}
            onClick={() => {
              setProosForAction(props);
              setWichAction("onlyOneCard");
              setConfirmationShow(true);
            }}
          />
        </td>
      );
    else return <td>Fonduri Insuficiente</td>;
  };

  useEffect(() => {
    let array = [];
    elevData?.meditatii?.forEach((meditatie) => {
      let neplatite = meditatie.sedinte.filter(
        (sedinta) => sedinta.starePlata === "neplatit"
      );

      if (neplatite?.length > 0) {
        let object = {};
        neplatite.forEach((sedinta) => {
          if (
            array.find((data) => data.sedintaID === sedinta.sedintaID) ===
            undefined
          ) {
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
              checked: false,
            });

            object[sedinta.sedintaID] = false;
          }
        });
        setChecked(object);
      }
    });
    setDeplatit(array);
  }, [elevData]);

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

                      let object = { ...checked };
                      for (const [key, value] of Object.entries(object)) {
                        object[key] = true;
                      }
                      selectedSedinte.current = [...deplatit];
                      setChecked(object);
                    }}
                  >
                    Selecteaza tot
                  </Button>
                )}
                {selectedAll && (
                  <Button
                    onClick={() => {
                      setSelectedAll(false);
                      let object = { ...checked };
                      for (const [key, value] of Object.entries(object)) {
                        object[key] = false;
                      }
                      setChecked(object);
                      selectedSedinte.current = [];
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
                  onClick={() => {
                    setWichAction("platesteCashAll");
                    setConfirmationShow(true);
                  }}
                >
                  <Icon name="money bill" />
                  Plateste
                </Button>
                {selectedSedinte.current.reduce(
                  (total, cuurentValue) => total + cuurentValue.Pret,
                  0
                ) <= elevData?.cont && (
                  <Button
                    style={{ color: "black", width: "12vw" }}
                    onClick={() => {
                      setWichAction("platesteCardAll");
                      setConfirmationShow(true);
                    }}
                  >
                    <Icon
                      name="credit card outline"
                      style={{ color: "black" }}
                    />
                    Plateste din Cont
                  </Button>
                )}
                {selectedSedinte.current.reduce(
                  (total, cuurentValue) => total + cuurentValue.Pret,
                  0
                ) > elevData?.cont && (
                  <Button style={{ backgroundColor: "grey" }} disable>
                    Fonduri Insuficiente
                  </Button>
                )}
              </div>
              <div style={{ paddingLeft: "69vw", color: "red" }}>
                <h2>
                  Total De Plata :{" "}
                  {deplatit.reduce(
                    (prev, current) => parseInt(prev) + parseInt(current.Pret),
                    0
                  )}
                </h2>
              </div>
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
        <Confirm
          style={{ position: "relative", width: "30vw", height: "20vh" }}
          open={confirmationShow}
          onCancel={() => {
            setConfirmationShow(false);
          }}
          content="Esti sigur?"
          onConfirm={() => {
            if (whichAction === "onlyOneCash")
              platesteCash(propsForAction.dataItem);
            else if (whichAction === "onlyOneCard")
              platesteCard(propsForAction.dataItem);
            else if (whichAction === "platesteCashAll") platesteCashAll();
            else if (whichAction === "platesteCardAll") platesteCardAll();
            setConfirmationShow(false);
          }}
        />
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
        <Icon name="credit card outline" style={{ fontSize: "30px" }} />
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
