import {Avatar, Box, Button, Container, IconButton, Stack, Typography} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthService from "../services/authService";
import {useNavigate} from "react-router-dom";

export default function IndexLayout({children}) {
    return (
        <Stack flex={1}>
            <Header/>
            <Container>
                {children}
            </Container>
        </Stack>
    )
}

function Header() {
    const navigate = useNavigate();

    const navigateToIndex = () => {
        navigate('/');
    }
    const navigateToLogin = () => {
        AuthService.logoutUser();
        navigate('/login');
    };

    const navigateToSignIn = () => {
        navigate('/register');
    };

    return (
        <Stack pl={3} pr={1} direction={"row"} justifyContent={"space-between"} sx={{borderBottom: "1px solid gray"}}
               alignItems={"center"}>
            <Typography variant={"h5"} onClick={navigateToIndex}>Fakturka</Typography>
            <Stack direction={"row"} justifyContent={"flex-end"} alignItems={"center"} py={1} spacing={1}>
                <Stack alignItems={"center"} direction={"row"} spacing={1}>
                    <Button variant={"contained"} onClick={navigateToLogin}>login</Button>
                    <Button variant={"contained"} onClick={navigateToSignIn}>sign in</Button>
                </Stack>
            </Stack>
        </Stack>
    )
}