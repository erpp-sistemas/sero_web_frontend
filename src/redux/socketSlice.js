import { createSlice } from '@reduxjs/toolkit';


export const webSocketSlice  = createSlice({
    name: 'webSocket',
    initialState: {
        socket: null,
        messages: []
    },
    reducers: {
        setSocket: (state, action) => {
            state.socket = action.payload;
        },
        addMessage: (state, action) => {
            state.messages.push(action.payload);
        },
        cleanMessages: (state, action) => {
            state.messages = [];
        }
    }
})


export const { setSocket, addMessage, cleanMessages } = webSocketSlice.actions;
export default webSocketSlice.reducer;