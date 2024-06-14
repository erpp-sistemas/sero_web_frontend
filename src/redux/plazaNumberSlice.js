import { createSlice } from "@reduxjs/toolkit"

export const plazaNumberSlice = createSlice({
    name: 'plazaNumber',
    initialState: null,
    reducers: {
      setPlazaNumber: (state, action) => action.payload,
    },
})
  
export const { setPlazaNumber } = plazaNumberSlice.actions
export default plazaNumberSlice.reducer