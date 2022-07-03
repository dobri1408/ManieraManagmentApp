import * as React from "react";
import { FormElement, Field } from "@progress/kendo-react-form";
import { Label, Error } from "@progress/kendo-react-labels";
import { TextArea } from "@progress/kendo-react-inputs";
import { DatePicker, DateTimePicker } from "@progress/kendo-react-dateinputs";
import {
  SalaEditor,
  EleviEditor,
  MaterieEditor,
  ProfesorEditor,
} from "./editors";
export const CustomFormEditor = (props) => {
  return (
    <FormElement horizontal={true}>
      <div className="k-form-field">
        <Label>Sala</Label>
        <div className="k-form-field-wrap">
          <Field name={"RoomID"} component={SalaEditor} />
          {props.errors.Sala && <Error>{props.errors.Sala}</Error>}
        </div>
      </div>
      <div className="k-form-field">
        <Label>Elevi</Label>
        <div className="k-form-field-wrap">
          <Field name={"ElevID"} component={EleviEditor} />
        </div>
      </div>
      <div className="k-form-field">
        <Label>Materie</Label>
        <div className="k-form-field-wrap">
          <Field name={"MateriiIDs"} component={MaterieEditor} />
          {props.errors.Materie && <Error>{props.errors.Materie}</Error>}
        </div>
      </div>
      <div className="k-form-field">
        <Label>Profesor</Label>
        <div className="k-form-field-wrap">
          <Field name={"PersonIDs"} component={ProfesorEditor} />
          {props.errors.Profesor && <Error>{props.errors.Profesor}</Error>}
        </div>
      </div>
      <div className="k-form-field">
        <Label>Descriere</Label>
        <div className="k-form-field-wrap">
          <Field name={"Descriere"} component={TextArea} rows={1} />
        </div>
      </div>
      <div className="k-form-field">
        <Label>Start</Label>
        <div className="k-form-field-wrap">
          <Field
            name={"Start"}
            component={props.startEditor || DatePicker}
            as={DateTimePicker}
            rows={1}
            format={"dd-MMM-yyyy HH:mm"}
          />
        </div>
      </div>
      <div className="k-form-field">
        <Label>End</Label>
        <div className="k-form-field-wrap">
          <Field
            name={"End"}
            component={props.endEditor || DatePicker}
            as={DateTimePicker}
            rows={5}
            format={"dd-MMM-yyyy HH:mm"}
          />
        </div>
      </div>
    </FormElement>
  );
};
