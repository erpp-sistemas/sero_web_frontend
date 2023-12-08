import { combineReducers } from "redux";
import userReducer from "../features/user/userSlice"; // Importa el reducer de usuario
import placeReducer from "../features/place/placeSlice";
import plazaMapaReducer from "./plazaMapa.Slice"; // Importa el reducer de campana y mapa
import featuresReducer from "./featuresSlice"; // Importa el reducer de características
import dialogReducer from "./dialogSlice"; // Importa el reducer de diálogo
import mapaReducer from "./mapaSlice"; // Importa el reducer de mapa
import accountData from "./accountDataSlice"; //Importa el reducer de accountData
import actions from "./actionsSlice";
import alertInfo from "./alertInfoSlice";
import contributorAddress from "./contributorAddressSlice";
import debts from "./debtsSlice";
import getImageData from "./getImageDataSlice";
import getRowAccount from './getRowAccountSlice'
import informationContributor from './informationContributorSlice'
import payment from './paymentsSlice'
import photo from './photosSlice'
import plazaNumber from './plazaNumberSlice'
const rootReducer = combineReducers({
  user: userReducer,
  place: placeReducer,
  plaza_mapa: plazaMapaReducer,
  features: featuresReducer,
  dialog: dialogReducer,
  mapa: mapaReducer,
  account: accountData,
  actions: actions,
  alertInfo: alertInfo,
  contributorAddress: contributorAddress,
  debts: debts,
  getImageData: getImageData,
  getRowAccount:getRowAccount,
  informationContributor:informationContributor,
  payment:payment,
  photo:photo,
  plazaNumber:plazaNumber






  //service: serviceReducer,
  //process: processReducer,
  // Agrega más reducers individuales aquí si es necesario
});

export default rootReducer;
