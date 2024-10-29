import React, { useEffect, useState } from 'react';
import { Container, Typography, Button, Grid, Paper, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { logoutUser } from '../services/mock/authService';
import { fetchInvoices } from '../services/mock/invoiceService';
import { fetchTemplates } from '../services/mock/templateService';

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]); // Stav pro seznam faktur
    const [templates, setTemplates] = useState([]); // Stav pro seznam šablon
    const navigate = useNavigate();

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                const invoiceData = await fetchInvoices(); // Načtení faktur z backendu
                setInvoices(invoiceData);
            } catch (error) {
                console.error('Failed to load invoices:', error);
            }
        };

        const loadTemplates = async () => {
            try {
                const templateData = await fetchTemplates(); // Načtení šablon z backendu
                setTemplates(templateData);
            } catch (error) {
                console.error('Failed to load templates:', error);
            }
        };

        loadInvoices();
        loadTemplates();
    }, []);

    const handleLogout = () => {
        logoutUser();
        navigate('/login');
    };

    const handleProfile = () => {
        navigate('/profile');
    };

    useEffect(() => {
        const loadTemplates = async () => {
            try {
                const templateData = await fetchTemplates();
                setTemplates(templateData);
            } catch (error) {
                console.error('Failed to load templates:', error);
            }
        };

        loadTemplates();
    }, []);

    const handleOpenTemplate = (templateId) => {
        navigate(`/template/${templateId}`); // Přesměrování na editor šablon
    };

    return (
        <Container maxWidth="lg">
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4 }}>
                <Typography variant="h4">Vítejte na hlavní stránce!</Typography>
                <Box>
                    <Button variant="outlined" color="primary" onClick={handleProfile} sx={{ mr: 2 }}>
                        Profil
                    </Button>
                    <Button variant="contained" color="secondary" onClick={handleLogout}>
                        Odhlásit se
                    </Button>
                </Box>
            </Box>

            <Grid container spacing={4} sx={{ mt: 4 }}>
                {/* Dynamický seznam šablon */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Dostupné šablony faktur</Typography>
                        <Box sx={{ mt: 2 }}>
                            {templates.length > 0 ? (
                                templates.map((template) => (
                                <Button
                                    key={template.id}
                                    variant="outlined"
                                    fullWidth
                                    sx={{ mb: 1 }}
                                    onClick={() => handleOpenTemplate(template.id)}
                                >
                                    {template.name}
                                </Button>
                                ))
                            ) : (
                                <Typography>Žádné šablony k dispozici.</Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>

                {/* Dynamický seznam vytvořených faktur */}
                <Grid item xs={12} md={6}>
                    <Paper sx={{ p: 2 }}>
                        <Typography variant="h6">Vytvořené faktury</Typography>
                        <Box sx={{ mt: 2 }}>
                            {invoices.length > 0 ? (
                                invoices.map((invoice) => (
                                    <Button
                                        key={invoice.id}
                                        variant="outlined"
                                        fullWidth
                                        sx={{ mb: 1 }}
                                        onClick={() => navigate(`/invoices/${invoice.id}`)}
                                    >
                                        {invoice.name || `Faktura ${invoice.id}`}
                                    </Button>
                                ))
                            ) : (
                                <Typography>Žádné faktury k dispozici.</Typography>
                            )}
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Dashboard;
