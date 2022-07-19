import { tableKeyboardNavigationBodyAttributes } from "@progress/kendo-react-data-tools";
import {
  doc,
  updateDoc,
  getDoc,
  arrayRemove,
  arrayUnion,
  setDoc,
} from "firebase/firestore";
import { db } from "../../../firebase/firebase";
export const platesteCashSedinte = async (index, selectedSedinte, elevData) => {
  if (selectedSedinte.current.length > 0) {
    const elevRef = doc(db, "elevi", elevData.id);
    //Remove from sedinte neplatite sedinta
    let array = JSON.parse(JSON.stringify(elevData.sedinteNeplatite));

    selectedSedinte.current.forEach(async (dataItem) => {
      let docRef = doc(db, "sedinte", dataItem.sedintaId);

      let docSnap = await getDoc(docRef);
      let plati = docSnap?.data()?.plati;
      console.log({ plati });
      plati[elevData.id].starePlata = "cash";

      await updateDoc(docRef, {
        plati: plati,
      });
      await updateDoc(elevRef, {
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
      let index = array.indexOf(dataItem.sedintaRefFirebase);
      console.log(index);
      array.splice(index, 1);
    });
    let docSnap = await getDoc(elevRef);

    console.log(array);
    return { index: index, sedinteNeplatite: array };
  }
};
