import { configureStore } from "@reduxjs/toolkit";
import { createSlice } from "@reduxjs/toolkit";
import { getProfesori, getMeditatii, getElevi, getMaterii } from "./actions";
const initialState = {
  elevi: [],
  materii: [],
  meditatii: [],
  profesori: [],
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
      console.log(payload);
      if (payload?.payload?.array?.length > 0) {
        state.profesori = [...payload?.payload?.array];
        console.log("wtf is happening");
        console.log(state.profesori);
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
      console.log("materica");
      if (payload?.payload?.array?.length > 0) {
        state.materii = [...payload?.payload?.array];
      }
    },
  },
});
export const store = configureStore({
  reducer: testSlice.reducer,
});
