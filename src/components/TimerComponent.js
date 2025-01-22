import {useEffect} from "react";
import {useSelector, useDispatch} from "react-redux";
import {stopTimer} from "../utils/redux/slices/timerSlice";
import {useLogout} from "../functions/auth/handleLogout";
import {useRefreshTokenMutation} from "../utils/redux/rtk/publicApi";

const TimerComponent = () => {
    const isRunning = useSelector((state) => state.timer.isRunning);
    const interval = useSelector((state) => state.timer.interval);
    const dispatch = useDispatch();
    const handleLogout = useLogout()
    const [refreshToken] = useRefreshTokenMutation()

    async function timerExpiredFunction() {
        // eslint-disable-next-line no-restricted-globals
        const result = confirm("Relace vypršela, pro prodloužení zvolte 'OK' jinak budete odhlášení. ");
        if (result) {
            // yes
            await refreshToken().unwrap()
        } else {
            // cancel
            await handleLogout()
        }
    }

    useEffect(() => {
        if (!isRunning) return;

        const timer = setTimeout(async () => {
            await timerExpiredFunction()
            dispatch(stopTimer())
        }, interval);

        return () => clearTimeout(timer);
    }, [isRunning, interval, dispatch]);

    return null;
};

export default TimerComponent;
