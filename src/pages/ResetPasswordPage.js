import React, { useState } from 'react';
import { Button, TextField, Box, Typography, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {useConfirmPasswordResetMutation, useRequestPasswordResetMutation} from "../utils/redux/rtk/publicApi";

export function ResetPasswordPage() {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({ username: '', token: '', newPassword: '' });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const navigate = useNavigate();
    const [requestPasswordReset, { isLoading: isRequestLoading }] = useRequestPasswordResetMutation();
    const [confirmPasswordReset, { isLoading: isConfirmLoading }] = useConfirmPasswordResetMutation();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleRequestSubmit = async (event) => {
        event.preventDefault();
        try {
            await requestPasswordReset(formData.username).unwrap();
            setSuccess('Pokyny k obnovení hesla byly odeslány na váš e-mail.');
            setError('');
            setStep(2);
        } catch (err) {
            setError('Obnovení hesla se nezdařilo. Zkuste to znovu.');
            setSuccess('');
            setStep(2);
        }
    };

    const handleConfirmSubmit = async (event) => {
        event.preventDefault();
        try {
            await confirmPasswordReset({ token: formData.token, newPassword: formData.newPassword }).unwrap();
            setSuccess('Heslo bylo úspěšně resetováno.');
            setError('');
            navigate('/login');
        } catch (err) {
            setError('Resetování hesla se nezdařilo. Zkontrolujte token a zkuste to znovu.');
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
                    {step === 1 ? 'Obnovení hesla' : 'Resetování hesla'}
                </Typography>
                <Box
                    component="form"
                    onSubmit={step === 1 ? handleRequestSubmit : handleConfirmSubmit}
                    noValidate
                    sx={{ mt: 1 }}
                >
                    {step === 1 && (
                        <TextField
                            margin="normal"
                            required
                            fullWidth
                            id="username"
                            label="Uživatelksé jméno"
                            name="username"
                            autoFocus
                            value={formData.username}
                            onChange={handleChange}
                        />
                    )}

                    {step === 2 && (
                        <>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="token"
                                label="Token"
                                name="token"
                                value={formData.token}
                                onChange={handleChange}
                            />
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="newPassword"
                                label="Nové heslo"
                                name="newPassword"
                                type="password"
                                value={formData.newPassword}
                                onChange={handleChange}
                            />
                        </>
                    )}

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
                        disabled={isRequestLoading || isConfirmLoading}
                    >
                        {step === 1 ? 'Odeslat' : 'Resetovat heslo'}
                    </Button>
                </Box>
            </Box>
        </Container>
    );
}
