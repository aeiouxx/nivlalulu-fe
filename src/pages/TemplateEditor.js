import React, { useEffect, useState, useRef } from 'react';
import { redirect, useParams, useNavigate } from 'react-router-dom';
import { fetchHtmlTemplateAndData } from '../services/mock/templateService';
import { Container, Typography, Button, Box } from '@mui/material';
import { Add, Save, ExitToApp } from '@mui/icons-material';
import ApiClient from '../services/ApiClient'; // Import ApiClient

const TemplateEditor = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [jsonData, setJsonData] = useState({});
    const [htmlTemplate, setHtmlTemplate] = useState('');
    const templateContainer = useRef(null);

    useEffect(() => {
        const loadTemplateData = async () => {
            try {
                const { html, data } = await fetchHtmlTemplateAndData(id);
                setHtmlTemplate(html);
                setJsonData(data);
            } catch (error) {
                console.error('Chyba při načítání šablony:', error);
            }
        };

        loadTemplateData();
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
            field.contentEditable = true;
            field.classList.add('editable-highlight');
            field.addEventListener('focus', () => field.classList.remove('editable-highlight'));
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
                        itemsContainer.innerHTML = ''; // Vyčistíme kontejner položek
                        data[key].forEach((item, index) => {
                            const itemRow = document.createElement('tr');
                            itemRow.classList.add('item_block');
                            Object.keys(item).forEach((itemKey) => {
                                const cell = document.createElement('td');
                                cell.classList.add(`${key}_${itemKey}`);
                                cell.textContent = item[itemKey];
                                cell.contentEditable = true;
                                cell.classList.add('editable-highlight');
                                cell.addEventListener('focus', () => cell.classList.remove('editable-highlight'));
                                cell.addEventListener('blur', (e) => handleArrayFieldChange(fullPath, index, itemKey, e.target.innerText));
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

            if (path === 'items' && field === 'price') {
                const total = newData.items.reduce((sum, item) => sum + parseFloat(item.price || 0), 0);
                newData.total_price = total;
            }

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

    // Použití ApiClient pro odeslání dat na server
    const handleSaveInvoice = async () => {
        console.log(jsonData);
        navigate('/');
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mt: 4 }}>Editovatelná šablona</Typography>
            <Box sx={{ mt: 2, border: '1px solid #ddd', padding: 2 }} ref={templateContainer}>
                {/* HTML šablona se vkládá přímo do templateContainer */}
            </Box>

            <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
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
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<ExitToApp />}
                    onClick={ () => {navigate('/')}}
                >
                    Zavřít
                </Button>
            </Box>

            {/* CSS pro dočasné zvýraznění editovatelných polí */}
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
