import { create } from "zustand";

const config = (set) => ({
  blob: null,
  getBlob: null,
  setGetBlob: (handleGetBlob) => set((state) => ({ getBlob: handleGetBlob })),
  setBlob: (blob) => set((state) => ({ blob })),
});
/* 

Apoyame con estado de zustang que establece una propiedad como texto , ademas otra propiedad como funcion*/
const usePDF = create(config);

export default usePDF;
