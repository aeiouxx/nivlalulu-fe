import React, {useState} from "react";
import {Container, Typography, TextField, Button, Stack, Alert, Box} from "@mui/material";
import {Save} from "@mui/icons-material";
import {
    useChangeEmailMutation,
    useChangePasswordMutation,
    useChangeUsernameMutation
} from "../utils/redux/rtk/accountApi";
import {handleLogout, useLogout} from "../functions/auth/handleLogout";
import {useNavigate} from "react-router-dom";
import {useDispatch} from "react-redux";


const ProfilePage = () => {
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState(false);
    const handleLogout = useLogout();

    const [changeUsername] = useChangeUsernameMutation();
    const [changeEmail] = useChangeEmailMutation();
    const [changePassword] = useChangePasswordMutation();

    const handleUsernameChange = async () => {
        try {
            await changeUsername(username).unwrap();
            setMessage("Uživatelské jméno bylo úspěšně změněno.");
            alert("Uživatelské jméno bylo úspěšně změněno.")
            await handleLogout();
            setError(false);
        } catch (err) {
            setMessage("Nepodařilo se změnit uživatelské jméno.");
            setError(true);
        }
    };

    const handleEmailChange = async () => {
        try {
            await changeEmail(email).unwrap();
            setMessage("Email byl úspěšně změněn.");
            alert("Email byl úspěšně změněn.")
            await handleLogout();
            setError(false);
        } catch (err) {
            setMessage("Nepodařilo se změnit email.");
            setError(true);
        }
    };

    const handlePasswordChange = async () => {
        try {
            await changePassword({oldPassword, newPassword}).unwrap();
            setMessage("Heslo bylo úspěšně změněno.");
            alert("Heslo bylo úspěšně změněno.")
            await handleLogout();
            setError(false);
        } catch (err) {
            setMessage("Nepodařilo se změnit heslo.");
            setError(true);
        }
    };

    return (
        <Container maxWidth="sm">
            <Stack spacing={4} mt={2}>
                <Box>
                    <Typography variant="h4">
                        Profil
                    </Typography>
                    <Typography color={"warning"}>Po úspěšné změně údajů budete automaticky odhlášení!</Typography>
                </Box>
                <Stack spacing={3}>
                    {message && <Alert severity={error ? "error" : "success"}>{message}</Alert>}
                    <Stack direction="row" spacing={2}>
                        <TextField
                            fullWidth
                            label="Uživatelské jméno"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                        <Button variant="contained" onClick={handleUsernameChange}>
                            Uložit
                        </Button>
                    </Stack>
                    <Stack direction="row" spacing={2}>
                        <TextField
                            fullWidth
                            label="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                        <Button variant="contained" onClick={handleEmailChange}>
                            Uložit
                        </Button>
                    </Stack>
                    <Stack spacing={2}>
                        <TextField
                            fullWidth
                            label="Staré heslo"
                            type="password"
                            value={oldPassword}
                            onChange={(e) => setOldPassword(e.target.value)}
                        />
                        <TextField
                            fullWidth
                            label="Nové heslo"
                            type="password"
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                        />
                        <Button
                            variant="contained"
                            startIcon={<Save/>}
                            onClick={handlePasswordChange}
                        >
                            Změnit heslo
                        </Button>
                    </Stack>
                </Stack>
            </Stack>
        </Container>
    );
};

export default ProfilePage;
