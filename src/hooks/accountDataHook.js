import { useSelector, useDispatch } from 'react-redux';
import { setAccountData } from '../redux/accountDataSlice';

// Hook personalizado para el slice accountData
const useAccountData = () => {
  const accountData = useSelector((state) => state.account); // Accede al estado del slice
  const dispatch = useDispatch();

  // Acciones personalizadas para el slice accountData
  const setAccountDataAction = (data) => {
    dispatch(setAccountData(data));
  };

  // Puedes agregar más acciones según tus necesidades

  return {
    accountData,
    setAccountData: setAccountDataAction,
    // Agrega más funciones de acción si es necesario
  };
};

export default useAccountData;