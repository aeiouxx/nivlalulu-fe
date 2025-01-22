import React, { useState } from 'react';
import { Button, TextField, Link, Grid, Box, Typography, Container, Alert } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { setUser } from '../utils/redux/slices/authSlice';
import {useLoginMutation} from "../utils/redux/rtk/publicApi";

const LoginPage = () => {
    const [credentials, setCredentials] = useState({ username: '', password: '' });
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [login, { isLoading }] = useLoginMutation();

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await login(credentials).unwrap();
            console.log(response)
            dispatch(setUser(response));
            navigate('/dashboard');
        } catch (err) {
            setError('Nesprávné přihlašovací údaje. Zkuste to znovu.');
        }
    };

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    return (
        <Container component="main" maxWidth="xs">
            <Button
                onClick={() => setCredentials({ username: 'nivlalulu', password: 'nivlalulu' })}
                fullWidth
                variant="outlined"
                color="secondary"
            >
                Rychlé přihlášení
            </Button>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                }}
            >
                <Typography component="h1" variant="h5">
                    Přihlášení
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Username"
                        name="username"
                        autoComplete="username"
                        autoFocus
                        value={credentials.username}
                        onChange={handleChange}
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
                        value={credentials.password}
                        onChange={handleChange}
                    />
                    {error && (
                        <Alert severity="error" sx={{ mt: 2 }}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{ mt: 3, mb: 2 }}
                        disabled={isLoading}
                    >
                        Přihlásit se
                    </Button>
                    <Grid container>
                        <Grid item xs>
                            <Link component={RouterLink} to="/resetPassword" variant="body2">
                                Zapomněli jste heslo?
                            </Link>
                        </Grid>
                        <Grid item>
                            <Link component={RouterLink} to="/register" variant="body2">
                                Nemáte účet? Zaregistrujte se
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default LoginPage;
