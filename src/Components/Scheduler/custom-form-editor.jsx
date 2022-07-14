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
  const dispatch = useDispatch();
  const plati = useSelector((state) => state.plati);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(PLATI({}));
  }, []);
  async function getDataOfSedinta(array) {
    let copyOFPlati = { ...plati };
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
      if (copyOFPlatiFromDataBase.hasOwnProperty(elev.id)) {
        copyOFPlati[elev.id] = {
          ...copyOFPlatiFromDataBase[elev.id],
          fromDataBase: true,
        };
        console.log("what");
      } else {
        copyOFPlati[elev.id] = { fromDataBase: false };

        if (copyOFPlati[elev.id]?.starePlata === undefined)
          copyOFPlati[elev.id] = {
            starePlata: "neconfirmat",
            fromDataBase: false,
          };
      }
    });
    console.log("get data", copyOFPlati);
    console.log({ elevi });
    array.forEach((elev, index) => {
      console.log("intru aici");
      if (parseInt(elev.cont) >= parseInt(props.valueGetter("Pret"))) {
        array[index].options = [
          { label: "Plata Cash", value: "cash" },
          { label: "Plata Cont", value: "cont" },
          { label: "Absent", value: "absent" },
          { label: "Restanta", value: "neplatit" },
        ];

        if (
          copyOFPlati[elev.id]?.fromDataBase === false ||
          copyOFPlati[elev.id] === undefined
        ) {
          copyOFPlati[elev.id] = {
            starePlata: "cont",
            fromDataBase: false,
          };
        }
      } else
        array[index].options = [
          { label: "Plata Cash", value: "cash" },
          { label: "Absent", value: "absent" },
          { label: "Restanta", value: "neplatit" },
        ];
    });
    dispatch(PLATI({ ...copyOFPlati }));
    setElevi([...array]);
  }

  useEffect(() => {
    if (props === undefined) return;
    let date = new Date(props.valueGetter("Start"));
    date.setHours(date.getHours() + 2);
    props.onChange("End", {
      value: date,
    });
  }, [props.valueGetter("Start")]);
  console.log(plati);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    dispatch(PLATI({}));
    let array = props?.valueGetter("ElevID")?.map((elev) => {
      const ele = eleviFromRedux.find((elevRedux) => elevRedux.id === elev);
      let restanta = 0;
      ele.meditatii.forEach((meditatie) => {
        restanta = meditatie.sedinte
          .filter((sedinta) => sedinta.starePlata === "neplatit")
          .reduce(
            (total, currentValue) => total + parseInt(currentValue.Pret),
            0
          );
      });

      return {
        ...eleviFromRedux.find((elevRedux) => elevRedux.id === elev),
        restanta: restanta,
        options: [
          { label: "Plata Cash", value: "cash" },
          { label: "Plata Cont", value: "cont" },
          { label: "Absent", value: "absent" },
          { label: "Restanta", value: "neplatit" },
        ],
      };
    });

    if (array === undefined) {
      array = [];
      dispatch(PLATI({}));
    } else {
      getDataOfSedinta(array);
    }
  }, [props.valueGetter("Pret"), props.valueGetter("ElevID")]);

  const data = (elev) => {
    console.log(plati);
    if (plati[elev.id]?.fromDataBase === true)
      return [
        {
          label: plati[elev.id].starePlata,
          value: plati[elev.id].starePlata,
        },
      ];
    else return elev.options;
  };
  const disabled = (elev) => {
    return plati[elev.id]?.fromDataBase === true;
  };
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
        <Label>Status</Label>
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
                    <br />
                    Cont: {elev.cont}
                    <br />
                    Restante : {-elev.restanta}
                  </div>

                  <RadioGroup
                    layout="horizontal"
                    data={data(elev)}
                    value={plati[elev.id]?.starePlata}
                    disabled={disabled(elev)}
                    onChange={(e) => {
                      let copyOFPlati = { ...plati };
                      copyOFPlati[elev.id] = {
                        starePlata: e.value,
                        fromDataBase: false,
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
