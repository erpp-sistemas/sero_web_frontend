import { createSlice } from "@reduxjs/toolkit"

export const actionsSlice = createSlice({
    name: 'actions',
    initialState: null,
    reducers: {
      setActions: (state, action) => action.payload,
    },
 })
  
export const { setActions } = actionsSlice.actions
export default actionsSlice.reducer