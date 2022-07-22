import { getDoc } from "firebase/firestore";
export const getSedintaInfo = async (sedintaRef) => {
  let docSnap = await getDoc(sedintaRef);
  console.log("Sedinta INFO: ", docSnap.data());
  return docSnap.data();
};
