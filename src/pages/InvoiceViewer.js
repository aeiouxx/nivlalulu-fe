import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import { ExitToApp, Delete } from '@mui/icons-material';
import InvoiceService from '../services/InvoiceService';
import TemplateService from '../services/TemplateService';


const InvoiceViewer = () => {
    const navigate = useNavigate();
    const { id } = useParams(); // ID faktury získané z URL
    const [jsonData, setJsonData] = useState({});
    const [htmlTemplate, setHtmlTemplate] = useState(''); // HTML šablona ze serveru
    const templateContainer = useRef(null); // Ref na kontejner pro šablonu

    useEffect(() => {
        const loadInvoiceData = async () => {
            try {
                // Požadavek na server nebo simulovanou službu pro HTML šablonu a data faktury
                const data = await InvoiceService.getInvoiceById(id);
                const html_data = await TemplateService.loadHTMLTemplate(data.template_id);
                console.log(html_data);
                setHtmlTemplate(html_data); // Nastavení HTML šablony
                setJsonData(data); // Nastavení dat faktury
            } catch (error) {
                console.error('Chyba při načítání faktury:', error);
            }
        };

        loadInvoiceData();
    }, [id]);

    useEffect(() => {
        if (templateContainer.current && htmlTemplate) {
            // Vloží HTML šablonu do kontejneru
            templateContainer.current.innerHTML = htmlTemplate;
            populateFields(templateContainer.current);
        }
    }, [htmlTemplate, jsonData]);

    // Funkce pro vyplnění dat v HTML šabloně
    const populateFields = (container) => {
        const processFields = (data, path = '') => {
            Object.keys(data).forEach((key) => {
                const fullPath = path ? `${path}.${key}` : key;
                const field = container.querySelector(`[data-field="${fullPath}"]`);

                if (typeof data[key] === 'object' && !Array.isArray(data[key])) {
                    processFields(data[key], fullPath); // Rekurzivní zpracování pro vnořená data
                } else if (Array.isArray(data[key])) {
                    const itemsContainer = container.querySelector(`[data-item="${fullPath}"]`);
                    if (itemsContainer) {
                        itemsContainer.innerHTML = ''; // Vyčistíme kontejner položek
                        data[key].forEach((item) => {
                            const itemRow = document.createElement('tr');
                            Object.keys(item).forEach((itemKey) => {
                                const cell = document.createElement('td');
                                cell.textContent = item[itemKey];
                                cell.classList.add(`${key}_${itemKey}`);
                                itemRow.appendChild(cell);
                            });
                            itemsContainer.appendChild(itemRow);
                        });
                    }
                } else if (field) {
                    field.textContent = data[key]; // Vyplnění pole pro čtení bez možnosti úprav
                    field.classList.add('readonly-field'); // Přidání třídy pro stylizaci pouze pro čtení
                }
            });
        };

        processFields(jsonData);
    };

    const handleDelete = (templateId) => {
        InvoiceService.deleteInvoice(id);
        navigate("/");
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mt: 4 }}>Zobrazení faktury</Typography>
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
                    color="secondary"
                    startIcon={<Delete />}
                    onClick={handleDelete}
                >
                    Odstranit
                </Button>
            </Box>
            <Box sx={{ mt: 2, border: '1px solid #ddd', padding: 2 }} ref={templateContainer}>
                {/* HTML šablona se vkládá přímo do templateContainer */}
            </Box>
            {/* CSS pro úpravu zobrazení pro čtení */}
            <style>
                {`
                    /* Styl pro zobrazení pro čtení */
                    .readonly-field {
                        background-color: #f5f5f5;
                        color: #333;
                        cursor: default;
                    }
                `}
            </style>
        </Container>
    );
};

export default InvoiceViewer;
