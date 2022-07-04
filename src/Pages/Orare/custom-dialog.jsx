import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";

export const CustomDialog = (props) => {
  console.log("intru in dialog");
  const idk = (event, l) => {
    console.log("muie");
    console.log(l);
    return false;
  };
  return <Dialog {...props} title={"Programeaza o Meditatie"} />;
};
