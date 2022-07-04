import * as React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useSelector } from "react-redux";
import { useState } from "react";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { useDispatch } from "react-redux";
import { testSlice } from "../../redux/store";
const { actions } = testSlice;
const { SELECTED_MATERIE } = actions;

export const SalaEditor = (props) => {
  const sali = useSelector((state) => state.sali);
  const dispatch = useDispatch();

  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange.call(undefined, {
        value: event.value.value,
      });
    }
  };
  return (
    <DropDownList
      onChange={handleChange}
      value={sali.find((p) => p.value === props.value)}
      data={sali}
      dataItemKey={"value"}
      textField={"text"}
    />
  );
};
export const EleviEditor = (props) => {
  const elevi = useSelector((state) => state.elevi);

  const [slectedElevi, setSelectedElevi] = useState([]);
  React.useEffect(() => {
    const array = props?.value?.map((valueId) =>
      elevi?.find((elev) => elev?.id === valueId)
    );

    if (array === undefined) setSelectedElevi([]);
    else setSelectedElevi([...array]);
  }, [props]);

  const handleChange = (event) => {
    setSelectedElevi(event.value);

    if (props.onChange) {
      props.onChange.call([], {
        value: event.value.map((elev) => elev.id),
      });
    }
  };

  return (
    <MultiSelect
      onChange={handleChange}
      value={slectedElevi}
      data={elevi}
      dataItemKey={"id"}
      textField={"text"}
    />
  );
};
export const MaterieEditor = (props) => {
  const dispatch = useDispatch();
  if (props.value === undefined) dispatch(SELECTED_MATERIE(""));
  const materii = useSelector((state) => state.materii);
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange.call(undefined, {
        value: event.value.id,
      });
      dispatch(SELECTED_MATERIE(event.value.id));
    }
  };

  return (
    <DropDownList
      onChange={handleChange}
      value={materii.find((t) => t.id === props.value)}
      data={materii}
      dataItemKey={"id"}
      textField={"text"}
    />
  );
};
export const ProfesorEditor = (props) => {
  const materie = useSelector((state) => state.selectedMaterie);
  const dispatch = useDispatch();

  const profesori = useSelector((state) => {
    if (materie.length > 0)
      return state.profesori.filter((profesor) => {
        if (
          profesor.materii.find(
            (materieOfProfesor) => materieOfProfesor === materie
          ) !== undefined
        )
          return 1;
        else return 0;
      });
    else return state.profesori;
  });
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange.call(undefined, {
        value: event.value.id,
      });
    }
  };

  return (
    <DropDownList
      onChange={handleChange}
      value={profesori.find((r) => r.id === props.value)}
      data={profesori}
      dataItemKey={"id"}
      textField={"text"}
    />
  );
};
