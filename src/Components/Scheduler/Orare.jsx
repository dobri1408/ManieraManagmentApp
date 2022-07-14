import * as React from "react";
import { guid } from "@progress/kendo-react-common";
import { timezoneNames } from "@progress/kendo-date-math";
import { load, loadMessages } from "@progress/kendo-react-intl";
import { Day } from "@progress/kendo-date-math";
import { Button } from "semantic-ui-react";
import { CustomViewSlot } from "./custom-view-slot";
import { EditItemWithDynamicTitle } from "./custom-item";
import { FormWithCustomEditor } from "./custom-form";
import {
  Scheduler,
  TimelineView,
  DayView,
  WeekView,
  MonthView,
  AgendaView,
} from "@progress/kendo-react-scheduler";
import { FormWithCustomDialog } from "./custom-form";
import weekData from "cldr-core/supplemental/weekData.json";
import currencyData from "cldr-core/supplemental/currencyData.json";
import likelySubtags from "cldr-core/supplemental/likelySubtags.json";
import numbers from "cldr-numbers-full/main/es/numbers.json";
import dateFields from "cldr-dates-full/main/es/dateFields.json";
import currencies from "cldr-numbers-full/main/es/currencies.json";
import caGregorian from "cldr-dates-full/main/es/ca-gregorian.json";
import timeZoneNames from "cldr-dates-full/main/es/timeZoneNames.json";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { db } from "../../firebase/firebase";
import { getElevi } from "../../redux/actions";

