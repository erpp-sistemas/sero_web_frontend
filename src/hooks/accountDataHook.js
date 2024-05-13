import { useSelector, useDispatch } from 'react-redux'
import { setAccountData } from '../redux/accountDataSlice'

const useAccountData = () => {
	const accountData = useSelector((state) => state.account)
	const dispatch = useDispatch()

	const setAccountDataAction = (data) => {
		dispatch(setAccountData(data))
	}

	return {
		accountData,
		setAccountData: setAccountDataAction,
	}

}

export default useAccountData