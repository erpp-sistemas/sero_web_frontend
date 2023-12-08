import { createSlice } from '@reduxjs/toolkit'



export const accountDataSlice = createSlice({
    name: 'accountData',
    initialState: null,
    reducers: {
      setAccountData: (state, action) => action.payload,
    },
})

export const { setAccountData } = accountDataSlice.actions 
export default accountDataSlice.reducer

