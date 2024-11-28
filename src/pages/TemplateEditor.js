import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Button, Box, TextField } from '@mui/material';
import { Add, Save, ExitToApp } from '@mui/icons-material';
import TemplateService from '../services/templateService';
import InvoiceService from '../services/invoiceService';

const TemplateEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [invoiceName, setInvoiceName] = useState('');
    const [jsonData, setJsonData] = useState({});
    const [htmlTemplate, setHtmlTemplate] = useState('');
    const templateContainer = useRef(null);

    useEffect(() => {
        const loadTemplateData = async () => {
            try {
                const template_data = await TemplateService.getTemplateById(id);
                const data = template_data.fields
                const html_data = await TemplateService.loadHTMLTemplate(id);
                setHtmlTemplate(html_data);
                setJsonData(data);
            } catch (error) {
                console.error('Chyba při načítání šablony:', error);
            }
        };

        loadTemplateData();
    }, [id]);

    useEffect(() => {
        if (templateContainer.current && htmlTemplate) {
            // Vložení HTML šablony a aplikace funkce pro nastavení editovatelných polí
            templateContainer.current.innerHTML = htmlTemplate;
            populateFields(templateContainer.current);
        }
    }, [htmlTemplate, jsonData]);

    const populateFields = (container) => {
        const updateField = (field, value) => {
            field.textContent = value;
            field.setAttribute("contentEditable", true); // Přidání contentEditable
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
                            itemRow.style.height = "25px";
                            itemRow.classList.add('item_block');

                            // Vytvoření buněk s položkami
                            Object.keys(item).forEach((itemKey) => {
                                const cell = document.createElement('td');
                                cell.classList.add(`${key}_${itemKey}`);
                                cell.textContent = item[itemKey];
                                cell.setAttribute("contentEditable", true);
                                cell.classList.add('editable-highlight');
                                cell.addEventListener('blur', (e) => handleArrayFieldChange(fullPath, index, itemKey, e.target.innerText));
                                itemRow.appendChild(cell);
                            });

                            // Tlačítko pro odstranění řádku
                            const removeButtonCell = document.createElement('td');
                            const removeButton = document.createElement('button');
                            removeButton.textContent = 'Odstraň položku';
                            removeButton.onclick = () => handleRemoveItem(index, fullPath);
                            removeButtonCell.appendChild(removeButton);
                            itemRow.appendChild(removeButtonCell);

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

    const handleAddItem = () => {
        setJsonData((prevData) => {
            const newItems = [...(prevData.items || [])];
            const newItem = newItems[0]
                ? Object.fromEntries(Object.keys(newItems[0]).map((key) => [key, '']))
                : {};

            newItems.push(newItem);
            return { ...prevData, items: newItems };
        });
    };

    const handleSaveInvoice = async () => {
        console.log(jsonData);
        jsonData.template_id = id;
        jsonData.name = invoiceName;
        await InvoiceService.addInvoice(jsonData);
        navigate('/');
    };

    const handleRemoveItem = (index, path) => {
        const itemsContainer = templateContainer.current.querySelector(`[data-item="${path}"]`);
    
        if (itemsContainer && itemsContainer.children.length > 1) {
            setJsonData((prevData) => {
                const newData = { ...prevData };
                const keys = path.split('.');
                let current = newData;
    
                keys.forEach((key) => {
                    current = current[key];
                });
    
                // Pouze odstraní položku na daném indexu
                const updatedItems = current.filter((_, i) => i !== index);
                return { ...prevData, [keys[0]]: updatedItems };
            });
        }
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mt: 4 }}>Editovatelná šablona</Typography>
            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ExitToApp />}
                    onClick={() => { navigate('/') }}
                >
                    Zavřít
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Add />}
                    onClick={handleAddItem}
                >
                    Přidat položku
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
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
                label="Invoice name"
                type="text"
                id="invoiceName"
                autoComplete="current-password"
                value={invoiceName}
                onChange={(e) => setInvoiceName(e.target.value)}
            />
            <Box sx={{ mt: 2, border: '1px solid #ddd', padding: 2 }} ref={templateContainer}>
                {/* HTML šablona se vkládá přímo do templateContainer */}
            </Box>

            {/* CSS pro zvýraznění editovatelných polí */}
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

export default TemplateEditor;
