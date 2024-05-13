import { createSlice } from '@reduxjs/toolkit'

export const contributorAddressSlice = createSlice({
	name: 'contributorAddress',
	initialState: null,
	reducers: {
		setContributorAddress: (state, action) => action.payload,
	},
})

export const { setContributorAddress } = contributorAddressSlice.actions
export default contributorAddressSlice.reducer