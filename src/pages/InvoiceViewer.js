import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Typography, Button, Box} from '@mui/material';
import {ExitToApp, Delete, PictureAsPdf, Edit} from '@mui/icons-material';
import TemplateRenderer from '../components/TemplateRenderer';
import InvoiceService from '../services/invoiceService';
import TemplateService from '../services/templateService';
import html2pdf from 'html2pdf.js';
import {useGetInvoiceByIdQuery, useGetItemsQuery} from "../utils/redux/rtk/invoicesApi";

const InvoiceViewer = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [invoiceName, setInvoiceName] = useState('');
    const [jsonData, setJsonData] = useState(null);
    const [htmlTemplate, setHtmlTemplate] = useState('');
    //const {data: invoices2, error, isLoading} = useGetItemsQuery();
    const {data: invoice, isLoading: invoiceIsLoading, error: invoiceLoadingError} = useGetInvoiceByIdQuery(id);

    /*
    useEffect(() => {
        const loadInvoiceData = async () => {
            try {
                const data = await InvoiceService.getInvoiceById(id);
                const templateData = await TemplateService.loadHTMLTemplate(data.template_id);

                setInvoiceName(data?.name || '');
                setJsonData(data);
                setHtmlTemplate(templateData);
            } catch (error) {
                console.error('Chyba při načítání faktury:', error);
            }
        };

        loadInvoiceData();
    }, [id]);
     */

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const response = await fetch(`/templates_data/1/1.html`);
                if (response.ok) {
                    const templateData = await response.text();
                    setHtmlTemplate(templateData);
                    console.log(templateData)
                } else {
                    console.error("Failed to fetch template:", response.statusText);
                }
            } catch (error) {
                console.error("Error fetching template:", error);
            }
        };

        fetchTemplate();

    }, [id]);

    const handleDelete = async () => {
        await InvoiceService.deleteInvoice(id);
        navigate('/dashboard');
    };

    const handleExportToPDF = () => {
        const element = document.querySelector('#template-container');
        if (element) {
            const options = {
                margin: 1,
                filename: `${invoiceName}.pdf`,
                html2canvas: {scale: 2},
                jsPDF: {unit: 'mm', format: 'a4', orientation: 'portrait'},
            };
            html2pdf().set(options).from(element).save();
        }
    };

    if (invoiceIsLoading) return <p>Loading invoice...</p>;
    if (invoiceLoadingError) return <p>Error fetching invoice: {invoiceLoadingError.message}</p>;

    return (
        <Container maxWidth="lg">
            {
                JSON.stringify(invoices2.content[0])
            }
            <Typography variant="h4" sx={{mt: 4}}>Zobrazení faktury</Typography>
            <Box sx={{mt: 2, display: 'flex', gap: 2}}>
                <Button variant="contained" color="secondary" startIcon={<ExitToApp/>}
                        onClick={() => navigate('/dashboard')}>
                    Zavřít
                </Button>
                <Button variant="contained" color="secondary" startIcon={<Delete/>} onClick={handleDelete}>
                    Odstranit
                </Button>
                <Button variant="contained" color="primary" startIcon={<PictureAsPdf/>} onClick={handleExportToPDF}>
                    Exportovat do PDF
                </Button>
                <Button variant="contained" color="primary" startIcon={<Edit/>}
                        onClick={() => navigate(`/invoice/update/${id}`)}>
                    Úprava
                </Button>
            </Box>
            {htmlTemplate && !jsonData ? (
                <div id="template-container">
                    <TemplateRenderer htmlTemplate={htmlTemplate} jsonData={invoices2.content[0]} editable={false}/>
                </div>
            ) : (
                <Typography>Načítání...</Typography>
            )}
        </Container>
    );
};

export default InvoiceViewer;