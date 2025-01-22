import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useRequestPasswordResetMutation} from "../utils/redux/rtk/publicApi";

export function ResetPasswordPage() {
    const [username, setUsername] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [requestPasswordReset, { isLoading }] = useRequestPasswordResetMutation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            await requestPasswordReset(username).unwrap();
            setSuccess('Pokyny k obnovení hesla byly odeslány na váš e-mail.');
            setError('');
        } catch (err) {
            setError('Obnovení hesla se nezdařilo. Zkuste to znovu.');
            setSuccess('');
        }
    };

    return (
        <Container component="main" maxWidth="xs">
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Obnovení hesla
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Uživatelské jméno"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    {success && (
                        <Alert severity="success" sx={{ mt: 2 }}>
                            {success}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        Odeslat
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
