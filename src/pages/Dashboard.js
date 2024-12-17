import React, {useEffect, useState} from 'react';
import {Container, Typography, Button, Grid, Paper, Box, Stack} from '@mui/material';
import {useNavigate} from 'react-router-dom';
import AuthService from '../services/authService';
import InvoiceService from '../services/invoiceService';
import TemplateService from '../services/templateService';
import InvoiceList from "../components/InvoiceList";

const Dashboard = () => {
    const [invoices, setInvoices] = useState([]); // Stav pro seznam faktur
    const [templates, setTemplates] = useState([]); // Stav pro seznam šablon
    const navigate = useNavigate();

    useEffect(() => {
        const loadInvoices = async () => {
            try {
                const invoiceData = await InvoiceService.getAllInvoices(); // Načtení faktur
                setInvoices(invoiceData);
            } catch (error) {
                console.error('Chyba při načítání faktur:', error);
            }
        };

        const loadTemplates = async () => {
            try {
                const templateData = await TemplateService.getAllTemplates(); // Načtení šablon
                setTemplates(templateData);
            } catch (error) {
                console.error('Chyba při načítání šablon:', error);
            }
        };

        loadInvoices();
        loadTemplates();
    }, []);

    return (
        <Stack pt={4} spacing={6}>

            <Stack spacing={1}>
                <Typography variant="h4" fontWeight={"bold"}>{`Vítej zpět ${"Lukáš"}!`}</Typography>
                <Box maxWidth={500}>
                    <Typography color={"gray"}>
                        {`Rádi tě zase vidíme. Zkontroluj nejnovější faktury nebo si připrav novou šablonu pro své fakturace.`}
                    </Typography>
                </Box>
            </Stack>

            <InvoiceList label={"Šablony Faktur"} data={templates} navigateTo={"template"}/>
            <InvoiceList label={"Tvé Faktury"} data={invoices} navigateTo={"invoice"}/>

        </Stack>
    );
};

export default Dashboard;
