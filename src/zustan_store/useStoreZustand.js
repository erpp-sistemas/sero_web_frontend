import { create } from 'zustand';
const config = (set) => ({
  // Variables
  accountData: null,//ya
  informationContributorPersonalData: null,//ya
  contributorAddress: null,//ya
  payments: null,//ya
  debts: null,//ya
  actions: null,//ya
  photos: null,//ya
  getRowAccount:null,
  getImageData:{//ya
    account: "",
    user_id: "",
    namePhoto: "",
    task_id: "",
    date_capture: "",
    type: "",
    imageUrl: "",
    active: 1,
    service_id: "",
    session_user_id:"",
  },
  plazaNumber:null,//ya
  alertInfo:null,//ya

  
  // Set functions
  setAlertInfoFromRequest: (requestInfo) => set({ alertInfo: requestInfo }),
  setImageData: (newData) => set((state) =>({ getImageData: { ...state.getImageData,...newData } })),
  setRowAccount: (newGetRowAccount) => set((state) => ({ getRowAccount: newGetRowAccount })),
  setAccountData: (newAccountData) => set((state) => ({ accountData: newAccountData })),
  setInformationContributorPersonalData: (newData) => set((state) => ({ informationContributorPersonalData: newData })),
  setContributorAddress: (newAddress) => set((state) => ({ contributorAddress: newAddress })),
  setPayments: (newPayments) => set((state) => ({ payments: newPayments })),
  setDebts: (newDebts) => set((state) => ({ debts: newDebts })),
  setActions: (newActions) => set((state) => ({ actions: newActions })),
  setPhotos: (newPhotos) => set((state) => ({ photos: newPhotos })),
  setPlazaNumber: (newPlazaNumber) => set({ plazaNumber: newPlazaNumber }), // New set function
});
export const useStoreZustand = create(config);


