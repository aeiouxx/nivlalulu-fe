import {useNavigate} from "react-router-dom";
import AuthService from "../services/authService";
import {Button, IconButton, Stack, Typography} from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import LogoutIcon from "@mui/icons-material/Logout";
import {useDispatch, useSelector} from "react-redux";
import {clearUser} from "../utils/redux/slices/authSlice";

export default function Header() {
    const navigate = useNavigate();
    const user = useSelector(state => state.auth)
    const userIsLoggedIn = user.username != null;
    const dispatch = useDispatch();

    const handleLogout = () => {
        AuthService.logoutUser();
        dispatch(clearUser())
        navigate('/');
    };

    const handleProfile = () => {
        navigate('/profil');
    };

    const navigateToIndex = () => {
        navigate('/')
    }

    const navigateToLogin = () => {
        AuthService.logoutUser();
        navigate('/login');
    };

    const navigateToSignIn = () => {
        navigate('/register');
    };

    return (
        <Stack pl={3} pr={1} direction={"row"} justifyContent={"space-between"}
               sx={{borderBottom: "1px solid lightgray"}}
               alignItems={"center"}>
            <Typography variant={"h5"} fontWeight={"bold"} onClick={navigateToIndex}>Fakturka</Typography>
            <Stack direction={"row"} justifyContent={"flex-end"} alignItems={"center"} py={1} spacing={1}>
                {userIsLoggedIn && (
                    <>
                        <Typography variant={"body1"}>Lukáš Bajer</Typography>
                        <Stack alignItems={"center"} direction={"row"}>
                            <IconButton onClick={handleProfile}><AccountCircleIcon fontSize={'medium'}/></IconButton>
                            <IconButton onClick={handleLogout}><LogoutIcon fontSize={'medium'}/></IconButton>
                        </Stack>
                    </>
                )}

                {!userIsLoggedIn && (
                    <Stack alignItems={"center"} direction={"row"} spacing={1}>
                        <Button variant={"contained"} onClick={navigateToLogin}>login</Button>
                        <Button variant={"contained"} onClick={navigateToSignIn}>sign in</Button>
                    </Stack>
                )}

            </Stack>
        </Stack>
    )
}