import { create } from 'zustand';
import coordenadas from '../Custom/coordenadas';
import { contribuyente } from '../Custom/contribuyente';
import { domicilio } from '../Custom/domicilios';
import adeudo from '../Custom/adeudos';
import pagos from '../Custom/pagos';
import fotosTomadas from '../Custom/fotos.tomadas';
import { isDevelopment } from '../config';


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
  coordenadas: coordenadas,
  contribuyente: contribuyente,
  domicilio: domicilio,
  adeudos: adeudo,
  pagos: pagos,
  fotos: fotosTomadas,
  rol: '',
  datosFaltantes: [],
  servicio: "Predio", // "Agua",
  cuenta: '000000-0',
  esRolSuperior: true,
  data: {},
 
}


const config = (set) => ({
  plaza: isDevelopment ? testConfig.plaza : null,
  coordenadas: isDevelopment ? testConfig.coordenadas : null,
  contribuyente: isDevelopment ? testConfig.contribuyente : null,
  domicilio: isDevelopment ? testConfig.domicilio : null,
  adeudos: isDevelopment ? testConfig.adeudos : null,
  pagos: isDevelopment ? testConfig.pagos : null,
  fotos: isDevelopment ? testConfig.fotos : null,
  rol: isDevelopment ? testConfig.rol : null,
  datosFaltantes: isDevelopment ? testConfig.datosFaltantes : null,
  cuenta: isDevelopment ? testConfig.cuenta : null,
  servicio: isDevelopment ? testConfig.servicio : null,
  esRolSuperior: isDevelopment ? testConfig.esRolSuperior : null,
  data: isDevelopment ? testConfig.data : null,
  specificAccount: '',
  accions:  null,
  photographs: null,
  stPhotographs:(newPhotographs)=> set({photographs:newPhotographs}),
  setAccions:(newAccions) => set({ accions: newAccions }),
  setSpecificAccount:(newSpecificAccount)=>set({specificAccount: newSpecificAccount}),
  setFotosFuncion: (callback) => set((state) => ({ fotos: callback(state.fotos) })),
  
  set: (setter) => set(setter),
  setCoordenadas: (nuevasCoordenadas) => set((state) => ({ coordenadas: nuevasCoordenadas })),
  setContribuyente: (nuevoContribuyente) => set((state) => ({ contribuyente: nuevoContribuyente })),
  setDomicilio: (nuevoDomicilio) => set((state) => ({ domicilio: nuevoDomicilio })),
  setAdeudos: (nuevosAdeudos) => set((state) => ({ adeudos: nuevosAdeudos })),
  setPagos: (nuevosPagos) => set((state) => ({ pagos: nuevosPagos })),
  setPlaza: (nuevaPlaza) => set((state) => ({ plaza: nuevaPlaza })),
  setFotos: (nuevasFotos) => set((state) => ({ fotos: nuevasFotos })),
  setRol: (nuevoRol) => set((state) => ({ rol: nuevoRol })),
  setDatosFaltantes: (nuevosDatos) => set((state) => ({ datosFaltantes: nuevosDatos })),

  setCuenta: (nuevaCuenta) => set((state) => ({ cuenta: nuevaCuenta })),
  setServicio: (nuevoServicio) => set((state) => ({ servicio: nuevoServicio })),
  setEsRolSuperior: (nuevoEsRolSuperior) => set((state) => ({ esRolSuperior: nuevoEsRolSuperior })),
  setData: (nuevaData) => set((state) => ({ data: nuevaData })),
});
const useStore = create(config);

export default useStore;
