import { db } from "../firebase/firebase";
import { getDocs, collection } from "firebase/firestore";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getRandomColor } from "../utils/utils";
export const getProfesori = createAsyncThunk("GET_PROFESORI", async () => {
  const querySnapshot = await getDocs(collection(db, "profesori"));

  let array = [];
  querySnapshot.forEach((doc) => {
    array.push({
      ...doc.data(),
      id: doc.id,
      text: doc.data().prenume + " " + doc.data().numeDeFamilie,
      value: doc.id,
      color: getRandomColor(),
    });
  });
  array.sort();

  return {
    payload: {
      array,
    },
  };
});

export const getElevi = createAsyncThunk("GET_ELEVI", async () => {
  const querySnapshot = await getDocs(collection(db, "elevi"));

  let array = [];
  querySnapshot.forEach((doc) => {
    array.push({
      ...doc.data(),
      id: doc.id,
      text: doc.data().prenume + " " + doc.data().numeDeFamilie,
      value: doc.id,
      color: getRandomColor(),
    });
  });
  array.sort();

  return {
    payload: {
      array,
    },
  };
});

export const getMaterii = createAsyncThunk("GET_MATERII", async () => {
  const querySnapshot = await getDocs(collection(db, "materii"));

  let array = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    array.push({
      ...doc.data(),
      id: doc.id,
      text: doc.data().numeMaterie,
      value: doc.id,
      color: getRandomColor(),
    });
  });

  return {
    payload: {
      array,
    },
  };
});

export const getMeditatii = createAsyncThunk("GET_MEDITATII", async () => {
  const querySnapshot = await getDocs(collection(db, "meditatii"));

  let array = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots

    array.push({
      ...doc.data(),
    });
  });

  return {
    payload: {
      array,
    },
  };
});
