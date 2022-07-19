import { db } from "../../../firebase/firebase";
import { arrayUnion, setDoc } from "firebase/firestore";

export const addSedintaNeplatita = async (sedintaObject, elevRef) => {
  await setDoc(
    elevRef,
    {
      sedinteNeplatite: [sedintaObject],
    },
    { merge: true }
  );
};
