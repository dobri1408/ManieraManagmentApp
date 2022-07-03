import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getProfesori, getMeditatii, getElevi, getMaterii } from "./actions";
import { getRandomColor } from "../utils/utils";
const initialState = {
  elevi: [],
  materii: [],
  meditatii: [],
  profesori: [],
  sali: [
    {
      text: "Sala 1",
      value: 1,
    },
    {
      text: "Sala 2",
      value: 2,
      color: getRandomColor(),
    },
    {
      text: "Sala 3",
      value: 3,
      color: getRandomColor(),
    },
    {
      text: "Sala 4",
      value: 4,
      color: getRandomColor(),
    },
    {
      text: "Sala 5",
      value: 5,
      color: getRandomColor(),
    },
    {
      text: "Sala 6",
      value: 6,
      color: getRandomColor(),
    },
    {
      text: "Sala 7",
      value: 7,
      color: getRandomColor(),
    },
    {
      text: "Sala 8",
      value: 8,
      color: getRandomColor(),
    },
  ],
};

export const testSlice = createSlice({
  name: "database",
  initialState,
  reducers: {
    GET_PROFESORI: (state, action) => ({
      ...state,
      profesori: action.payload,
    }),
    GET_ELEVI: (state, action) => ({
      ...state,
      elevi: action.payload,
    }),
    GET_MATERII: (state, action) => ({
      ...state,
      materii: action.payload,
    }),
    GET_MEDITATII: (state, action) => ({
      ...state,
      profesori: action.payload,
    }),
  },
  extraReducers: {
    [getProfesori.fulfilled]: (state, { payload }) => {
      if (payload?.payload?.array?.length > 0) {
        state.profesori = [...payload?.payload?.array];
      }
    },
    [getElevi.fulfilled]: (state, { payload }) => {
      if (payload?.payload?.array?.length > 0) {
        state.elevi = [...payload?.payload?.array];
      }
    },
    [getMeditatii.fulfilled]: (state, { payload }) => {
      if (payload?.payload?.array?.length > 0) {
        state.meditatii = [...payload?.payload?.array];
      }
    },
    [getMaterii.fulfilled]: (state, { payload }) => {
      if (payload?.payload?.array?.length > 0) {
        state.materii = [...payload?.payload?.array];
      }
    },
  },
});
export const store = configureStore({
  reducer: testSlice.reducer,
});