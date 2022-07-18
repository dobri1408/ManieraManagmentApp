import { db } from "../../../firebase/firebase";
import { arrayUnion, setDoc } from "firebase/firestore";

export const addSedintaNeplatita = async (sedintaObject, elevRef) => {
  console.log("mmmm");
  console.log(sedintaObject, elevRef);
  await setDoc(
    elevRef,
    {
      sedinteNeplatite: [sedintaObject],
    },
    { merge: true }
  ).catch((err) => console.error(err));
  console.log("ss");
};
