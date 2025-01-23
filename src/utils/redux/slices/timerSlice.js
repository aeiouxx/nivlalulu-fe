import {createSlice} from "@reduxjs/toolkit";

const timerSlice = createSlice({
    name: "timer",
    initialState: {
        isRunning: false,
        interval: 0,
    },
    reducers: {
        startTimer: (state) => {
            state.isRunning = true;
        },
        stopTimer: (state) => {
            state.isRunning = false;
        },
        setInterval: (state, action) => {
            state.interval = action.payload;
        },
        clearTimer: (state) => {
            state.interval = 0
            state.isRunning = false
        }
    },
});

export const {startTimer, stopTimer, setInterval, clearTimer} = timerSlice.actions;
export default timerSlice.reducer;
