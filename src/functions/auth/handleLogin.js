import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {setInterval, startTimer} from "../../utils/redux/slices/timerSlice";
import {setUser} from "../../utils/redux/slices/authSlice";
import {useLoginMutation} from "../../utils/redux/rtk/publicApi";

export function useLogin() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [login, {isLoading}] = useLoginMutation();

    async function handleLogin(credentials) {
            const response = await login(credentials).unwrap();
            dispatch(setUser(response));
            dispatch(setInterval(response?.access_token?.expires_in * 1000))
            dispatch(startTimer())
            navigate('/dashboard');
    }

    return handleLogin;
}