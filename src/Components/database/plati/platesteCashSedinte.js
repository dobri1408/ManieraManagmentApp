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
export const platesteCashSedinte = async (selectedSedinte, elevData) => {
  if (selectedSedinte.current.length > 0) {
    const elevRef = doc(db, "elevi", elevData.id);
    //Remove from sedinte neplatite sedinta

    selectedSedinte.current.forEach(async (dataItem) => {
      let docRef = doc(db, "sedinte", dataItem.sedintaId);

      let docSnap = await getDoc(docRef);
      let plati = docSnap?.data()?.plati;
      plati[elevData.id].starePlata = "cash";
      console.log("huh", dataItem.sedintaRefFirebase);
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
  }
};
