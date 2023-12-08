import { create } from 'zustand';
import coordenadas from '../Custom/coordenadas';
import { contribuyente } from '../Custom/contribuyente';
import { domicilio } from '../Custom/domicilios';
import adeudo from '../Custom/adeudos';
import pagos from '../Custom/pagos';
import fotosTomadas from '../Custom/fotos.tomadas';

const ENV = 'development' //|| 'production';
const isDevelopment = (ENV === 'development');
/*
* plaza 
* coordenadas
* contribuyente
* domicilio
* adeudo
* pagos
* fotos
* rol
* datosFaltantes
* servicio
* cuenta
* esRolSuperior
* data
*/

const testConfig = {
  plaza: '',
  coordinates: coordenadas,
  taxpayer: contribuyente,
  address: domicilio,
  debts: adeudo,
  payments: pagos,
  photos: fotosTomadas,
  role: '',
  missingData: [],
  account: '000000-0',
  service: "Predio", // "Agua",
  isSuperiorRole: true,
  data: {},
}

const config = (set) => ({
  plaza: isDevelopment ? testConfig.plaza : null,
  coordinates: isDevelopment ? testConfig.coordinates : null,
  taxpayer: isDevelopment ? testConfig.taxpayer : null,
  address: isDevelopment ? testConfig.address : null,
  debts: isDevelopment ? testConfig.debts : null,
  payments: isDevelopment ? testConfig.payments : null,
  photos: isDevelopment ? testConfig.photos : null,
  role: isDevelopment ? testConfig.role : null,
  missingData: isDevelopment ? testConfig.missingData : null,
  account: isDevelopment ? testConfig.account : null,
  service: isDevelopment ? testConfig.service : null,
  isSuperiorRole: isDevelopment ? testConfig.isSuperiorRole : null,
  data: isDevelopment ? testConfig.data : null,
  
  setCoordinates: (newCoordinates) => set((state) => ({ coordinates: newCoordinates })),
  setTaxpayer: (newTaxpayer) => set((state) => ({ taxpayer: newTaxpayer })),
  setAddress: (newAddress) => set((state) => ({ address: newAddress })),
  setDebts: (newDebts) => set((state) => ({ debts: newDebts })),
  setPayments: (newPayments) => set((state) => ({ payments: newPayments })),
  setPlaza: (newPlaza) => set((state) => ({ plaza: newPlaza })),
  setPhotos: (newPhotos) => set((state) => ({ photos: newPhotos })),
  setRole: (newRole) => set((state) => ({ role: newRole })),
  setMissingData: (newData) => set((state) => ({ missingData: newData })),
  
  setAccount: (newAccount) => set((state) => ({ account: newAccount })),
  setService: (newService) => set((state) => ({ service: newService })),
  setIsSuperiorRole: (newIsSuperiorRole) => set((state) => ({ isSuperiorRole: newIsSuperiorRole })),
  setData: (newData) => set((state) => ({ data: newData })),
});

const useStore = create(config);

export default useStore;
