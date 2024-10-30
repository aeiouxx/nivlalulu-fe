import React, { useEffect, useState, } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Typography, TextField, Button, Box } from '@mui/material';
import { Save, ExitToApp } from '@mui/icons-material';
import AuthService from '../services/AuthService';

const ProfilePage = () => {
    const navigate = useNavigate();
    const [userData, setUserData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [originalData, setOriginalData] = useState({});

    useEffect(() => {
        if (confirmPassword && userData.password !== confirmPassword) {
            setError('Hesla se neshodují');
        } else {
            setError('');
        }
    }, [userData.password, confirmPassword]);

    useEffect(() => {
        // Načtení dat uživatele při inicializaci stránky
        const loadUserData = async () => {
            try {
                const user = await AuthService.getUserFromToken();
                console.log(user)
                setUserData(user);
                setOriginalData(user); // Uchování původních dat pro kontrolu změn
            } catch (error) {
                console.error('Chyba při načítání profilu:', error);
            }
        };

        loadUserData();
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserData((prevData) => ({ ...prevData, [name]: value }));
    };

    const handleSave = async () => {
        try {
            await AuthService.updateUserProfile(userData);
            setOriginalData(userData); // Aktualizace uložených dat po úspěšném uložení
            alert('Údaje byly úspěšně uloženy.');
        } catch (error) {
            console.error('Chyba při ukládání údajů:', error);
            alert('Ukládání údajů se nezdařilo.');
        }
    };

    return (
        <Container maxWidth="sm">
            <Typography variant="h4" sx={{ mt: 4, mb: 2 }}>
                Profil uživatele
            </Typography>
            <Box component="form" sx={{ mt: 1 }}>
                <TextField
                    fullWidth
                    margin="normal"
                    label="Uživatelské jméno"
                    name="username"
                    value={userData.username}
                    onChange={handleChange}
                    disabled // Předpoklad, že uživatelské jméno není editovatelné
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Email"
                    name="email"
                    value={userData.email}
                    onChange={handleChange}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    label="Nové heslo"
                    name="password"
                    type="password"
                    value={userData.password}
                    onChange={handleChange}
                    placeholder="Zadejte nové heslo"
                />
                <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Potvrzení hesla"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                     {error && (
                        <Typography className="error" sx={{ mt: 1 }}>
                            {error}
                        </Typography>
                    )}
                    <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                    <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSave}
                    disabled={JSON.stringify(userData) === JSON.stringify(originalData)}
                    sx={{ mt: 3 }}
                >
                    Uložit změny
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ExitToApp />}
                    onClick={() => { navigate('/') }}
                >
                    Zavřít
                </Button>
                    </Box>
            </Box>
        </Container>
    );
};

export default ProfilePage;
