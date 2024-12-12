import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import { Add, Save, ExitToApp } from '@mui/icons-material';
import TemplateRenderer from '../components/TemplateRenderer';
import TemplateService from '../services/templateService';
import InvoiceService from '../services/invoiceService';

const TemplateEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [invoiceName, setInvoiceName] = useState('');
    const [jsonData, setJsonData] = useState(null);
    const [htmlTemplate, setHtmlTemplate] = useState('');
    const [itemTemplate, setItemTemplate]= useState({});

    useEffect(() => {
        const loadTemplateData = async () => {
            try {
                const templateData = await TemplateService.getTemplateById(id);
                const htmlData = await TemplateService.loadHTMLTemplate(id);
                setItemTemplate(templateData.fields.items[0]);
                setJsonData(templateData.fields || { items: [] });
                setHtmlTemplate(htmlData);
            } catch (error) {
                console.error('Chyba při načítání šablony:', error);
            }
        };

        loadTemplateData();
    }, [id]);

    const handleFieldChange = (path, value) => {
        setJsonData((prevData) => {
            const newData = { ...prevData };
            const keys = path.split('.');
            let current = newData;

            try {
                keys.forEach((key, index) => {
                    if (index === keys.length - 1) {
                        current[key] = value;
                    } else {
                        if (!current[key]) current[key] = {};
                        current = current[key];
                    }
                });
            } catch (error) {
                console.error('Chyba při změně pole:', error);
            }

            return newData;
        });
    };

    const handleRemoveItem = (index, path) => {
        setJsonData((prevData) => {
            const newData = { ...prevData };
            const keys = path.split('.');
            let current = newData;

            keys.forEach((key, i) => {
                if (i === keys.length - 1) {
                    current.splice(index, 1);
                } else {
                    current = current[key];
                }
            });

            return newData;
        });
    };

    const handleSaveInvoice = async () => {
        await InvoiceService.addInvoice({ ...jsonData, name: invoiceName, template_id: id });
        navigate('/');
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mt: 4 }}>Editovatelná šablona</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button variant="contained" color="secondary" startIcon={<ExitToApp />} onClick={() => navigate('/')}>
                    Zavřít
                </Button>
                <Button variant="contained" color="secondary" startIcon={<Save />} onClick={handleSaveInvoice}>
                    Ulož fakturu
                </Button>
            </Box>
            <TextField
                margin="normal"
                fullWidth
                label="Název faktury"
                value={invoiceName}
                onChange={(e) => setInvoiceName(e.target.value)}
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

export default TemplateEditor;