import { createSlice } from '@reduxjs/toolkit'

const initialState = {
  user_id: 0,
  name: '',
  birthdate: '',
  sex: '',
  personal_phone: '',
  work_phone: '',
  username: '', 
  profile_id: 0,
  profile: '',
  active: false,
  isAuthenticated: false,
  place_service_process: []
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        setUser : (state, action) => {
            const { user_id, name, birthdate, sex,  personal_phone, work_phone, username, profile_id, profile, active, photo, place_service_process } = action.payload
            state.user_id = user_id
            state.name = name
            state.birthdate = birthdate
            state.sex = sex            
            state.personal_phone = personal_phone
            state.work_phone = work_phone
            state.username = username
            state.profile_id = profile_id
            state.profile = profile
            state.active = active,
            state.photo = photo
            state.isAuthenticated = true,
            state.place_service_process = place_service_process
        }
    }
})

export const { setUser } = userSlice.actions
export default userSlice.reducer

export const logoutUser = () => (dispatch) => {
    dispatch(setUser(initialState))
}