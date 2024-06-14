import { createSlice } from "@reduxjs/toolkit"

export const apikeyGeocodingSlice = createSlice({
    name: 'apikeyGeocodingSlice',
    initialState: null,
    reducers: {
        setApikeyGeocodingSlice: (state, action) => action.payload,
    },
})
  
export const { setApikeyGeocodingSlice } = apikeyGeocodingSlice.actions
export default apikeyGeocodingSlice.reducer