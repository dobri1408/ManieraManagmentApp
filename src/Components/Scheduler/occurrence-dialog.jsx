import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { useDispatch } from "react-redux";
import { testSlice } from "../../redux/store";
const { actions } = testSlice;
const { PLATI } = actions;
export const occurrenceDialog = (props) => {
  return <Dialog {...props} title={"Sedinta sau Serie"} content={"wtf"} />;
};
