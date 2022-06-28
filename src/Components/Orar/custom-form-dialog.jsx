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
