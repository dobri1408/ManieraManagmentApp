import * as React from "react";
import { FormElement, Field } from "@progress/kendo-react-form";
import { Label, Error } from "@progress/kendo-react-labels";
import { TextArea } from "@progress/kendo-react-inputs";
import { DatePicker, DateTimePicker } from "@progress/kendo-react-dateinputs";
import { Button } from "@progress/kendo-react-buttons";
import { db } from "../../firebase/firebase";
import { doc, getDoc } from "firebase/firestore";
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
import { useSelector, useDispatch } from "react-redux";
import { testSlice } from "../../redux/store";
import { RadioGroup } from "@progress/kendo-react-inputs";

const { actions } = testSlice;
const { PLATI } = actions;
////BUGGG DACA SE VA ADAIUGA UN ELEV NOU NU VA MERGE
export const CustomFormEditor = (props) => {
  const eleviFromRedux = useSelector((state) => state.elevi);
  const [elevi, setElevi] = useState([]);
  const [selectedValue, setSelectedValue] = useState("neconfirmat");
  const dispatch = useDispatch();
  const plati = useSelector((state) => state.plati);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  async function getDataOfSedinta(array) {
    let copyOFPlati = {};
    let copyOFPlatiFromDataBase = {};

    const Start = props?.valueGetter("Start");
    const id = props?.valueGetter("TaskID");

    if (id) {
      const docRef = doc(db, "sedinte", id + Date.parse(Start));
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        copyOFPlatiFromDataBase = docSnap.data().plati;
      }
    }

    array.forEach((elev) => {
      if (copyOFPlatiFromDataBase.hasOwnProperty(elev.id))
        copyOFPlati[elev.id] = copyOFPlatiFromDataBase[elev.id];
      else
        copyOFPlati[elev.id] = {
          starePlata: "neconfirmat",
          prezenta: "neconfirmat",
        };
    });
    dispatch(PLATI(copyOFPlati));
  }

  useEffect(() => {
    let array = props
      ?.valueGetter("ElevID")
      ?.map((elev) =>
        eleviFromRedux.find((elevRedux) => elevRedux.id === elev)
      );

    if (array === undefined) {
      array = [];
      dispatch(PLATI({}));
    } else {
      getDataOfSedinta(array);
    }

    setElevi([...array]);
  }, [eleviFromRedux, props?.valueGetter("ElevID")]);

  useEffect(() => {
    if (props === undefined) return;
    let date = new Date(props.valueGetter("Start"));
    date.setHours(date.getHours() + 2);
    props.onChange("End", {
      value: date,
    });
  }, [props.valueGetter("Start")]);

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
          {props.valueGetter("RecurrenceID") &&
            props.valueGetter("Efectuata") &&
            elevi?.map((elev, index) => {
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
                    value={plati[elev.id]?.starePlata}
                    onChange={(e) => {
                      let copyOFPlati = { ...plati };
                      copyOFPlati[elev.id] = {
                        starePlata: e.value,
                        prezenta: plati[elev.id]?.prezenta,
                      };
                      dispatch(PLATI(copyOFPlati));
                    }}
                  />
                  <RadioGroup
                    layout="horizontal"
                    data={[
                      { label: "Neconfirmat", value: "neconfirmat" },
                      { label: "Prezent", value: "Prezent" },
                      { label: "Absent", value: "Absent" },
                    ]}
                    value={plati[elev.id]?.prezenta}
                    onChange={(e) => {
                      let copyOFPlati = { ...plati };
                      copyOFPlati[elev.id] = {
                        starePlata: plati[elev.id]?.starePlata,
                        prezenta: e.value,
                      };
                      dispatch(PLATI(copyOFPlati));
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
            format={"HH:mm"}
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
            format={"HH:mm"}
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
