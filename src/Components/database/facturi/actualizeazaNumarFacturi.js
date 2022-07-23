import { db } from "../../../firebase/firebase";
import { doc, updateDoc, arrayUnion } from "firebase/firestore";
export const actualizeazaNumarFacturi = async (elevData, numarFacturi) => {
  const elevRef = doc(db, "elevi", elevData.id);

  await updateDoc(elevRef, {
    numarFacturi: numarFacturi,
  });
};
