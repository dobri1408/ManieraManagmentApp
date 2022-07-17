import { db } from "../../firebase/firebase";
import { doc, updateDoc, getDoc } from "firebase/firestore";
export const platesteFacturaCard = async (factura, elevData) => {
  console.log(factura, elevData);
  if (factura.sedinte.length > 0) {
    const elevRef = doc(db, "elevi", elevData.id);

    let meditatiii = JSON.parse(JSON.stringify(elevData.meditatii));
    factura.sedinte.forEach((dataItem) => {
      let MeditatieToFind = meditatiii.find(
        (meditatie) => meditatie.TaskID === dataItem.TaskID
      );
      let indexEL = meditatiii.indexOf(MeditatieToFind);

      let sedinta = MeditatieToFind.sedinte.find(
        (sedinta) => sedinta.sedintaID === dataItem.sedintaID
      );
      let index = MeditatieToFind.sedinte.indexOf(sedinta);

      meditatiii[indexEL].sedinte[index].starePlata = "card";
    });
    let facuturiCopy = JSON.parse(JSON.stringify(elevData.facturi));
    let facturaIndex = elevData.facturi.indexOf(factura);
    console.log({ facturaIndex });
    let sedinte = JSON.parse(JSON.stringify(factura.sedinte));
    for (let i = 0; i < facuturiCopy[facturaIndex].sedinte.length; i++)
      facuturiCopy[facturaIndex].sedinte[i].starePlata = "card";

    await updateDoc(
      elevRef,
      {
        meditatiii: meditatiii,
        facturi: facuturiCopy,
      },
      { merge: true }
    );

    factura.sedinte.forEach(async (dataItem) => {
      let docRef = doc(
        db,
        "sedinte",
        dataItem.sedintaID + Date.parse(new Date(dataItem.data.seconds * 1000))
      );
      console.log(
        dataItem.sedintaID + Date.parse(new Date(dataItem.data.seconds * 1000))
      );
      let docSnap = await getDoc(docRef);
      console.log(docSnap);
      let plati = docSnap.data().plati;
      plati[elevData.id].starePlata = "card";

      await updateDoc(docRef, {
        plati: plati,
      });
    });
  }
};
