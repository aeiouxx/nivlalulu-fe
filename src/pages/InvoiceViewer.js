import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button } from '@mui/material';
import {ExitToApp, Delete, PictureAsPdf, Edit} from '@mui/icons-material';
import InvoiceService from '../services/invoiceService';
import TemplateService from '../services/templateService';
import html2pdf from 'html2pdf.js';

const InvoiceViewer = () => {
    const navigate = useNavigate();
    const { id } = useParams();
    const [invoiceName, setInvoiceName] = useState('');
    const [jsonData, setJsonData] = useState({});
    const [htmlTemplate, setHtmlTemplate] = useState('');
    const templateContainer = useRef(null);

    useEffect(() => {
        const loadInvoiceData = async () => {
            try {
                const data = await InvoiceService.getInvoiceById(id);
                setInvoiceName(data?.name);
                const html_data = await TemplateService.loadHTMLTemplate(data.template_id);
                setHtmlTemplate(html_data);
                setJsonData(data);
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
                    field.textContent = data[key];
                    field.classList.add('readonly-field');
                }
            });
        };

        processFields(jsonData);
    };

    const handleDelete = () => {
        InvoiceService.deleteInvoice(id);
        navigate('/');
    };

    const handleExportToPDF = () => {
        const element = templateContainer.current;
        if (element) {
            const options = {
                margin: 1,
                filename: `${invoiceName}.pdf`,
                html2canvas: { scale: 2 },
                jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' },
            };
            html2pdf().set(options).from(element).save();
        }
    };

    const handleEditInvoice = () => {
        navigate(`/invoice/update/${id}`);
    };

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{ mt: 4 }}>Zobrazení faktury</Typography>
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
                    color="secondary"
                    startIcon={<Delete />}
                    onClick={handleDelete}
                >
                    Odstranit
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<PictureAsPdf />}
                    onClick={handleExportToPDF}
                >
                    Exportovat do PDF
                </Button>
                <Button
                    variant="contained"
                    color="primary"
                    startIcon={<Edit />}
                    onClick={handleEditInvoice}
                >
                    Úprava
                </Button>
            </Box>
            <Box sx={{ mt: 2, border: '1px solid #ddd', padding: 2 }} ref={templateContainer}>
                {/* HTML šablona se vkládá přímo do templateContainer */}
            </Box>
            <style>
                {`
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