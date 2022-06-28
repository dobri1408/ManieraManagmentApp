import * as React from "react";
import { SchedulerForm } from "@progress/kendo-react-scheduler";
import { CustomFormDialog } from "./custom-form-dialog";
export const FormWithCustomDialog = (props) => {
  {
    //props know the curent edditing appoitment
  }
  return <SchedulerForm {...props} dialog={CustomFormDialog} />;
};
