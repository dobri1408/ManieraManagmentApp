import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import { useSelector } from "react-redux";
import { Grid, GridColumn as Column } from "@progress/kendo-react-grid";
import { orderBy } from "@progress/kendo-data-query";
import { platesteFacturaCash } from "../../Components/database/facturi/platesteCashFactura";
import { platesteFacturaCard } from "../../Components/database/facturi/platesteCardFactura";
import { getSedintaInfo } from "../../Components/database/sedinte/getSedintaInfo";
import { creeazaFactura } from "../../Components/database/facturi/creeazaFactura";
import { platesteCashSedinte } from "../../Components/database/plati/platesteCashSedinte";
import { platesteCardSedinte } from "../../Components/database/plati/platesteCardSedinte";
import {
  Icon,
  Tab,
  Checkbox,
  Button,
  Input,
  Confirm,
  Accordion,
} from "semantic-ui-react";
import { doc, updateDoc, getDoc } from "firebase/firestore";
import { db } from "../../firebase/firebase";
import "./Plati.css";
import { getElevi } from "../../redux/actions";
import { useDispatch } from "react-redux";
import ModalFactura from "../../Components/ModalFactura";
import { testSlice } from "../../redux/store";
const { actions } = testSlice;
const { ACTUALIZARE_ELEVI_Sedinte_Neplatite } = actions;
const initialSort = [
  {
    field: "materie",
    dir: "des",
  },
];
///STERGE SELECTEDD ALL DUPA O ACTIUNE BOSS
///O SEDINTA IN MAI MULTE FACturI nu se actualizeaza in toate
function PlatiElev() {
  const id = useParams();
  const [activeIndex, setActiveIndex] = useState();
  const [open, setOpen] = useState(false);
  const [dataFactura, setDataFactura] = useState({});
  const handleAccordion = (value) => {
    if (activeIndex === value) {
      setActiveIndex(null);
      return;
    }
    setActiveIndex(value);
  };
  const elevData = useSelector((state) => {
    return state.elevi.find((elev) => elev.id === id.id);
  });
  const eleviFromRedux = useSelector((state) => state.elevi);

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

  const platesteFacturaLinkDePlata = () => {};

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
  const dispatchRemove = (index, array) => {
    dispatch(ACTUALIZARE_ELEVI_Sedinte_Neplatite(index, array));
  };
  const ReturnDate = (props) => {
    return (
      <td>
        {new Date(props.dataItem["data"].seconds * 1000).toLocaleDateString()}
      </td>
    );
  };
  const platesteCash = async (dataItem) => {
    await platesteCashSedinte(0, { current: [dataItem] }, elevData);
  };
  const platesteCard = async (dataItem) => {
    await platesteCardSedinte(0, { current: [dataItem] }, elevData);
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
    console.log(props.dataItem.sedintaId);
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
          checked={checked[props.dataItem.sedintaId]}
          onChange={(e, data) => {
            let object = { ...checked };

            object[props.dataItem.sedintaId] = data.checked;

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
    if (selectedSedinte?.current?.length > 0) {
      let index = eleviFromRedux.indexOf(
        eleviFromRedux.find((element) => element.id === elevData.id)
      );

      await platesteCashSedinte(index, selectedSedinte, elevData).then(() => {
        dispatch(getElevi());
      });
    }
  };
  const factura = async () => {
    await creeazaFactura(selectedSedinte, elevData);
  };
  const platesteCardAll = async () => {
    if (selectedSedinte?.current?.length > 0) {
      let index = eleviFromRedux.indexOf(
        eleviFromRedux.find((element) => element.id === elevData.id)
      );

      let result = await platesteCardSedinte(index, selectedSedinte, elevData);
      console.log(index, result);
      dispatch(getElevi());
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

  const getDataSedinteNeplatite = async () => {
    let object = {};
    const array = [];
    await elevData?.sedinteNeplatite?.forEach(async (sedinta) => {
      let sedintaRef = doc(
        db,
        "sedinte",
        sedinta.sedintaID + Date.parse(new Date(sedinta.date.seconds * 1000))
      );
      let sedintaData = await getSedintaInfo(sedintaRef);

      array.push({
        profesor: sedintaData.profesor,
        materie: sedintaData.materie,
        text: elevData.text,
        id: elevData.id,
        sedintaId: sedintaData.TaskID,
        Pret: sedinta.Pret,
        sedintaRefFirebase: sedinta,
        data: new Date(sedinta.date.seconds * 1000),
      });
      object[sedintaData.TaskID] = false;
    });

    const timer = setTimeout(() => {
      setDeplatit(array);
      setChecked(object);
    }, 1000);
    return () => clearTimeout(timer);
  };

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    //    dispatch(getElevi());

    if (elevData?.sedinteNeplatite?.length > 0) {
      getDataSedinteNeplatite();
    } else {
      setDeplatit([]);
    }
  }, [elevData]);
  console.log(selectedSedinte, checked);
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
                    width: "12vw",
                  }}
                  onClick={() => {
                    setWichAction("platesteCashAll");
                    setConfirmationShow(true);
                  }}
                >
                  <Icon name="money bill" />
                  Plateste CASH
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
                          onClick={() => {
                            setOpen(true);
                            setDataFactura(factura);
                          }}
                        >
                          <Icon name="download" /> Descarca Factura
                        </Button>

                        <Button
                          style={{
                            backgroundColor: "#32ba4d",
                            color: "white",
                            width: "12vw",
                          }}
                          onClick={() => {
                            setWichAction("platesteFacturaCash");
                            setProosForAction(factura);
                            setConfirmationShow(true);
                          }}
                        >
                          <Icon name="money bill" />
                          Plateste CASH
                        </Button>

                        <Button
                          style={{ color: "black", width: "15vw" }}
                          onClick={() => {
                            setWichAction("platesteFacturaCard");
                            setProosForAction(factura);
                            setConfirmationShow(true);
                          }}
                        >
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
                          onClick={() => {
                            setWichAction("PlatesteFacturaLinkDePlata");
                            setConfirmationShow(true);
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
          onConfirm={async () => {
            if (whichAction === "onlyOneCash")
              platesteCash(propsForAction.dataItem);
            else if (whichAction === "onlyOneCard")
              platesteCard(propsForAction.dataItem);
            else if (whichAction === "platesteCashAll")
              await platesteCashAll().then(() => {
                console.log("se afla coi");
                dispatch(getElevi());
              });
            else if (whichAction === "platesteCardAll") platesteCardAll();
            else if (whichAction === "factura") factura();
            else if (whichAction === "platesteFacturaCash") {
              platesteFacturaCash(propsForAction, elevData);
            } else if (whichAction === "platesteFacturaCard") {
              platesteFacturaCard(propsForAction, elevData);
            } else if (whichAction === "PlatesteFacturaLinkDePlata")
              platesteFacturaLinkDePlata();
            setConfirmationShow(false);
            selectedSedinte.current = [];
            window.location.reload();
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
      <ModalFactura
        open={open}
        setOpen={setOpen}
        dataFactura={dataFactura}
        elev={elevData}
      />
    </>
  );
}

export default PlatiElev;
