import { useSelector, useDispatch } from 'react-redux'
import { setAccountData } from '../redux/accountDataSlice'
import { setActions } from '../redux/actionsSlice'
import { setAlertInfoFromRequest } from '../redux/alertInfoSlice'
import { setDebts } from '../redux/debtsSlice'
import { setInformationContributor } from '../redux/informationContributorSlice'
import { setPhotos } from '../redux/photosSlice'
import { setPayments } from '../redux/paymentsSlice'

const useCombinedSlices = () => {
  const accountData = useSelector((state) => state.account)
  const payments = useSelector((state)=>state.payment)
  const actions = useSelector((state) => state.actions)
  const photos = useSelector((state) => state.photo)
  const alertInfo = useSelector((state) => state.alertInfo)
  const informationContributor = useSelector((state) => state.informationContributor)
  const debts = useSelector((state) => state.debts)

  const dispatch = useDispatch()

  const setAccountDataAction = (data) => {
    dispatch(setAccountData(data))
  }

  const setInformationContributorAction = (data) => { 
    dispatch(setInformationContributor(data))
  }

  const setDebtsAction = (data) => { 
    dispatch(setDebts(data))
  }

  const setPaymentsAction = (data) => { 
    dispatch(setPayments(data))
  }

  const setActionsAction = (data) => {
    dispatch(setActions(data));
  }

  const setPhotosAction = (data) => {
    dispatch(setPhotos(data))
  }

  const setAlertInfoAction = (data) => {
    dispatch(setAlertInfoFromRequest(data))
  }

	return {
		accountData,
		informationContributor,
		debts,
		payments,
		actions,
		photos,
		alertInfo,
		setAccountData: setAccountDataAction,
		setInformationContributor: setInformationContributorAction,
		setDebts: setDebtsAction,
		setPayments:setPaymentsAction,
		setActions: setActionsAction,
		setPhotos: setPhotosAction,
		setAlertInfo: setAlertInfoAction,
	}

}

export default useCombinedSlices
