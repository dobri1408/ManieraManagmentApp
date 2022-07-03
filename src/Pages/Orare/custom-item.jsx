import * as React from "react";
import { SchedulerEditItem } from "@progress/kendo-react-scheduler";
import { getPrescurtare } from "../../utils/utils";
import { useSelector } from "react-redux";
export const EditItemWithDynamicTitle = (props) => {
  const profesori = useSelector((state) => state.profesori);
  const elevi = useSelector((state) => state.elevi);
  return (
    <SchedulerEditItem
      {...props}
      title={generateTitle(props.dataItem, profesori, elevi)}
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
    profesori?.find((profesor) => profesor.id === dataItem.PersonIDs).prenume +
    " (" +
    dataItem.ElevID.map((ID) => elevi?.find((elev) => elev.id === ID).prenume) +
    ")"
  );
};
