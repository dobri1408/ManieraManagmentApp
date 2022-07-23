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
import { actualizeazaNumarFacturi } from "../../Components/database/facturi/actualizeazaNumarFacturi";
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

import { setExpandedState } from "@progress/kendo-react-data-tools";
const { actions } = testSlice;
const { ACTUALIZARE_ELEVI_Sedinte_Neplatite } = actions;
const {
  GET_FACTURI,
  ACTUALIZARE_ELEV_FACTURI_NEPLATITE,
  ACTUALIZARE_CONT_ELEV,
  ACTUALIZARE_NUMAR_FACTURI_ELEV,
} = actions;
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
  const [facturiData, setFacturiData] = useState([]);
  const facturiFromRedux = useSelector((state) => state.facturiNeplatite);
  const actualizeazaSedinteNeplatiteRedux = (selectedSedinte) => {
    let array = [];
    let index = eleviFromRedux.indexOf(elevData);
    for (let sedinta of elevData.sedinteNeplatite) {
      if (
        selectedSedinte.current.find(
          (sedintaSelectat) =>
            sedintaSelectat.sedintaRefFirebase.sedintaID === sedinta.sedintaID
        )
      )
        continue;
      array.push(sedinta);
    }
    dispatch(
      ACTUALIZARE_ELEVI_Sedinte_Neplatite({
        index: index,
        sedinteNeplatite: array,
      })
    );
  };
  const actualizeazaNumarFacturiRedux = (elevData, numarFacturi) => {
    let index = eleviFromRedux.indexOf(elevData);
    dispatch(
      ACTUALIZARE_NUMAR_FACTURI_ELEV({
        index: index,
        numarFacturi: numarFacturi,
      })
    );
  };

  const RenderScadenta = (scadenta) => {
    if (scadenta.seconds)
      return new Date(scadenta.seconds * 1000).toLocaleDateString();
    else return scadenta;
  };
  const actualizeazaContElevRedux = (cont) => {
    let index = eleviFromRedux.indexOf(elevData);
    dispatch(ACTUALIZARE_CONT_ELEV({ index: index, cont: cont }));
  };
  const actualizeazaFacturiRedux = (factura) => {
    let array = [];
    facturiFromRedux.forEach((fact) => array.push(fact));
    array.push(factura);
    dispatch(GET_FACTURI(array));
    let index = eleviFromRedux.indexOf(elevData);
    array = [];
    elevData.facturiNeplatite.forEach((fact) => {
      array.push(fact);
    });
    array.push(factura);
    dispatch(
      ACTUALIZARE_ELEV_FACTURI_NEPLATITE({
        index: index,
        facturiNeplatite: array,
      })
    );
  };
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

  const ReturnDate = (props) => {
    return (
      <td>
        {new Date(props.dataItem["data"]?.seconds * 1000).toLocaleDateString()}
      </td>
    );
  };
  const platesteCash = async (dataItem) => {
    actualizeazaSedinteNeplatiteRedux({ current: [dataItem] });
    let cont = parseInt(elevData.cont) - parseInt(dataItem.Pret);
    actualizeazaContElevRedux(cont);
    await platesteCashSedinte(0, { current: [dataItem] }, elevData);
  };
  const platesteCard = async (dataItem) => {
    actualizeazaSedinteNeplatiteRedux({ current: [dataItem] });
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
      actualizeazaSedinteNeplatiteRedux(selectedSedinte);
      let index = eleviFromRedux.indexOf(
        eleviFromRedux.find((element) => element.id === elevData.id)
      );

      return await platesteCashSedinte(index, selectedSedinte, elevData).then(
        () => {
          // dispatch(getElevi());
        }
      );
    }
  };
  const factura = async () => {
    const numarFacturi = elevData.numarFacturi + 1;
    let facturi = JSON.parse(JSON.stringify(elevData.facturiNeplatite || []));
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
      sedinte.push({ id: sedinta.sedintaId, date: sedinta.data });
    });
    let factura = {
      sedinte: sedinte,
      dataEmitere: date,
      scadenta: scadenta,
      numarFactura: elevData.numarFacturi + 1,
    };
    actualizeazaFacturiRedux(factura);
    actualizeazaNumarFacturiRedux(elevData, numarFacturi);
    await creeazaFactura(selectedSedinte, elevData);
    await actualizeazaNumarFacturi(elevData, numarFacturi);
  };
  const platesteCardAll = async () => {
    if (selectedSedinte?.current?.length > 0) {
      actualizeazaSedinteNeplatiteRedux(selectedSedinte);
      let index = eleviFromRedux.indexOf(
        eleviFromRedux.find((element) => element.id === elevData.id)
      );
      let cont =
        parseInt(elevData.cont) -
        selectedSedinte.current.reduce(
          (total, element) => total + parseInt(element.Pret),
          0
        );
      actualizeazaContElevRedux(cont);
      let result = await platesteCardSedinte(index, selectedSedinte, elevData);
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
      if (sedintaData)
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
      object[sedintaData?.TaskID] = false;
    });

    const timer = setTimeout(() => {
      setDeplatit(array);
      setChecked(object);
    }, 1000);
    return () => clearTimeout(timer);
  };

  const constructorFacturi = async () => {
    if (elevData?.facturiNeplatite) {
      let facturi = [];
      for (let factura of JSON.parse(
        JSON.stringify(elevData?.facturiNeplatite)
      )) {
        let array = [];
        for (let sedinta of factura.sedinte) {
          let getSedintaData = await getSedintaInfo(
            doc(db, "sedinte", sedinta.id)
          );

          if (getSedintaData)
            array.push({
              ...getSedintaData,
              text: elevData.text,
              Pret: getSedintaData.pretPerSedinta,
              data: getSedintaData.Start,
              starePlata: getSedintaData.plati[elevData.id].starePlata,
            });
        }
        facturi.push({
          ...factura,
          sedinte: array,
        });
      }

      dispatch(GET_FACTURI(facturi));
    }
  };

  useEffect(() => {
    constructorFacturi();
  }, [elevData]);
  useEffect(() => {
    if (elevData?.sedinteNeplatite?.length > 0) {
      getDataSedinteNeplatite();
    } else {
      setDeplatit([]);
    }
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
                  {deplatit?.reduce(
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
      menuItem: "Facturi Neplatite",
      render: () => (
        <Tab.Pane>
          <Accordion styled style={{ width: "100%" }}>
            {
              //e obiect
              facturiFromRedux?.map((factura, index) => {
                console.log({ factura });
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
                      Factura nr O_{factura?.numarFactura} -
                      <div
                        style={{ color: "red", display: "flex", gap: "10px" }}
                      >
                        {"               Total de plata: "}

                        {factura?.sedinte?.reduce((total, sedinta) => {
                          if (sedinta.starePlata === "neplatit")
                            return total + parseInt(sedinta.Pret);
                          else return total;
                        }, 0)}
                        {factura?.sedinte?.reduce((total, sedinta) => {
                          if (sedinta.starePlata === "neplatit")
                            return total + parseInt(sedinta.Pret);
                          else return total;
                        }, 0) === 0 && (
                          <p style={{ color: "green", fontWeight: "bold" }}>
                            (PLATITA)
                          </p>
                        )}
                      </div>
                      <div style={{ color: "#9B870D", fontWeight: "bold" }}>
                        Data Emitere: {factura?.dataEmitere}
                      </div>
                      <div>
                        <div>
                          Data Scadenta: {RenderScadenta(factura.scadenta)}
                        </div>
                      </div>
                    </Accordion.Title>
                    <Accordion.Content active={activeIndex === index}>
                      <div style={{ display: "flex" }}>
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
                        {factura?.sedinte?.reduce((total, sedinta) => {
                          if (sedinta.starePlata === "neplatit")
                            return total + parseInt(sedinta.Pret);
                          else return total;
                        }, 0) > 0 && (
                          <div>
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
                        )}
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
    {
      menuItem: "Facturi Platite",
      render: () => {
        <> </>;
      },
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
            if (whichAction === "onlyOneCash") {
              await platesteCash(propsForAction.dataItem);
            } else if (whichAction === "onlyOneCard") {
              await platesteCard(propsForAction.dataItem);
            } else if (whichAction === "platesteCashAll") {
              await platesteCashAll().then(() => {
                // window.location.reload();
              });
            } else if (whichAction === "platesteCardAll") {
              await platesteCardAll();
            } else if (whichAction === "factura") {
              await factura();
            } else if (whichAction === "platesteFacturaCash") {
              platesteFacturaCash(propsForAction, elevData);
            } else if (whichAction === "platesteFacturaCard") {
              platesteFacturaCard(propsForAction, elevData);
            } else if (whichAction === "PlatesteFacturaLinkDePlata") {
              platesteFacturaLinkDePlata();
            }
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
