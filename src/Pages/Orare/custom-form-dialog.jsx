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
    const divs = document.getElementsByClassName("k-form-field");
    console.log({ divs });
    if (divs[13]) {
      divs[13].parentElement.removeChild(divs[13]);
    }
    if (divs[12]) {
      divs[12].parentElement.removeChild(divs[12]);
    }
    if (divs[11]) {
      divs[11].parentElement.removeChild(divs[11]);
    }
    if (divs[10]) {
      divs[10].parentElement.removeChild(divs[10]);
    }
  }, [document.getElementsByClassName("k-form-field")]);
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
