import { createSlice } from "@reduxjs/toolkit"

export const getImageDataSlice = createSlice({
    name: 'getImageData',
    initialState: {
      account: "",
      user_id: "",
      namePhoto: "",
      task_id: "",
      date_capture: "",
      type: "",
      imageUrl: "",
      active: 1,
      service_id: "",
      session_user_id:"",
    },
    reducers: {
      setImageData: (state, action) => ({ ...state, ...action.payload }),
    },
})
  
export const { setImageData } = getImageDataSlice.actions
export default getImageDataSlice.reducer