import { createSlice } from '@reduxjs/toolkit'

export const getRowAccountSlice = createSlice({
	name: 'getRowAccount',
	initialState: null,
	reducers: {
		setRowAccount: (state, action) => action.payload,
	},
})

export const { setRowAccount } = getRowAccountSlice.actions
export default getRowAccountSlice.reducer