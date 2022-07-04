import * as React from "react";
import { DropDownList } from "@progress/kendo-react-dropdowns";
import { useSelector } from "react-redux";
import { useState } from "react";
import { MultiSelect } from "@progress/kendo-react-dropdowns";
import { useDispatch } from "react-redux";
import { testSlice } from "../../redux/store";
import { Checkbox } from "@progress/kendo-react-inputs";
import { Button } from "semantic-ui-react";
const { actions } = testSlice;
const { SELECTED_MATERIE } = actions;
export const EfectuataEditor = (props) => {
  const [efectuata, setEfectuata] = useState(false);
  const dispatch = useDispatch();
  const getBackgroundColor = (whichButton) => {
    console.log(efectuata, whichButton);
    if (efectuata === whichButton)
      return { backgroundColor: "#21ba45", color: "white" };
    else return {};
  };
  React.useEffect(() => {
    if (props.value === undefined) {
      setEfectuata(false);
      handleChange(false);
    } else setEfectuata(props.value);
  }, [props.value]);
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange.call(undefined, {
        value: event,
      });
    }
  };
  return (
    <>
      <Button
        style={getBackgroundColor(false)}
        onClick={(e) => {
          setEfectuata(false);
          handleChange(false);
          e.preventDefault();
        }}
      >
        {" "}
        Nu Este Efectuata
      </Button>
      <Button
        style={getBackgroundColor(true)}
        onClick={(e) => {
          setEfectuata(true);
          handleChange(true);
          e.preventDefault();
        }}
      >
        Efectuata
      </Button>
    </>
  );
};
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
export const PretEditor = (props) => {
  const [pret, setPret] = useState(0);
  React.useEffect(() => {
    if (props.value === undefined && props.onChange) {
      props.onChange.call(undefined, {
        value: 0,
      });
    }
    if (props.value) setPret(parseInt(props.value));
  }, []);

  const handleChange = (event) => {
    setPret(event.target.value);
    if (props.onChange) {
      props.onChange.call(undefined, {
        value: event.target.value,
      });
    }
  };
  return <input type="number" value={pret} onChange={handleChange} />;
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
export const RepetitieEditor = (props) => {
  const [periodica, setPeriodica] = useState(false);
  const [unitate, setUnitate] = useState("Saptamana");
  const [repetitionValue, setRepetitionValue] = useState(1);
  const handleChange = (event) => {
    if (props.onChange) {
      props.onChange.call(undefined, {
        value: event.value.id,
      });
    }
  };
  const getBackgroundColor = (whichButton) => {
    console.log(unitate, whichButton);
    if (unitate === whichButton)
      return { backgroundColor: "#21ba45", color: "white" };
    else return {};
  };

  React.useEffect(() => {
    if (props.value) {
      setPeriodica(true);
      console.log("intru");
      console.log(props.value);
      if (props.value.includes("WEEKLY")) setUnitate("Saptamana");
      else setUnitate("Zi");
      let matches = props.value.match(/(\d+)/);
      if (matches) setRepetitionValue(matches[0]);
    }
  }, []);
  React.useEffect(() => {
    if (periodica === false) {
      props.onChange.call(undefined, {
        value: null,
      });
    } else {
      if (unitate === "Saptamana")
        props.onChange.call(undefined, {
          value: `FREQ=WEEKLY;INTERVAL=${repetitionValue}`,
        });
      else {
        props.onChange.call(undefined, {
          value: `FREQ=DAILY;INTERVAL=${repetitionValue}`,
        });
      }
    }
  }, [periodica, unitate, repetitionValue]);
  return (
    <>
      <Checkbox
        value={periodica}
        label={"Este Periodica"}
        onChange={(e) => {
          setPeriodica(e.value);
        }}
      />
      {periodica && (
        <>
          <div className="k-form-field-wrap">
            <Button
              style={getBackgroundColor("Zi")}
              onClick={(e) => {
                setUnitate("Zi");
                e.preventDefault();
              }}
            >
              Zi
            </Button>
            <Button
              style={getBackgroundColor("Saptamana")}
              onClick={(e) => {
                setUnitate("Saptamana");
                e.preventDefault();
              }}
            >
              Saptamana
            </Button>
          </div>
          <div className="k-form-field-wrap">
            <br />
            Se va repeta la{" "}
            <input
              type="number"
              style={{ width: "5vw" }}
              value={repetitionValue}
              onChange={(e) => {
                setRepetitionValue(e.target.value);
              }}
            />
            {unitate === "Saptamana" ? " saptamani" : " zile"}
          </div>
        </>
      )}
    </>
  );
};
