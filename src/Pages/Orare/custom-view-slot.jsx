import * as React from "react";
import { SchedulerViewSlot } from "@progress/kendo-react-scheduler";
export const CustomViewSlot = (props) => {
  let customStyle = {};
  console.log(props);
  if (props.range.index === 0) {
    customStyle = {
      borderLeft: "1px solid black",
    };
  }
  return (
    <SchedulerViewSlot
      {...props}
      expandable={false}
      style={{ ...props.style, ...customStyle }}
    />
  );
};
