import * as React from "react";
import * as ReactDOM from "react-dom";
import { guid } from "@progress/kendo-react-common";
import { timezoneNames } from "@progress/kendo-date-math";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import {
  IntlProvider,
  load,
  LocalizationProvider,
  loadMessages,
} from "@progress/kendo-react-intl";
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

import "@progress/kendo-date-math/tz/Europe/Bucharest";
import esMessages from "./es.json";
import { resources } from "./data";
import {
  sampleDataWithCustomSchema,
  displayDate,
  customModelFields,
} from "./events-utc.js";
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

function Orare() {
  const timezones = React.useMemo(() => timezoneNames(), []);
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
  const [date, setDate] = React.useState(displayDate);
  const [locale, setLocale] = React.useState(locales[0]);
  const [groupingArray, setGroupingArray] = React.useState([]);
  const [selectedSali, setSelectedSali] = React.useState([]);
  const [sali, setSali] = React.useState([]);
  const [selectedProfesori, setSelectedProfesori] = React.useState([]);
  const [selectedElevi, setSelectedElevi] = React.useState([]);
  const [profesori, setProfesori] = React.useState([]);
  const [elevi, setElevi] = React.useState([]);
  const [timezone, setTimezone] = React.useState("Europe/Bucharest");
  const [customSaliGroupingArray, setCustomSaliGroupingArray] = React.useState([
    resources.sal,
  ]);
  const [orientation, setOrientation] = React.useState("horizontal");
  const [data, setData] = React.useState(sampleDataWithCustomSchema);
  const [updatedData, setUpdatedData] = React.useState(
    sampleDataWithCustomSchema
  );
  const [Resources, setResources] = React.useState(resources);
  const handleViewChange = React.useCallback(
    (event) => {
      setView(event.value);
    },
    [setView]
  );
  const filter = () => {
    setUpdatedData(data);
    let array = data;
    let SalaIds = [];
    if (selectedSali.length > 0) {
      selectedSali.forEach((sala) =>
        SalaIds.push(resources[0].data.find((room) => room.text === sala).value)
      );
    }
    let ProfesoriIds = [];
    if (selectedProfesori.length > 0) {
      selectedProfesori.forEach((prof) =>
        ProfesoriIds.push(
          resources[2].data.find((teacher) => teacher.text === prof).value
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
    console.log({ SalaIds });
    setUpdatedData(
      array.filter((appointment) => {
        if (SalaIds.length > 0) {
          console.log({ appointment });
          if (SalaIds.find((id) => id === appointment.RoomID) === undefined) {
            console.log("intram aici", appointment.RoomId);
            return 0;
          }
        }
        if (ProfesoriIds.length > 0) {
          console.log({ ProfesoriIds });
          if (
            ProfesoriIds.find((id) => id === appointment.PersonIDs) ===
            undefined
          ) {
            return 0;
          }
        }
        if (EleviIds.length > 0) {
          let ok = 0;
          console.log({ appointment });
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
    console.log("muie");
  };

  React.useEffect(() => {
    // filter();
  }, [selectedSali]);
  const handleDateChange = React.useCallback(
    (event) => {
      setDate(event.value);
    },
    [setDate]
  );
  const handleLocaleChange = React.useCallback(
    (event) => {
      setLocale(event.target.value);
    },
    [setLocale]
  );
  const handleTimezoneChange = React.useCallback(
    (event) => {
      setTimezone(event.target.value);
    },
    [setTimezone]
  );
  const handleOrientationChange = React.useCallback((event) => {
    setOrientation(event.target.getAttribute("data-orientation"));
  }, []);
  const handleDataChange = React.useCallback(
    ({ created, updated, deleted }) => {
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
            created.map((item) =>
              Object.assign({}, item, {
                TaskID: guid(),
              })
            )
          )
      );
    },
    [setData]
  );
  const handleSelectedSali = (event) => {
    setSelectedSali([...event.value]);
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
    if (
      selectedSali.length > 0 &&
      groupingArray.find((e) => e === "SelectedSali") === undefined
    ) {
      setGroupingArray([...groupingArray, "SelectedSali"]);

      console.log("intru");
    }
    if (
      selectedSali.length === 0 &&
      groupingArray.find((e) => e === "SelectedSali") !== undefined
    ) {
      console.log("se poate baby");
      setGroupingArray(groupingArray.filter((item) => item !== "SelectedSali"));
    }
    if (
      selectedProfesori.length > 0 &&
      groupingArray.find((e) => e === "SelectedProfesori") === undefined
    ) {
      setGroupingArray([...groupingArray, "SelectedProfesori"]);
      console.log("intru");
    }
    if (
      selectedProfesori.length === 0 &&
      groupingArray.find((e) => e === "SelectedProfesori") !== undefined
    ) {
      console.log("se poate baby");
      setGroupingArray(
        groupingArray.filter((item) => item !== "SelectedProfesori")
      );
    }
    if (
      selectedElevi.length > 0 &&
      groupingArray.find((e) => e === "SelectedElevi") === undefined
    ) {
      setGroupingArray([...groupingArray, "SelectedElevi"]);
      console.log("intru");
    }
    if (
      selectedElevi.length === 0 &&
      groupingArray.find((e) => e === "SelectedElevi") !== undefined
    ) {
      console.log("se poate baby");
      setGroupingArray(
        groupingArray.filter((item) => item !== "SelectedElevi")
      );
    }
  }, [
    groupingArray,
    selectedElevi,
    selectedProfesori,
    selectedSali,
    Resources,
    data,
  ]);

  React.useEffect(() => {
    resources[4].data = [];
    selectedSali.forEach((item) => {
      const sala = resources[0].data.find((sala) => sala.text === item);
      console.log({ sala });
      resources[4].data.push({ ...sala });
    });
    setResources([]);
    setResources([...resources]);
    filter();
  }, [selectedSali]);

  React.useEffect(() => {
    resources[3].data = [];
    selectedProfesori.forEach((item) => {
      const prof = resources[2].data.find((prof) => prof.text === item);
      console.log({ prof });
      resources[3].data.push({ ...prof });
    });
    setResources([]);
    setResources([...resources]);
    filter();
  }, [selectedProfesori]);

  React.useEffect(() => {
    console.log(resources);
    resources[5].data = [];
    selectedElevi.forEach((item) => {
      const elev = resources[1].data.find((elev) => elev.text === item);
      console.log({ elev });
      resources[5].data.push({ ...elev });
    });
    setResources([]);
    setResources([...resources]);
    filter();
  }, [selectedElevi]);

  ///////////////////////////////////////////////
  React.useEffect(() => {
    setSali(resources[0].data.map((item) => item.text));
    setProfesori(resources[2].data.map((item) => item.text));
    setElevi(resources[1].data.map((item) => item.text));
  }, [resources]);
  console.log({ Resources });
  console.log(selectedSali, groupingArray);
  React.useEffect(() => {
    setUpdatedData(data);
    filter();
  }, [data]);
  console.log({ updatedData });

  return (
    <div>
      <div
        className="example-config"
        style={{
          display: "block",
          justifyContent: "center",
          alignItems: "center",
          paddingLeft: "2vw",
        }}
      >
        <div className="row">
          <div className="col">
            <h5>Sali</h5>
            <MultiSelect
              data={sali}
              value={selectedSali}
              onChange={handleSelectedSali}
            />
          </div>
          <div className="col">
            <h5>Profesori</h5>
            <MultiSelect
              data={profesori}
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
            <h5>Orientation:</h5>
            <input
              type="radio"
              name="orientation"
              id="horizontal"
              data-orientation="horizontal"
              className="k-radio k-radio-md"
              checked={orientation === "horizontal"}
              onChange={handleOrientationChange}
            />
            <label className="k-radio-label" htmlFor="horizontal">
              Horizontal
            </label>
            <br />
            <input
              type="radio"
              name="orientation"
              id="vertical"
              data-orientation="vertical"
              className="k-radio k-radio-md"
              checked={orientation === "vertical"}
              onChange={handleOrientationChange}
            />
            <label className="k-radio-label" htmlFor="vertical">
              Vertical
            </label>
          </div>
        </div>
      </div>
      <Scheduler
        timezone="Europe/Bucharest"
        height={"90vh"}
        data={updatedData}
        style={{ height: "auto" }}
        onDataChange={handleDataChange}
        view={view}
        onViewChange={handleViewChange}
        form={FormWithCustomDialog}
        date={date}
        onDateChange={handleDateChange}
        editable={true}
        modelFields={customModelFields}
        group={{
          resources: groupingArray,
          orientation,
        }}
        resources={Resources}
      >
        <TimelineView />
        <DayView />
        <WeekView />
        <MonthView />
        <AgendaView />
      </Scheduler>
    </div>
  );
}

export default Orare;
