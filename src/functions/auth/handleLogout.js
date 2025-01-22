import {clearUser} from "../../utils/redux/slices/authSlice";
import {useDispatch} from "react-redux";
import {useNavigate} from "react-router-dom";
import {useLogoutMutation} from "../../utils/redux/rtk/accountApi";
import {invoicesApi} from "../../utils/redux/rtk/invoicesApi";

export function useLogout() {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [logout] = useLogoutMutation();

    async function handleLogout() {
        try {
            await logout().unwrap();
            dispatch(invoicesApi.util.resetApiState());
            dispatch(clearUser());
            navigate('/');
        } catch (error) {
            console.error("Chyba při odhlášení:", error);
        }
    }

    return handleLogout;
}
