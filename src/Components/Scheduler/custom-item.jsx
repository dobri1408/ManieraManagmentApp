import * as React from "react";
import { SchedulerEditItem } from "@progress/kendo-react-scheduler";
import { getPrescurtare } from "../../utils/utils";
import { useSelector } from "react-redux";
import { occurrenceDialog } from "./occurrence-dialog";
import { element } from "prop-types";
export const EditItemWithDynamicTitle = (props) => {
  const profesori = useSelector((state) => state.profesori);
  const elevi = useSelector((state) => state.elevi);
  const ref = React.useRef();
  const [idk, setIdk] = React.useState(0);

  React.useEffect(() => {
    let elements = document?.getElementsByClassName(
      "k-window-content k-dialog-content"
    );
    console.log(elements);
    if (elements?.length > 0) {
      let element = elements[0];
      console.log(element.innerHTML);
      if (
        element.innerHTML ===
        "Do you want to edit only this event occurrence or the whole series?"
      )
        element.innerHTML =
          "Vrei sa modifici/confirmi sedinta sau sa modifici toata seria de meditatii";
    }
    let elementss = document?.getElementsByClassName("k-button-text");
    console.log({ elementss });
    if (elementss && elementss?.length > 0) {
      let n = elementss?.length;
      for (let i = 0; i < n; i++) {
        let element = elementss[i];
        if (element.innerHTML === "Edit current occurrence")
          element.innerHTML = "Modifica/Confirma Sedinta";
        else if (element.innerHTML === "Edit the series")
          element.innerHTML = "Modifica Seria de Meditatii";
      }
    }
  }, [idk + 1]);
  return (
    <SchedulerEditItem
      {...props}
      ref={ref}
      title={generateTitle(props.dataItem, profesori, elevi)}
      onShowOccurrenceDialogChange={() => {
        let elements = document?.getElementsByClassName(
          "k-window-content k-dialog-content"
        );
        setIdk(idk + 1);
        console.log(elements);
        if (elements?.length > 0) {
          let element = elements[0];
          console.log(element.innerHTML);
          if (
            element.innerHTML ===
            "Do you want to edit only this event occurrence or the whole series?"
          )
            element.innerHTML =
              "Vrei sa modifici/confirmi sedinta sau sa modifici toata seria de meditatii";
        }
      }}
    />
  );
};

const generateTitle = (dataItem, profesori, elevi) => {
  return (
    dataItem?.Start?.toLocaleTimeString("en-US", {
      // en-US can be set to 'default' to use user's browser settings
      hour: "2-digit",
      minute: "2-digit",
    }) +
    " " +
    getPrescurtare(dataItem.MateriiIDs) +
    "-" +
    profesori?.find((profesor) => profesor.id === dataItem.PersonIDs)?.prenume +
    " (" +
    dataItem.ElevID.map(
      (ID) => elevi?.find((elev) => elev.id === ID)?.prenume
    ) +
    ")"
  );
};
