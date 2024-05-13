import { createSlice } from '@reduxjs/toolkit'

export const informationContributorSlice = createSlice({
	name: 'informationContributor',
	initialState: null,
	reducers: {
		setInformationContributor: (state, action) => action.payload,
	},
})

export const { setInformationContributor } = informationContributorSlice.actions
export default informationContributorSlice.reducer