import {
  doc,
  setDoc,
  getDocs,
  collection,
  updateDoc,
  deleteDoc,
} from "firebase/firestore";
import "@progress/kendo-date-math/tz/Europe/Bucharest";
import { getRandomColor } from "../../utils/utils";
import esMessages from "./es.json";
import { useSelector, useDispatch } from "react-redux";
import { sampleDataWithCustomSchema } from "./events-utc.js";
import { testSlice } from "../../redux/store";
const { actions } = testSlice;
const { PLATI } = actions;
load(
  likelySubtags,
  currencyData,
  weekData,
  numbers,
  currencies,
  caGregorian,
  dateFields,
  timeZoneNames
);
loadMessages(esMessages, "es-ES");
export const customModelFields = {
  id: "TaskID",
  title: "Title",
  description: "Description",
  start: "Start",
  end: "End",
  recurrenceRule: "RecurrenceRule",
  recurrenceId: "RecurrenceID",
  recurrenceExceptions: "RecurrenceException",
};
function Orare({ resources, materiiFromDataBase, meditatii, orientare }) {
  const locales = [
    {
      language: "en-US",
      locale: "en",
    },
    {
      language: "es-ES",
      locale: "es",
    },
  ];

  const [view, setView] = React.useState("day");
  //const [date, setDate] = React.useState(displayDate);
  const [locale, setLocale] = React.useState(locales[0]);
  const [groupingArray, setGroupingArray] = React.useState([]);
  const [selectedSali, setSelectedSali] = React.useState([]);
  const [sali, setSali] = React.useState([]);
  const [selectedProfesori, setSelectedProfesori] = React.useState([]);
  const [selectedElevi, setSelectedElevi] = React.useState([]);
  const [profesori, setProfesori] = React.useState([]);
  const [elevi, setElevi] = React.useState([]);
  const [materii, setMaterii] = React.useState([]);
  const [selectedMaterii, setSelectedMaterii] = React.useState([]);
  const [orientation, setOrientation] = React.useState("horizontal");
  const [data, setData] = React.useState([]);
  const [updatedData, setUpdatedData] = React.useState([]);
  const [Resources, setResources] = React.useState(resources);
  const [date, setDate] = React.useState(new Date());
  const [orarPrincipal, setOrarPrincipal] = React.useState(0);
  const [numberOfCells, setNumberOfCells] = React.useState(1);
  const eleviFromRedux = useSelector((state) => state.elevi);
  const profesoriFromRedux = useSelector((state) => state.profesori);
  const plati = useSelector((state) => state.plati);
  const dispatch = useDispatch();

  const divs = React.useRef(
    document.getElementsByClassName("k-scheduler-body")
  );
  const handleViewChange = React.useCallback(
    (event) => {
      setView(event.value);
    },
    [setView]
  );
  React.useEffect(() => {
    setResources(resources);
  }, [resources]);

  React.useEffect(() => {
    if (orientare.tip === "sali") {
      if (sali.length > 0) setSelectedSali([...sali]);
      setSelectedMaterii([]);
      setSelectedElevi([]);
      setSelectedProfesori([]);
    } else if (orientare.tip === "elev") {
      setSelectedElevi([orientare.text]);
      setSelectedMaterii([]);

      setSelectedProfesori([]);
    }
  }, [sali, orarPrincipal, orientare.tip, orientare.text]);
  async function addMeditatieToDatabase(meditatie, plati) {
    let id = meditatie.TaskID;
    if (
      meditatie.hasOwnProperty("originalStart") &&
      meditatie.originalStart === undefined
    )
      delete meditatie.originalStart;
    if (
      meditatie.hasOwnProperty("RecurrenceID") &&
      meditatie.RecurrenceID === undefined
    )
      delete meditatie.RecurrenceID;

    if (
      meditatie.hasOwnProperty("RecurrenceException") &&
      meditatie.RecurrenceException === undefined
    )
      delete meditatie.RecurrenceException;

    await setDoc(doc(db, "meditatii", id), {
      ...meditatie,
    });

    const profesorDeLaMedite = profesoriFromRedux.find(
      (prof) => prof.id === meditatie.PersonIDs
    )?.text;
    const grupaDeElevi = meditatie.ElevID.map(
      (elevID) => eleviFromRedux.find((elev) => elev.id === elevID)?.text
    );

    await setDoc(
      doc(db, "sedinte", id + Date.parse(meditatie.Start)),
      {
        Start: meditatie.Start,
        TaskID: id + Date.parse(meditatie.Start),
        plati: plati,
      },
      { merge: true }
    );

    let actuallyTheGodID = meditatie.TaskID;
    if (meditatie.RecurrenceID) meditatie.TaskID = meditatie.RecurrenceID;
    id = meditatie.TaskID;
    meditatie.ElevID.forEach(async (elevId) => {
      const elev = eleviFromRedux.find((elev) => elev.id === elevId);
      let meditatiiOfElev = [];
      if (elev?.meditatii?.length > 0) meditatiiOfElev = [...elev.meditatii];
      let frecventa;
      if (
        meditatie.RecurrenceRule === undefined ||
        meditatie.RecurrenceRule === null ||
        meditatie.RecurrenceRule === ""
      )
        frecventa = "Nu este periodica";
      else {
        let matches = meditatie.RecurrenceRule.match(/(\d+)/);
        if (matches) frecventa = `Periodica la ${matches[0]}`;
        if (meditatie.RecurrenceRule.includes("WEEKLY"))
          frecventa += " saptamani";
        else if (meditatie.RecurrenceRule.includes("WEEKLY"))
          frecventa += " zile";
      }
      let cont = parseInt(elev.cont);
      if (
        meditatiiOfElev.find(
          (meditatieOfElev) => meditatieOfElev.TaskID === meditatie.TaskID
        ) === undefined
      ) {
        //CREARE MEDITATIE NOUA

        const sedinte = [];

        if (meditatie.Efectuata) {
          sedinte.push({
            Start: meditatie.Start,
            TaskID: id + Date.parse(meditatie.Start),
            starePlata: plati[elev.id].starePlata,
            Pret: meditatie.Pret,
            sedintaID: actuallyTheGodID,
          });
          if (plati[elev.id].starePlata === "cont") {
            cont -= parseInt(meditatie.Pret);
          }
        }
        console.log("1", cont);
        console.log(
          JSON.stringify({
            ...elev,
            cont,
            meditatii: [
              ...meditatiiOfElev,
              {
                TaskID: meditatie.TaskID,
                grupa: grupaDeElevi,
                profesor: profesorDeLaMedite,
                pretPerSedinta: meditatie.Pret,
                materie: meditatie.MateriiIDs,
                Start: meditatie.Start,
                END: meditatie.End,
                seMaiTine: true,
                frecventa: frecventa,
                sedinte: sedinte,
              },
            ],
          })
        );

        await setDoc(doc(db, "elevi", elev.id), {
          ...elev,
          cont,
          meditatii: [
            ...meditatiiOfElev,
            {
              TaskID: meditatie.TaskID,
              grupa: grupaDeElevi,
              profesor: profesorDeLaMedite,
              pretPerSedinta: meditatie.Pret,
              materie: meditatie.MateriiIDs,
              Start: meditatie.Start,
              END: meditatie.End,
              seMaiTine: true,
              frecventa: frecventa,
              sedinte: sedinte,
            },
          ],
        });
      } else {
        const elment = meditatiiOfElev.find(
          (medi) => medi.TaskID === meditatie.TaskID
        );

        const index = meditatiiOfElev.indexOf(elment);
        //search for the sedintat
        const sedintaObject = {
          Start: meditatie.Start,
          TaskID: id + Date.parse(meditatie.Start),

          starePlata: plati[elev.id].starePlata,
          Pret: meditatie.Pret,
          sedintaID: actuallyTheGodID,
        };
        const whereIsSedinta = meditatiiOfElev[index]?.sedinte?.find(
          (sedinta) => sedinta.TaskID === sedintaObject.TaskID
        );
        const indexSedinta =
          meditatiiOfElev[index]?.sedinte?.indexOf(whereIsSedinta);
        let sedinte = [];
        if (indexSedinta === -1) {
          if (meditatiiOfElev[index]?.sedinte?.length > 0)
            sedinte = [...meditatiiOfElev[index].sedinte];
          if (meditatie.Efectuata) {
            sedinte.push(sedintaObject);
            if (plati[elev.id].starePlata === "cont") {
              cont -= parseInt(meditatie.Pret);
              console.log("coc", cont);
            }
          }
          console.log("2", cont);
        } else {
          sedinte = [...meditatiiOfElev[index].sedinte];
          if (meditatie.Efectuata) {
            sedinte[indexSedinta] = sedintaObject;
            if (plati[elev.id].starePlata === "cont") {
              cont -= parseInt(meditatie.Pret);
            }
            console.log("3", cont);
          }
        }

        meditatiiOfElev[index] = {
          TaskID: meditatie.TaskID,
          grupa: grupaDeElevi,
          profesor: profesorDeLaMedite,
          pretPerSedinta: meditatie.Pret,
          materie: meditatie.MateriiIDs,
          Start: meditatie.Start,
          END: meditatie.End,
          seMaiTine: true,
          frecventa: frecventa,
          sedinte: sedinte,
        };
        console.log(
          JSON.stringify({
            ...elev,
            cont: cont,
            meditatii: [...meditatiiOfElev],
          })
        );

        console.log(elev, cont, [...meditatiiOfElev]);
        await setDoc(doc(db, "elevi", elev.id), {
          ...elev,
          cont: cont,
          meditatii: [...meditatiiOfElev],
        });
      }
    });
    dispatch(getElevi());
    dispatch(PLATI({}));
  }
  React.useLayoutEffect(() => {
    if (date === undefined || view === undefined) return;

    const rows =
      document.getElementsByClassName("k-scheduler-body")[0].childNodes;

    if (rows.length === 0 || rows === undefined) return;
    for (let i = 1; i < rows.length; i += 2) {
      if (rows[i].className === "k-scheduler-group k-group-horizontal")
        rows[i].style.backgroundColor = "#F5F5F5";
    }

    if (
      document?.getElementsByClassName("k-scheduler-head")[0]?.childNodes
        .length > 0
    ) {
      const rows =
        document?.getElementsByClassName("k-scheduler-head")[0]?.childNodes;
      for (let i = 0; i < rows.length; ++i) {
        const element = rows[i];
        if (
          element?.firstChild?.firstChild?.className ===
          "k-scheduler-cell k-heading-cell k-side-cell k-scheduler-times-all-day"
        ) {
          element.parentElement.removeChild(element);
          break;
        }
      }
    }
  }, [
    view,
    date,
    selectedSali,
    selectedMaterii,
    selectedProfesori,
    selectedElevi,
    divs,
    data,
    updatedData,
  ]);
  React.useEffect(() => {
    let array = [];
    meditatii.forEach((meditatie) => {
      let copyOfMeditatie = { ...meditatie };
      if (copyOfMeditatie.originalStart !== undefined) {
        copyOfMeditatie.originalStart = new Date(
          copyOfMeditatie.originalStart.seconds * 1000.0
        );
      }
      if (copyOfMeditatie.originalEnd !== undefined) {
        copyOfMeditatie.originalEnd = new Date(
          copyOfMeditatie.originalEnd.seconds * 1000.0
        );
      }
      if (copyOfMeditatie?.RecurrenceException?.length > 0) {
        copyOfMeditatie.RecurrenceException =
          copyOfMeditatie.RecurrenceException.map(
            (el) => new Date(el.seconds * 1000.0)
          );
      }
      array.push({
        ...copyOfMeditatie,
        Start: new Date(copyOfMeditatie.Start.seconds * 1000.0),
        End: new Date(copyOfMeditatie.End.seconds * 1000.0),
      });
    });

    setData([...array]);
    setUpdatedData([...array]);
  }, [meditatii]);

  const filter = () => {
    setUpdatedData(data);
    let array = data;
    let SalaIds = [];
    if (selectedSali.length > 0) {
      selectedSali.forEach((sala) =>
        SalaIds.push(resources[0].data.find((room) => room.text === sala).value)
      );
    }
    let MateriiIds = [];
    if (selectedMaterii.length > 0) {
      selectedMaterii.forEach((materie) =>
        MateriiIds.push(
          resources[2].data.find((subject) => subject.text === materie).value
        )
      );
    }

    let ProfesoriIds = [];
    if (selectedProfesori.length > 0) {
      selectedProfesori.forEach((prof) =>
        ProfesoriIds.push(
          resources[3].data.find((teacher) => teacher.text === prof).value
        )
      );
    }
    let EleviIds = [];
    if (selectedElevi.length > 0) {
      selectedElevi.forEach((elev) =>
        EleviIds.push(
          resources[1].data.find((student) => student.text === elev).value
        )
      );
    }

    setUpdatedData(
      array.filter((appointment) => {
        if (SalaIds.length > 0) {
          if (SalaIds.find((id) => id === appointment.RoomID) === undefined) {
            return 0;
          }
        }
        if (MateriiIds.length > 0) {
          if (
            MateriiIds.find((id) => id === appointment.MateriiIDs) === undefined
          ) {
            return 0;
          }
        }
        if (ProfesoriIds.length > 0) {
          if (
            ProfesoriIds.find((id) => id === appointment.PersonIDs) ===
            undefined
          ) {
            return 0;
          }
        }
        if (EleviIds.length > 0) {
          let ok = 0;

          appointment.ElevID.forEach((student) => {
            if (EleviIds.find((id) => id === student)) {
              ok = 1;
            }
          });
          if (ok === 0) return 0;
        }
        return 1;
      })
    );
  };

  // const handleDateChange = React.useCallback(
  //   (event) => {
  //     setDate(event.value);
  //   },
  //   [setDate]
  // );

  async function removeMeditatieFromDatabase(meditatie) {
    await deleteDoc(doc(db, "meditatii", meditatie.TaskID));
    const profesorDeLaMedite = profesoriFromRedux.find(
      (prof) => prof.id === meditatie.PersonIDs
    )?.text;
    const grupaDeElevi = meditatie.ElevID.map(
      (elevID) => eleviFromRedux.find((elev) => elev.id === elevID)?.text
    );
    meditatie.ElevID.forEach(async (elevId) => {
      const elev = eleviFromRedux.find((elev) => elev.id === elevId);
      let meditatiiOfElev = [];
      if (elev?.meditatii?.length > 0) meditatiiOfElev = [...elev.meditatii];
      if (
        meditatiiOfElev.find(
          (meditatieOfElev) => meditatieOfElev.TaskID === meditatie.TaskID
        ) === undefined
      )
        await setDoc(doc(db, "elevi", elev.id), {
          ...elev,
          meditatii: [
            ...meditatiiOfElev,
            {
              TaskID: meditatie.TaskID,
              grupa: grupaDeElevi,
              profesor: profesorDeLaMedite,
              pretPerSedinta: meditatie.Pret,
              materie: meditatie.MateriiIDs,
              Start: meditatie.Start,
              END: meditatie.End,
              seMaiTine: false,
            },
          ],
        });
      else {
        const elment = meditatiiOfElev.find(
          (medi) => medi.TaskID === meditatie.TaskID
        );
        const index = meditatiiOfElev.indexOf(elment);

        meditatiiOfElev[index] = {
          TaskID: meditatie.TaskID,
          grupa: grupaDeElevi,
          profesor: profesorDeLaMedite,
          pretPerSedinta: meditatie.Pret,
          materie: meditatie.MateriiIDs,
          Start: meditatie.Start,
          END: meditatie.End,
          seMaiTine: false,
          sedinte: meditatiiOfElev[index].sedinte,
        };
        await setDoc(doc(db, "elevi", elev.id), {
          ...elev,
          meditatii: [...meditatiiOfElev],
        });
      }
    });
    dispatch(getElevi());
  }
  const handleDataChange = React.useCallback(
    ({ created, updated, deleted }) => {
      updated.forEach((meditatie) =>
        addMeditatieToDatabase({ ...meditatie }, plati)
      );
      deleted.forEach((meditatie) => removeMeditatieFromDatabase(meditatie));
      setData((old) =>
        old
          .filter(
            (item) =>
              deleted.find((current) => current.TaskID === item.TaskID) ===
              undefined
          )
          .map(
            (item) =>
              updated.find((current) => current.TaskID === item.TaskID) || item
          )
          .concat(
            created.map((item) => {
              const TASKID = guid();
              addMeditatieToDatabase(
                Object.assign(
                  {},
                  { ...item },
                  {
                    TaskID: TASKID,
                  }
                ),

                plati
              );
              return Object.assign({}, item, {
                TaskID: TASKID,
              });
            })
          )
      );
    },
    [setData, plati]
  );
  const handleSelectedSali = (event) => {
    setSelectedSali([...event.value]);
    filter();
  };
  const handleSelectedMaterii = (event) => {
    setSelectedMaterii([...event.value]);
    setSelectedSali(selectedSali);
    setUpdatedData(data);
    filter();
  };
  const handleSelectedProfesori = (event) => {
    setSelectedProfesori([...event.value]);
    setSelectedSali(selectedSali);
    setUpdatedData(data);
    filter();
  };
  const handleSelectedElevi = (event) => {
    setSelectedElevi([...event.value]);
    setSelectedSali(selectedSali);
    setUpdatedData(data);
    filter();
  };
  React.useEffect(() => {
    setNumberOfCells(
      Math.max(1, selectedSali.length) *
        Math.max(1, selectedProfesori.length) *
        Math.max(1, selectedMaterii.length) *
        Math.max(1, selectedElevi.length)
    );
    if (
      selectedSali.length > 0 &&
      groupingArray.find((e) => e === "SelectedSali") === undefined
    ) {
      setGroupingArray([...groupingArray, "SelectedSali"]);
    }
    if (
      selectedSali.length === 0 &&
      groupingArray.find((e) => e === "SelectedSali") !== undefined
    ) {
      setGroupingArray(groupingArray.filter((item) => item !== "SelectedSali"));
    }
    if (
      selectedMaterii.length > 0 &&
      groupingArray.find((e) => e === "SelectedMaterii") === undefined
    ) {
      setGroupingArray([...groupingArray, "SelectedMaterii"]);
    }
    if (
      selectedMaterii.length === 0 &&
      groupingArray.find((e) => e === "SelectedMaterii") !== undefined
    ) {
      setGroupingArray(
        groupingArray.filter((item) => item !== "SelectedMaterii")
      );
    }
    if (
      selectedProfesori.length > 0 &&
      groupingArray.find((e) => e === "SelectedProfesori") === undefined
    ) {
      setGroupingArray([...groupingArray, "SelectedProfesori"]);
    }
    if (
      selectedProfesori.length === 0 &&
      groupingArray.find((e) => e === "SelectedProfesori") !== undefined
    ) {
      setGroupingArray(
        groupingArray.filter((item) => item !== "SelectedProfesori")
      );
    }
    if (
      selectedElevi.length > 0 &&
      groupingArray.find((e) => e === "SelectedElevi") === undefined
    ) {
      setGroupingArray([...groupingArray, "SelectedElevi"]);
    }
    if (
      selectedElevi.length === 0 &&
      groupingArray.find((e) => e === "SelectedElevi") !== undefined
    ) {
      setGroupingArray(
        groupingArray.filter((item) => item !== "SelectedElevi")
      );
    }
  }, [
    groupingArray,
    selectedElevi,
    selectedProfesori,
    selectedSali,
    selectedMaterii,
    Resources,
    data,
  ]);

  React.useEffect(() => {
    if (resources.length > 0) {
      resources[5].data = [];
      selectedSali.forEach((item) => {
        const sala = resources[0].data.find((sala) => sala.text === item);

        resources[5].data.push({ ...sala });
      });
      setResources([]);
      setResources([...resources]);
      filter();
    }
  }, [selectedSali]);
  React.useEffect(() => {
    if (resources.length > 0) {
      resources[7].data = [];
      selectedMaterii.forEach((item) => {
        const materie = resources[2].data.find(
          (materie) => materie.text === item
        );

        resources[7].data.push({ ...materie });
      });
      setResources([]);
      setResources([...resources]);
      filter();
    }
  }, [selectedMaterii]);

  React.useEffect(() => {
    if (resources.length > 0) {
      resources[4].data = [];
      selectedProfesori.forEach((item) => {
        const prof = resources[3].data.find((prof) => prof.text === item);

        resources[4].data.push({ ...prof });
      });
      setResources([]);
      setResources([...resources]);
      filter();
    }
  }, [selectedProfesori]);

  React.useEffect(() => {
    if (resources.length > 0) {
      resources[6].data = [];
      selectedElevi.forEach((item) => {
        const elev = resources[1].data.find((elev) => elev.text === item);

        resources[6].data.push({ ...elev });
      });
      setResources([]);
      setResources([...resources]);
      filter();
    }
  }, [selectedElevi]);

  ///////////////////////////////////////////////
  React.useEffect(() => {
    if (resources.length > 0) {
      setSali(resources[0].data.map((item) => item.text));
      setProfesori(resources[3].data.map((item) => item.text));
      setElevi(resources[1].data.map((item) => item.text));
      setMaterii(resources[2].data.map((item) => item.text));
    }
  }, [resources]);

  React.useEffect(() => {
    setUpdatedData(data);
    filter();
  }, [data]);
  const getTheStyleForSchelunder = (numberOfCells) => {
    let style = { height: "auto" };
    let numberOfDays = 1;
    let pixelsPerSqure = 100;
    if (view === "day") numberOfDays = 1;
    else if (view === "month") {
      numberOfDays = 30;
      pixelsPerSqure = 35;
    } else if (view === "week") {
      numberOfDays = 7;
      pixelsPerSqure = 80;
    }
    if (numberOfCells * pixelsPerSqure * numberOfDays > window.innerWidth) {
      style = {
        ...style,
        width: numberOfCells * pixelsPerSqure * numberOfDays,
      };
    }
    return style;
  };

  const filterProfesoriForSelect = () => {
    if (selectedMaterii.length > 0) {
      let filteredProfesori = [];

      selectedMaterii?.forEach((materie) => {
        const profesoriMaterie = materiiFromDataBase.find(
          (el) => el.numeMaterie === materie
        )?.profesori;

        profesoriMaterie?.forEach((profesorID) => {
          const textProfesor = resources[3].data.find(
            (el) => el.value === profesorID
          )?.text;

          if (
            filteredProfesori?.find((el) => el === textProfesor) === undefined
          )
            filteredProfesori.push(textProfesor);
        });
      });
      return filteredProfesori;
    }
    return profesori;
  };
  const handleDateChange = (e) => {
    setDate(e.value);
  };

  return (
    <div style={{ overflowY: "scroll" }}>
      <div
        className="example-config"
        style={{
          display: "block",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "2vw",
          width: "100vw",
        }}
      >
        <div className="row">
          <div className="col">
            <h5>Sali</h5>
            <MultiSelect
              data={sali}
              value={selectedSali}
              onChange={handleSelectedSali}
              style={{ width: "40vw" }}
            />
          </div>
          <div className="col">
            <h5>Materii</h5>
            <MultiSelect
              data={materii}
              value={selectedMaterii}
              onChange={handleSelectedMaterii}
            />
          </div>
          <div className="col">
            <h5>Profesori</h5>
            <MultiSelect
              data={filterProfesoriForSelect()}
              value={selectedProfesori}
              onChange={handleSelectedProfesori}
            />
          </div>
          <div className="col">
            <h5>Elevi</h5>
            <MultiSelect
              data={elevi}
              value={selectedElevi}
              onChange={handleSelectedElevi}
            />
          </div>

          <div className="col">
            <Button
              style={{ backgroundColor: "#21ba45", color: "white" }}
              onClick={() => {
                setOrarPrincipal(orarPrincipal + 1);
              }}
            >
              Orar principal
            </Button>
          </div>
        </div>
      </div>
      <Scheduler
        timezone="Europe/Bucharest"
        height={"81vh"}
        data={updatedData}
        locale="ro RO"
        style={getTheStyleForSchelunder(numberOfCells)}
        onDataChange={handleDataChange}
        onDateChange={handleDateChange}
        view={view}
        viewSlot={CustomViewSlot}
        onViewChange={handleViewChange}
        workDayStart={"08:00"}
        allDay={false}
        workWeekStart={Day.Sunday}
        workWeekEnd={Day.Saturday}
        slotDuration={120}
        workDayEnd={"22:00"}
        startTime={"08:00"}
        majorTick={120}
        endTime={"22:00"}
        editItem={EditItemWithDynamicTitle}
        form={FormWithCustomEditor}
        editable={true}
        modelFields={customModelFields}
        group={{
          resources: groupingArray,
          orientation,
        }}
        resources={Resources}
      >
        <DayView
          allDay={false}
          workWeekStart={Day.Saturday}
          workWeekEnd={Day.Saturday}
          workDayStart={"08:00"}
          workDayEnd={"23:00"}
          slotDuration={120}
        />
        <WeekView
          allDay={false}
          workWeekStart={Day.Saturday}
          workWeekEnd={Day.Saturday}
          workDayStart={"08:00"}
          slotDuration={120}
          workDayEnd={"23:00"}
        />
        <MonthView
          allDay={false}
          workWeekStart={Day.Saturday}
          workWeekEnd={Day.Saturday}
          workDayStart={"08:00"}
          workDayEnd={"23:00"}
          slotDuration={120}
        />
      </Scheduler>
    </div>
  );
}

export default Orare;
