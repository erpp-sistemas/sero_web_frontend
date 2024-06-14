import { createSlice } from "@reduxjs/toolkit"

export const debtsSlice = createSlice({
    name: 'debts',
    initialState: null,
    reducers: {
      setDebts: (state, action) => action.payload,
    },
})
  
export const { setDebts } = debtsSlice.actions
export default debtsSlice.reducer
  