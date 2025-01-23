import {useEffect, useCallback} from "react";
import {useSelector, useDispatch} from "react-redux";
import {setInterval, startTimer, stopTimer} from "../utils/redux/slices/timerSlice";
import {useLogout} from "../functions/auth/handleLogout";
import {useRefreshTokenMutation} from "../utils/redux/rtk/publicApi";

const TimerComponent = () => {
    const isRunning = useSelector((state) => state.timer.isRunning);
    const interval = useSelector((state) => state.timer.interval);
    const dispatch = useDispatch();
    const handleLogout = useLogout();
    const [refreshToken] = useRefreshTokenMutation();

    const refreshSession = useCallback(async () => {
        try {
            const result = await refreshToken().unwrap();
            dispatch(setInterval(result?.expires_in * 1000));
            console.log("Relace byla obnovena.");
        } catch (e) {
            alert("Token nelze obnovit, je nutné nové přihlášení!");
            await handleLogout();
        }
    }, [dispatch, refreshToken, handleLogout]);

    const timerExpiredFunction = useCallback(async () => {
        const result = window.confirm(
            "Relace vypršela, pro prodloužení zvolte 'OK', jinak budete odhlášeni."
        );
        if (result) {
            await refreshSession();
            dispatch(startTimer());
        } else {
            await handleLogout();
            dispatch(stopTimer());
        }
    }, [dispatch, refreshSession, handleLogout]);

    useEffect(() => {
        if (!isRunning || interval === null) return;

        console.log("Relace vyprší za:", interval);

        const timer = setTimeout(async () => {
            await timerExpiredFunction();
        }, interval);

        return () => clearTimeout(timer);
    }, [isRunning, interval, timerExpiredFunction]);

    return null;
};

export default TimerComponent;
