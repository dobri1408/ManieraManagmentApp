import * as React from "react";
import { FormElement, Field } from "@progress/kendo-react-form";
import { Label, Error } from "@progress/kendo-react-labels";
import { TextArea } from "@progress/kendo-react-inputs";
import { DatePicker, DateTimePicker } from "@progress/kendo-react-dateinputs";
import { Button } from "@progress/kendo-react-buttons";
import {
  SalaEditor,
  EleviEditor,
  MaterieEditor,
  ProfesorEditor,
  RepetitieEditor,
  PretEditor,
  EfectuataEditor,
} from "./editors";
import { RadioButton } from "@progress/kendo-react-inputs";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RadioGroup } from "@progress/kendo-react-inputs";
import { useDispatch } from "react-redux";
import { testSlice } from "../../redux/store";
const { actions } = testSlice;
const { PLATI } = actions;
export const CustomFormEditor = (props) => {
  const eleviFromRedux = useSelector((state) => state.elevi);
  const [elevi, setElevi] = useState([]);
  const [selectedValue, setSelectedValue] = useState("neconfirmat");
  const dispatch = useDispatch();
  const plati = useSelector((state) => state.plati);
  useEffect(() => {
    let array = props
      ?.valueGetter("ElevID")
      ?.map((elev) =>
        eleviFromRedux.find((elevRedux) => elevRedux.id === elev)
      );
    if (array === undefined) {
      array = [];
      dispatch(PLATI({}));
    }
    let platiOBject = {};
    array.forEach((elev) => {
      platiOBject[elev?.id] = {
        statusPlata: "neconfirmat",
        prezenta: "neconfirmat",
      };
    });
    dispatch(PLATI({ ...platiOBject }));
    console.log(plati);
    setElevi(array);
  }, [props]);
  useEffect(() => {
    if (props === undefined) return;
    let date = new Date(props.valueGetter("Start"));
    date.setHours(date.getHours() + 2);
    props.onChange("End", {
      value: date,
    });
  }, [props.valueGetter("Start")]);
  console.log(plati);
  return (
    <FormElement horizontal={true}>
      <div className="k-form-field">
        <Label>Stare</Label>
        <div className="k-form-field-wrap">
          <Field name={"Efectuata"} component={EfectuataEditor} />
        </div>
      </div>
      <div className="k-form-field">
        <Label>Sala</Label>
        <div className="k-form-field-wrap">
          <Field name={"RoomID"} component={SalaEditor} />
          {props.errors.Sala && <Error>{props.errors.Sala}</Error>}
        </div>
      </div>
      <div className="k-form-field">
        <Label>Pret Per Elev</Label>
        <div className="k-form-field-wrap">
          <Field name={"Pret"} component={PretEditor} />
        </div>
      </div>
      <div className="k-form-field">
        <Label>Plata si Prezenta</Label>
        <div
          style={{
            display: "inline-block",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          {elevi?.map((elev, index) => {
            console.log(elev);
            return (
              <div style={{ display: "block" }}>
                <div style={{ fontWeight: "bold" }}>
                  {index + 1}. {elev.text}
                </div>

                <RadioGroup
                  layout="horizontal"
                  data={[
                    { label: "Neconfirmat", value: "neconfirmat" },
                    { label: "Platit", value: "platit" },
                    { label: "Neplatit", value: "neplatit" },
                  ]}
                  onChange={(e) => {
                    console.log(elev.id);
                    const newObject = { ...plati };
                    newObject[elev.id] = {
                      ...newObject[elev.id],
                      statusPlata: e.value,
                    };
                    dispatch(PLATI({ ...newObject }));
                  }}
                />
                <RadioGroup
                  layout="horizontal"
                  data={[
                    { label: "Neconfirmat", value: "neconfirmat" },
                    { label: "Prezent", value: "Prezent" },
                    { label: "Absent", value: "Absent" },
                  ]}
                  onChange={(e) => {
                    const newObject = { ...plati };
                    newObject[elev.id] = {
                      ...newObject[elev.id],
                      prezenta: e.value,
                    };
                    dispatch(PLATI({ ...newObject }));
                  }}
                />
              </div>
            );
          })}
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
      <div className="k-form-field">
        <Label>Repetitie</Label>
        <div className="k-form-field-wrap">
          <Field name={"RecurrenceRule"} component={RepetitieEditor} />
        </div>
      </div>
    </FormElement>
  );
};
