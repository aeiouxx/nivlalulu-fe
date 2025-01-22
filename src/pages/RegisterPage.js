import React, {useState} from 'react';
import {Button, TextField, Link, Grid, Box, Typography, Container, Alert} from '@mui/material';
import {Link as RouterLink, useNavigate} from 'react-router-dom';
import {useRegisterMutation} from "../utils/redux/rtk/publicApi";

const RegisterPage = () => {
    const [form, setForm] = useState({username: '', email: '', password: '', confirmPassword: ''});
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const [register, {isLoading}] = useRegisterMutation();

    const handleChange = (e) => {
        setForm({...form, [e.target.name]: e.target.value});
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (form.password !== form.confirmPassword) {
            setError('Hesla se neshodují.');
            return;
        }
        try {
            await register({username: form.username, email: form.email, password: form.password}).unwrap();
            navigate('/dashboard');
        } catch (err) {
            console.log(err)
            setError('Registrace se nezdařila: ' + err.data.password);
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
                    Registrace
                </Typography>
                <Box component="form" onSubmit={handleSubmit} noValidate sx={{mt: 1}}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="username"
                        label="Uživatelské jméno"
                        name="username"
                        value={form.username}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Emailová adresa"
                        name="email"
                        value={form.email}
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
                        value={form.password}
                        onChange={handleChange}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Potvrzení hesla"
                        type="password"
                        id="confirmPassword"
                        value={form.confirmPassword}
                        onChange={handleChange}
                    />
                    {error && (
                        <Alert severity="error" sx={{mt: 2}}>
                            {error}
                        </Alert>
                    )}
                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        sx={{mt: 3, mb: 2}}
                        disabled={isLoading}
                    >
                        Zaregistrovat se
                    </Button>
                    <Grid container justifyContent="flex-end">
                        <Grid item>
                            <Link component={RouterLink} to="/login" variant="body2">
                                Už máte účet? Přihlaste se
                            </Link>
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
};

export default RegisterPage;
