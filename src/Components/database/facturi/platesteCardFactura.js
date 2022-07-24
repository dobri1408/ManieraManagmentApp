import { db } from "../../../firebase/firebase";
import {
  doc,
  updateDoc,
  getDoc,
  arrayRemove,
  setDoc,
  arrayUnion,
} from "firebase/firestore";
export const platesteFacturaCard = async (factura, elevData) => {
  if (factura.sedinte.length > 0) {
    let elevRef = doc(db, "elevi", elevData.id);
    let total = 0;
    factura.sedinte.forEach(async (dataItem) => {
      let docRef = doc(db, "sedinte", dataItem.TaskID);
      console.log({ dataItem });
      if (dataItem.starePlata === "neplatit") total += parseInt(dataItem.Pret);
      let docSnap = await getDoc(docRef);

      let plati = docSnap.data().plati;
      plati[elevData.id].starePlata = "card";

      await updateDoc(docRef, {
        plati: plati,
      });

      console.log("Sedinta Ref", dataItem.sedintaRefFirebase);
      let arraySedinte = [];
      elevData.sedinteNeplatite.forEach((sedintaNeplatita) => {
        if (
          sedintaNeplatita.sedintaID === dataItem.sedintaRefFirebase.sedintaID
        ) {
        } else arraySedinte.push(sedintaNeplatita);
      });
      await updateDoc(elevRef, {
        sedinteNeplatite: arraySedinte,
      });
    });
    //AICI AR MAI TREBUI PUS IN SEDINTEPLATITE, Insa consider ca nu mai e nevoie de baza asta, deoarece se pun in facutri platite, si pot fi urmarite de acolo

    let facturiNeplatite = [];
    elevData.facturiNeplatite.forEach((fact) => {
      if (fact.numarFactura === factura.numarFactura) {
      } else facturiNeplatite.push(fact);
    });
    await updateDoc(doc(db, "elevi", elevData.id), {
      facturiNeplatite: facturiNeplatite,
    }).catch((err) => console.log("ERROR", err));
    await setDoc(
      doc(
        db,
        "facturiPlatite",
        elevData.id +
          "luna" +
          new Date().getMonth() +
          "an" +
          new Date().getYear()
      ),
      {
        facturiPlatite: arrayUnion(factura),
      },
      { merge: true }
    );
    await updateDoc(elevRef, {
      cont: parseInt(elevData.cont) - parseInt(total),
    });
  }
};
