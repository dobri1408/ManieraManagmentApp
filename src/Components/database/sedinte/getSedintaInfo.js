import { getDoc } from "firebase/firestore";
export const getSedintaInfo = async (sedintaRef) => {
  let docSnap = await getDoc(sedintaRef);

  return docSnap.data();
};
