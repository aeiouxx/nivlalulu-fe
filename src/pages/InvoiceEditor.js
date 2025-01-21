import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, TextField, Box } from '@mui/material';
import { Save, ExitToApp } from '@mui/icons-material';
import TemplateRenderer from '../components/TemplateRenderer';
import InvoiceService from '../services/invoiceService';
import TemplateService from '../services/templateService';

const InvoiceEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [invoiceName, setInvoiceName] = useState('');
    const [jsonData, setJsonData] = useState(null);
    const [htmlTemplate, setHtmlTemplate] = useState('');
    const [itemTemplate, setItemTemplate] = useState({});

    useEffect(() => {
        const loadInvoiceData = async () => {
            try {
                const invoiceData = await InvoiceService.getInvoiceById(id);
                const templateData = await TemplateService.loadHTMLTemplate(invoiceData.template_id);
                var itemsData = {}
                Object.keys(invoiceData.items[0]).forEach(key => {
                    itemsData[key] = '';
                });
                setItemTemplate(itemsData || {});
                setInvoiceName(invoiceData.invoice?.number || '');
                setJsonData(invoiceData);
                setHtmlTemplate(templateData);
            } catch (error) {
                console.error('Chyba při načítání faktury:', error);
            }
        };

        loadInvoiceData();
    }, [id]);

    // Funkce pro změnu hodnoty pole
    const handleFieldChange = (path, value) => {
        setJsonData((prevData) => {
            const newData = { ...prevData };
            const keys = path.split('.');
            let current = newData;
            keys.forEach((key, index) => {
                if (index === keys.length - 1) {
                    current[key] = value;
                } else {
                    current = current[key];
                }
            });
            return newData;
        });
    };

    // Funkce pro přidání nové položky
    const handleAddItem = (path) => {
        setJsonData((prevData) => {
            const newData = { ...prevData };
            const keys = path.split('.');
            let current = newData;
            keys.forEach((key) => {
                if (!current[key]) current[key] = [];
                current = current[key];
            });
            current.push({ ...itemTemplate });
            return newData;
        });
    };

    // Funkce pro odstranění položky
    const handleRemoveItem = (path, index) => {
        setJsonData((prevData) => {
            const newData = { ...prevData };
            const keys = path.split('.');
            let current = newData;
            keys.forEach((key) => {
                current = current[key];
            });
            current.splice(index, 1);
            return newData;
        });
    };

    // Funkce pro uložení faktury
    const handleSaveInvoice = async () => {
        try {
            await InvoiceService.updateInvoice(id, { ...jsonData, name: invoiceName });
            navigate('/dashboard');
        } catch (error) {
            console.error('Chyba při ukládání faktury:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4">Editace faktury</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="secondary" startIcon={<ExitToApp />} onClick={() => navigate(-1)}>
                    Zpět
                </Button>
                <Button variant="contained" color="primary" onClick={handleSaveInvoice} startIcon={<Save />}>
                    Ulož fakturu
                </Button>
            </Box>
            <TextField
                label="Název faktury"
                value={invoiceName}
                onChange={(e) => setInvoiceName(e.target.value)}
                fullWidth
                margin="normal"
            />
            <TemplateRenderer
                htmlTemplate={htmlTemplate}
                jsonData={jsonData}
                editable={true}
                onFieldChange={handleFieldChange}
                onUpdateData={setJsonData}
                itemTemplate={itemTemplate}
            />
            {htmlTemplate && jsonData ? (
                <TemplateRenderer
                    htmlTemplate={htmlTemplate}
                    jsonData={jsonData}
                    editable={true}
                    onFieldChange={handleFieldChange}
                    onUpdateData={setJsonData}
                    itemTemplate={itemTemplate}
                />
            ) : (
                <Typography>Načítání...</Typography>
            )}
        </Container>
    );
};

export default InvoiceEditor;