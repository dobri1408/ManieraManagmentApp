import * as React from "react";
import { Dialog } from "@progress/kendo-react-dialogs";
import { Button } from "@progress/kendo-react-buttons";
import {
  useSchedulerEditItemPropsContext,
  useSchedulerEditItemRemoveItemContext,
  useSchedulerEditItemFormItemContext,
  useSchedulerEditItemShowRemoveDialogContext,
} from "@progress/kendo-react-scheduler";
export const CustomFormDialog = (props) => {
  const editItemProps = useSchedulerEditItemPropsContext();
  const [, setRemoveItem] = useSchedulerEditItemRemoveItemContext();
  const [, setFormItem] = useSchedulerEditItemFormItemContext();
  const [, setShowRemoveItemDialog] =
    useSchedulerEditItemShowRemoveDialogContext();
  React.useEffect(() => {
    const theBigDiv = document.getElementsByClassName(
      "k-form k-scheduler-edit-form"
    );
    if (theBigDiv.length > 0) {
      const divs = theBigDiv[0].childNodes;
      let i = 0;
      for (; i < divs?.length; i++) {
        console.log(divs[i].className);
        if (divs[i]?.className === "") {
          break;
        }
      }

      if (divs[i + 7]) {
        divs[i + 7].parentElement.removeChild(divs[i + 7]);
      }
      if (divs[i + 6]) {
        divs[i + 6].parentElement.removeChild(divs[i + 6]);
      }
      if (divs[i + 5]) {
        divs[i + 5].parentElement.removeChild(divs[i + 5]);
      }
      if (divs[i + 4]) {
        divs[i + 4].parentElement.removeChild(divs[i + 4]);
      }
    }
  }, [document.getElementsByClassName("k-form k-scheduler-edit-form")]);
  const Title = (
    <React.Fragment>
      <Button
        fillMode="flat"
        icon="check-circle"
        style={{ color: "greenyellow" }}
      >
        Marcheaza meditatia ca realizata
      </Button>
      <Button fillMode="flat" icon="close-circle" style={{ color: "tomato" }}>
        Marcheaza meditatia ca anulta
      </Button>
    </React.Fragment>
  );
  {
    console.log(props);
  }
  return <Dialog {...props} title={Title} />;
};
