import { createSlice } from '@reduxjs/toolkit'

const initialState = []

export const placeSlice = createSlice({
    name: 'place',
    initialState: [], 
    reducers: {
		setItems: (state, action) => {
			return action.payload
		},
    },
})

export const { setPlace } = placeSlice.actions

export const selectPlace = (state) => state.place
export default placeSlice.reducer

export const logoutPlace = () => (dispatch) => {
    dispatch(setPlace(initialState))
}