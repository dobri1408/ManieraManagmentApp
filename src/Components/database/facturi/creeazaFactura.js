import { db } from "../../../firebase/firebase";
import { doc, updateDoc } from "firebase/firestore";
export const creeazaFactura = async (selectedSedinte, elevData) => {
  if (selectedSedinte.current.length > 0) {
    const elevRef = doc(db, "elevi", elevData.id);
    let facturi = JSON.parse(JSON.stringify(elevData.facturiNeplatite || []));
    let today = new Date();
    let date =
      today.getFullYear() +
      "-" +
      (today.getMonth() + 1) +
      "-" +
      today.getDate();
    let scadenta = new Date();
    scadenta.setDate(today.getDate() + 20);
    let sedinte = [];

    selectedSedinte.current.forEach((sedinta) => {
      sedinte.push({ id: sedinta.sedintaId, date: sedinta.data });
    });
    let factura = {
      sedinte: sedinte,
      dataEmitere: date,
      scadenta: scadenta,
      numarFactura: facturi.length + 1,
    };
    facturi.push(factura);

    await updateDoc(elevRef, {
      facturiNeplatite: facturi,
    });
  }
};
