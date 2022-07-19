import {
  doc,
  updateDoc,
  getDoc,
  arrayRemove,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
export const platesteCardSedinte = async (selectedSedinte, elevData) => {
  console.log(selectedSedinte, elevData);
  if (selectedSedinte.current.length > 0) {
    const elevRef = doc(db, "elevi", elevData.id);
    //Remove from sedinte neplatite sedinta
    let total = 0;
    selectedSedinte.current.forEach(async (dataItem) => {
      let docRef = doc(db, "sedinte", dataItem.sedintaId);

      let docSnap = await getDoc(docRef);
      let plati = docSnap?.data()?.plati;
      plati[elevData.id].starePlata = "card";
      total += parseInt(dataItem.Pret);
      updateDoc(docRef, {
        plati: plati,
      });
      updateDoc(elevRef, {
        sedinteNeplatite: arrayRemove(dataItem.sedintaRefFirebase),
      });
      let idk = doc(db, "sedintePlatite", elevData.id + new Date().getMonth());
      let idkSnap = await getDoc(idk);
      if (idkSnap?.data())
        updateDoc(
          doc(db, "sedintePlatite", elevData.id + new Date().getMonth()),
          {
            sedintePlatite: arrayUnion(dataItem),
          }
        );
      else
        setDoc(doc(db, "sedintePlatite", elevData.id + new Date().getMonth()), {
          sedintePlatite: [dataItem],
        });
    });
    console.log({ total });
    await updateDoc(elevRef, {
      cont: parseInt(elevData.cont) - parseInt(total),
    });
  }
};
