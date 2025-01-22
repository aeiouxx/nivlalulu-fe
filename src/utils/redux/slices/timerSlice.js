import { createSlice } from "@reduxjs/toolkit";

const timerSlice = createSlice({
    name: "timer",
    initialState: {
        isRunning: false,
        interval: 0, // Výchozí interval 10 sekund
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
    },
});

export const { startTimer, stopTimer, setInterval } = timerSlice.actions;
export default timerSlice.reducer;
