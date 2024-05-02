import { combineReducers } from "redux"
import userReducer from "../features/user/userSlice"
import placeReducer from "../features/place/placeSlice"
import plazaMapaReducer from "./plazaMapa.Slice"
import featuresReducer from "./featuresSlice"
import dialogReducer from "./dialogSlice"
import mapaReducer from "./mapaSlice"
import accountData from "./accountDataSlice"
import actions from "./actionsSlice"
import alertInfo from "./alertInfoSlice"
import contributorAddress from "./contributorAddressSlice"
import debts from "./debtsSlice"
import getImageData from "./getImageDataSlice"
import getRowAccount from './getRowAccountSlice'
import informationContributor from './informationContributorSlice'
import payment from './paymentsSlice'
import photo from './photosSlice'
import plazaNumber from './plazaNumberSlice'
import apikeyGeocoding from './apikeyGeocodingSlice'
import dataGeocoding from "./dataGeocodingSlice"
import recordsSlice from "./recordsSlice"

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
  plazaNumber:plazaNumber,
  apikeyGeocoding:apikeyGeocoding,
  dataGeocoding:dataGeocoding,
  records: recordsSlice,
  //service: serviceReducer,
  //process: processReducer,

})

export default rootReducer
