import {createSlice} from "@reduxjs/toolkit";

const initialState = {
    accessToken: null,
    username: null
};

const authSlice = createSlice({
    name: 'auth',
    initialState,
    reducers: {
        setUser: (state, action) => {
            state.accessToken = action.payload.accessToken;
            state.username = action.payload.username;
        },
        clearUser: (state) => {
            state.accessToken = null
            state.username = null
        }
    },
});

export const {setUser,clearUser} = authSlice.actions;
export default authSlice.reducer;