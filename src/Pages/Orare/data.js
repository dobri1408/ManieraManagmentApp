export const resources = [
  {
    name: "Sali",
    data: [
      {
        text: "Sala 1",
        value: 1,
      },
      {
        text: "Sala 2",
        value: 2,
        color: "#FF7272",
      },
      {
        text: "Sala 3",
        value: 3,
        color: "#FF7272",
      },
    ],
    field: "RoomID",
    valueField: "value",
    textField: "text",
    colorField: "color",
  },
  {
    name: "Elevi",
    data: [
      {
        text: "Maria Bucur",
        value: 1,
      },
      {
        text: "Irina Burmar",
        value: 2,
        color: "#FF7272",
      },
    ],
    field: "ElevID",

    valueField: "value",
    multiple: true,
    textField: "text",
    colorField: "color",
  },
  {
    name: "Profesori",
    data: [
      {
        text: "Prof 1",
        value: 1,
        color: "#5392E4",
      },
      {
        text: "Prof 2",
        value: 2,
        color: "#54677B",
      },
    ],
    field: "PersonIDs",
    valueField: "value",

    textField: "text",
    colorField: "color",
  },
  {
    name: "SelectedProfesori",
    data: [],
    field: "PersonIDs",
    valueField: "value",
    textField: "text",
    colorField: "color",
  },
  {
    name: "SelectedSali",
    data: [],
    field: "RoomID",
    valueField: "value",
    textField: "text",
    colorField: "color",
  },
  {
    name: "SelectedElevi",
    data: [],
    field: "ElevID",
    valueField: "value",
    textField: "text",
    multiple: true,
    colorField: "color",
  },
];

export const sali = [
  {
    text: "Sala 1",
    value: 1,
  },
  {
    text: "Sala 2",
    value: 2,
    color: "#FF7272",
  },
  {
    text: "Sala 3",
    value: 3,
    color: "#FF7272",
  },
];

export const elevi = [
  {
    text: "Maria Bucur",
    value: 1,
  },
  {
    text: "Irina Burmar",
    value: 2,
    color: "#FF7272",
  },
];
