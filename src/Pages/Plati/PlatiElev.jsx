import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { filterBy, orderBy } from "@progress/kendo-data-query";
import {
  Icon,
  Tab,
  Checkbox,
  Button,
  Input,
  Confirm,
  Accordion,
} from "semantic-ui-react";
import { doc, updateDoc, getDoc, setDoc } from "firebase/firestore";
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
///STERGE SELECTEDD ALL DUPA O ACTIUNE BOSS

function PlatiElev() {
  const elevi = useSelector((state) => state.elevi);
  const id = useParams();
  const [activeIndex, setActiveIndex] = useState();
  const handleAccordion = (value) => {
    if (activeIndex === value) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(value);
  };
  const elevData = useSelector((state) =>
    state.elevi.find((elev) => elev.id === id.id)
  );
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

  const paymentMethod = (props) => {
    const style = {
      color: "red",
    };
    if (props.dataItem["starePlata"] === "neplatit")
      return <td style={style}>{props.dataItem["Pret"]}</td>;
    else
      return (
        <td style={{ color: "green" }}>
          {props.dataItem["Pret"]}(A fost platita)
        </td>
      );
  };
  const ReturnDate = (props) => {
    console.log(props.dataItem["data"]);
    return (
      <td>
        {new Date(props.dataItem["data"].seconds * 1000).toLocaleDateString()}
      </td>
    );
  };
  const platesteCash = React.useCallback(
    async (dataItem) => {
      let docRef = doc(
        db,
        "sedinte",
        dataItem.sedintaID + Date.parse(dataItem.data)
      );
      let docSnap = await getDoc(docRef);
      let plati = docSnap.data().plati;
      plati[elevData.id].starePlata = "cash";

      await updateDoc(docRef, {
        plati: plati,
      });
      let elevRef = doc(db, "elevi", elevData.id);
      docSnap = await getDoc(elevRef);
      let meditatiii = docSnap.data().meditatii;
      let MeditatieToFind = elevData.meditatii.find(
        (meditatie) => meditatie.TaskID === dataItem.TaskID
      );
      let indexEL = elevData.meditatii.indexOf(MeditatieToFind);

      let sedinta = MeditatieToFind.sedinte.find(
        (sedinta) => sedinta.sedintaID === dataItem.sedintaID
      );
      let index = MeditatieToFind.sedinte.indexOf(sedinta);

      meditatiii[indexEL].sedinte[index].starePlata = "cash";

      await updateDoc(elevRef, {
        meditatii: meditatiii,
      });
      dispatch(getElevi());
    },
    [dispatch, elevData?.id, elevData?.meditatii]
  );
  const platesteCard = async (dataItem) => {
    //sedinte database
    let docRef = doc(
      db,
      "sedinte",
      dataItem.sedintaID + Date.parse(dataItem.data)
    );
    let docSnap = await getDoc(docRef);
    let plati = docSnap.data().plati;
    plati[elevData.id].starePlata = "cont";

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

    meditatiii[indexEL].sedinte[index].starePlata = "cont";

    await updateDoc(elevRef, {
      meditatii: [...meditatiii],
    });
    const washingtonRef = doc(db, "elevi", elevData.id);
    await updateDoc(washingtonRef, {
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

    dispatch(getElevi());
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
  const platesteCashAll = async () => {
    if (selectedSedinte.current.length > 0) {
      const elevRef = doc(db, "elevi", elevData.id);

      let meditatiii = JSON.parse(JSON.stringify(elevData.meditatii));
      selectedSedinte.current.forEach((dataItem) => {
        let MeditatieToFind = meditatiii.find(
          (meditatie) => meditatie.TaskID === dataItem.TaskID
        );
        let indexEL = meditatiii.indexOf(MeditatieToFind);

        let sedinta = MeditatieToFind.sedinte.find(
          (sedinta) => sedinta.sedintaID === dataItem.sedintaID
        );
        let index = MeditatieToFind.sedinte.indexOf(sedinta);

        meditatiii[indexEL].sedinte[index].starePlata = "cash";
      });

      await updateDoc(
        elevRef,
        {
          meditatii: meditatiii,
        },
        { merge: true }
      );

      dispatch(getElevi());
      selectedSedinte.current.forEach(async (dataItem) => {
        let docRef = doc(
          db,
          "sedinte",
          dataItem.sedintaID + Date.parse(dataItem.data)
        );
        let docSnap = getDoc(docRef);
        let plati = docSnap.data().plati;
        plati[elevData.id].starePlata = "cash";

        updateDoc(docRef, {
          plati: plati,
        });
      });
    }
  };
  const factura = async () => {
    console.log("inbtru");
    if (selectedSedinte.current.length > 0) {
      const elevRef = doc(db, "elevi", elevData.id);
      let facturi = JSON.parse(JSON.stringify(elevData.facturi || []));
      let today = new Date();
      let date =
        today.getFullYear() +
        "-" +
        (today.getMonth() + 1) +
        "-" +
        today.getDate();
      let scadenta = new Date();
      scadenta.setDate(today.getDate() + 20);
      let sedinte = [];
      selectedSedinte.current.forEach((sedinta) => {
        sedinte.push(sedinta);
      });
      let factura = {
        sedinte: sedinte,
        dataEmitere: date,
        scadenta: scadenta,
        numarFactura: facturi.length + 1,
      };
      facturi.push(factura);
      await updateDoc(elevRef, {
        facturi: facturi,
      });
    }
  };
  const platesteCardAll = async () => {
    if (selectedSedinte.current.length > 0) {
      const elevRef = doc(db, "elevi", elevData.id);

      let total = 0;
      let meditatiii = JSON.parse(JSON.stringify(elevData.meditatii));
      selectedSedinte.current.forEach((dataItem) => {
        let MeditatieToFind = meditatiii.find(
          (meditatie) => meditatie.TaskID === dataItem.TaskID
        );
        let indexEL = meditatiii.indexOf(MeditatieToFind);
        total += parseInt(dataItem.Pret);
        let sedinta = MeditatieToFind.sedinte.find(
          (sedinta) => sedinta.sedintaID === dataItem.sedintaID
        );
        let index = MeditatieToFind.sedinte.indexOf(sedinta);

        meditatiii[indexEL].sedinte[index].starePlata = "cont";
      });

      await updateDoc(
        elevRef,
        {
          meditatii: meditatiii,
        },
        { merge: true }
      );

      dispatch(getElevi());
      selectedSedinte.current.forEach(async (dataItem) => {
        let docRef = doc(
          db,
          "sedinte",
          dataItem.sedintaID + Date.parse(dataItem.data)
        );
        let docSnap = getDoc(docRef);
        let plati = docSnap.data().plati;
        plati[elevData.id].starePlata = "cont";

        await updateDoc(docRef, {
          plati: plati,
        });
      });
      await updateDoc(elevRef, {
        cont: parseInt(elevData.cont) - parseInt(total),
      });
    }
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
                  onClick={() => {
                    setWichAction("factura");
                    setConfirmationShow(true);
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
                  (total, cuurentValue) => total + parseInt(cuurentValue.Pret),
                  0
                ) <= parseInt(elevData?.cont) && (
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
                  (total, cuurentValue) => total + parseInt(cuurentValue.Pret),
                  0
                ) > parseInt(elevData?.cont) && (
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
      render: () => (
        <Tab.Pane>
          <Accordion styled style={{ width: "100%" }}>
            {
              //e obiect
              elevData.facturi.map((factura, index) => {
                return (
                  <>
                    <Accordion.Title
                      active={activeIndex === index}
                      index={0}
                      onClick={() => {
                        handleAccordion(index);
                      }}
                    >
                      <Icon name="dropdown" />
                      Factura nr O_{factura.numarFactura} -
                      <div style={{ color: "#32ba4d", fontWeight: "bold" }}>
                        Data Emitere: {factura.dataEmitere}
                      </div>
                      <div style={{ color: "red" }}>
                        {"               Total de plata: "}

                        {factura.sedinte
                          .sort(function (a, b) {
                            return a.dataEmitere - b.dataEmitere;
                          })
                          .reduce((total, sedinta) => {
                            if (sedinta.starePlata === "neplatit")
                              return total + parseInt(sedinta.Pret);
                            else return total;
                          }, 0)}
                      </div>
                      <div>
                        <div>
                          Data Scadenta:{" "}
                          {new Date(
                            factura?.scadenta.seconds * 1000
                          ).toLocaleDateString()}
                        </div>
                      </div>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === index}>
                      <div>
                        <Button
                          style={{
                            backgroundColor: "yellow",
                            color: "black",
                            width: "15vw",
                          }}
                        >
                          <Icon name="download" /> Descarca Factura
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

                        <Button style={{ color: "black", width: "15vw" }}>
                          <Icon
                            name="credit card outline"
                            style={{ color: "black" }}
                          />
                          Plateste din Cont
                        </Button>
                        <Button
                          style={{
                            backgroundColor: "#274653",
                            width: "15vw",
                            color: "white",
                          }}
                        >
                          <Icon name="staylinked" />
                          Plateste cu Link de Plata
                        </Button>
                      </div>
                      Sedinte:
                      <Grid
                        style={{}}
                        data={orderBy(factura.sedinte, sort)}
                        sortable={true}
                        sort={sort}
                        onSortChange={(e) => {
                          setSort(e.sort);
                        }}
                      >
                        <Column field="text" title="Numele Elevului" />
                        <Column field="data" title="Data" cell={ReturnDate} />

                        <Column
                          field="materie"
                          title="Materie"
                          filterable={false}
                        />
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
                          cell={paymentMethod}
                        />
                      </Grid>
                    </Accordion.Content>
                  </>
                );
              })
            }
          </Accordion>
        </Tab.Pane>
      ),
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
            else if (whichAction === "factura") factura();
            setConfirmationShow(false);
            selectedSedinte.current = [];
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
