import * as React from "react";
import { SchedulerForm } from "@progress/kendo-react-scheduler";
import { CustomFormEditor } from "./custom-form-editor";
import { CustomDialog } from "./custom-dialog";
export const FormWithCustomEditor = (props) => {
  const requiredValidator = React.useCallback(
    (value) =>
      value === undefined || value === null || value === "" || value === []
        ? "Field is required."
        : undefined,
    []
  );

  const formValidator = (_dataItem, formValueGetter) => {
    let result = {};
    result.RoomID = [requiredValidator(formValueGetter("RoomID"))]
      .filter(Boolean)
      .reduce((current, acc) => current || acc, "");
    result.ElevID = [requiredValidator(formValueGetter("ElevID"))]
      .filter(Boolean)
      .reduce((current, acc) => current || acc, "");
    result.MateriiIDs = [requiredValidator(formValueGetter("MateriiIDs"))]
      .filter(Boolean)
      .reduce((current, acc) => current || acc, "");
    result.PersonIDs = [requiredValidator(formValueGetter("PersonIDs"))]
      .filter(Boolean)
      .reduce((current, acc) => current || acc, "");
    return result;
  };

  return (
    <SchedulerForm
      {...props}
      editor={CustomFormEditor}
      dialog={CustomDialog}
      validator={formValidator}
    />
  );
};
