import { create } from "zustand";
import localforage from "localforage";

// Configuracion localforage para almacenamiento persistente
localforage.config({
  name: "TaxPayerSearchFormUplodImage",
});

const callback = (set) => ({
  config: {
    isClosedAutomatically: true, // Valor inicial de isClosedAutomatically
  },
  toggleIsClosedAutomatically: () =>
    set(({ config }) => {
      const { isClosedAutomatically } = config;
      const newConfig = {
        config: {
          ...config,
          isClosedAutomatically: !isClosedAutomatically,
        },
      };
      localforage.setItem("config", newConfig);

      return { config: newConfig };
    }),
  setIsClosedAutomatically: (value) =>
    set((state) => ({
      config: {
        ...state.config,
        isClosedAutomatically: value,
      },
    })),
});
const useConfig = create(callback);

// Cargar el estado almacenado previamente al iniciar la aplicación
localforage.getItem("config").then((config) => {
  console.log({ config });
  if (config) {
    useConfig.setState({ config });
  }
});

export default useConfig;
