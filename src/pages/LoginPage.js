import React, { useState } from 'react';
import { Avatar, Button, TextField, Link, Grid, Box, Typography, Container } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { loginUser } from '../services/mock/authService';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState(''); // Stav pro chybovou zprávu
    const navigate = useNavigate();

    const handleSubmit = async (event) => {
        event.preventDefault();
        
        try {
            await loginUser({ email, password });
            navigate('/'); // Přesměrování na hlavní stránku po přihlášení
        } catch (error) {
            console.error('Failed to log in:', error);
            setError('Nesprávné přihlašovací údaje. Zkuste to znovu.');
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
                <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
                    <LockOutlinedIcon />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Přihlášení
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Emailová adresa"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="password"
                        label="Heslo"
                        type="password"
                        id="password"
                        autoComplete="current-password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                    {/* Zobrazení chybové zprávy, pokud přihlášení selže */}
                    {error && (
                        <Typography color="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                    >
                        Přihlásit se
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link component={RouterLink} to="#" variant="body2">
                                Zapomněli jste heslo?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="/register" variant="body2">
                                {"Nemáte účet? Zaregistrujte se"}
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;