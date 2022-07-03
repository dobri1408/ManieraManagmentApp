import * as React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useSelector } from "react-redux";
import { useState } from "react";
import { MultiSelect } from "@progress/kendo-react-dropdowns";

export const SalaEditor = (props) => {
  const sali = useSelector((state) => state.sali);
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
    console.log(array);
    if (array === undefined) setSelectedElevi([]);
    else setSelectedElevi([...array]);
  }, [props]);
  console.log(slectedElevi);
  const handleChange = (event) => {
    setSelectedElevi(event.value);
    console.log(event.value);
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
  const materii = useSelector((state) => state.materii);
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
      value={materii.find((t) => t.id === props.value)}
      data={materii}
      dataItemKey={"id"}
      textField={"text"}
    />
  );
};
export const ProfesorEditor = (props) => {
  const profesori = useSelector((state) => state.profesori);
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
