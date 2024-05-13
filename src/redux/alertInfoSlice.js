
import { createSlice } from '@reduxjs/toolkit'

export const alertInfoSlice = createSlice({
    name: 'alertInfo',
    initialState: null,
    reducers: {
      setAlertInfoFromRequest: (state, action) => action.payload,
    },
})

export const { setAlertInfoFromRequest } = alertInfoSlice.actions
export default alertInfoSlice.reducer