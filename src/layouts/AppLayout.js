import {Avatar, Box, Button, Container, IconButton, Stack, Typography} from "@mui/material";
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import AuthService from "../services/authService";
import {useNavigate} from "react-router-dom";

export default function AppLayout({children}) {
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

    const handleLogout = () => {
        AuthService.logoutUser();
        navigate('/');
    };

    const handleProfile = () => {
        navigate('/profil');
    };

    return (
        <Stack pl={3} pr={1} direction={"row"} justifyContent={"space-between"} sx={{borderBottom: "1px solid gray"}}
               alignItems={"center"}>
            <Typography variant={"h5"}>Fakturka</Typography>
            <Stack direction={"row"} justifyContent={"flex-end"} alignItems={"center"} py={1} spacing={1}>
                <Typography variant={"body1"}>Lukáš Bajer</Typography>
                <Stack alignItems={"center"} direction={"row"}>
                    <IconButton onClick={handleProfile}><AccountCircleIcon fontSize={'medium'}/></IconButton>
                    <IconButton onClick={handleLogout}><LogoutIcon fontSize={'medium'}/></IconButton>
                </Stack>
            </Stack>
        </Stack>
    )
}