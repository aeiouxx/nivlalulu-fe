import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import { Save, ExitToApp } from '@mui/icons-material';
import TemplateService from '../services/templateService';
import InvoiceService from '../services/invoiceService';

const InvoiceEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // ID faktury
    const [invoiceName, setInvoiceName] = useState('');
    const [jsonData, setJsonData] = useState({});
    const [htmlTemplate, setHtmlTemplate] = useState('');
    const templateContainer = useRef(null);

    useEffect(() => {
        const loadInvoiceData = async () => {
            try {
                // Načtení dat původní faktury a šablony
                const invoiceData = await InvoiceService.getInvoiceById(id);
                const templateData = await TemplateService.loadHTMLTemplate(invoiceData.template_id);

                setInvoiceName(invoiceData.invoice?.number);
                setJsonData(invoiceData);
                setHtmlTemplate(templateData);
            } catch (error) {
                console.error('Chyba při načítání faktury:', error);
            }
        };

        loadInvoiceData();
    }, [id]);

    useEffect(() => {
        if (templateContainer.current && htmlTemplate) {
            templateContainer.current.innerHTML = htmlTemplate;
            populateFields(templateContainer.current);
        }
    }, [htmlTemplate, jsonData]);

    const populateFields = (container) => {
        const updateField = (field, value) => {
            field.textContent = value;
            field.setAttribute('contentEditable', true);
            field.classList.add('editable-highlight');
            field.addEventListener('blur', (e) => {
                handleFieldChange(field.getAttribute('data-field'), e.target.innerText);
            });
        };

        const processFields = (data, path = '') => {
            Object.keys(data).forEach((key) => {
                const fullPath = path ? `${path}.${key}` : key;
                const field = container.querySelector(`[data-field="${fullPath}"]`);

                if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
                    processFields(data[key], fullPath);
                } else if (Array.isArray(data[key])) {
                    const itemsContainer = container.querySelector(`[data-item="${fullPath}"]`);
                    if (itemsContainer) {
                        itemsContainer.innerHTML = '';
                        data[key].forEach((item, index) => {
                            const itemRow = document.createElement('tr');
                            Object.keys(item).forEach((itemKey) => {
                                const cell = document.createElement('td');
                                cell.textContent = item[itemKey];
                                cell.setAttribute('contentEditable', true);
                                cell.classList.add('editable-highlight');
                                cell.addEventListener('blur', (e) =>
                                    handleArrayFieldChange(fullPath, index, itemKey, e.target.innerText)
                                );
                                itemRow.appendChild(cell);
                            });
                            itemsContainer.appendChild(itemRow);
                        });
                    }
                } else if (field) {
                    updateField(field, data[key]);
                }
            });
        };

        processFields(jsonData);
    };

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

    const handleArrayFieldChange = (path, index, field, value) => {
        setJsonData((prevData) => {
            const newData = { ...prevData };
            const keys = path.split('.');
            let current = newData;
            keys.forEach((key) => {
                current = current[key];
            });
            current[index][field] = value;
            return newData;
        });
    };

    const handleSaveInvoice = async () => {
        try {
            await InvoiceService.updateInvoice(id, { ...jsonData, name: invoiceName });
            navigate('/');
        } catch (error) {
            console.error('Chyba při ukládání faktury:', error);
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mt: 4 }}>Editace faktury</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ExitToApp />}
                    onClick={() => navigate('/')}
                >
                    Zavřít
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Save />}
                    onClick={handleSaveInvoice}
                >
                    Ulož fakturu
                </Button>
            </Box>
            <TextField
                margin="normal"
                required
                fullWidth
                name="invoiceName"
                label="Název faktury"
                value={invoiceName}
                onChange={(e) => setInvoiceName(e.target.value)}
            />
            <Box sx={{ mt: 2, border: '1px solid #ddd', padding: 2 }} ref={templateContainer}>
                {/* HTML šablona se vkládá přímo do templateContainer */}
            </Box>
            <style>
                {`
                    .editable-highlight {
                        background-color: #ffffcc;
                        outline: 1px dashed #ff9900;
                    }
                `}
            </style>
        </Container>
    );
};

export default InvoiceEditor;