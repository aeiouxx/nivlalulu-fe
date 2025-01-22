import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Typography, Button, Box} from '@mui/material';
import {ExitToApp, Delete, PictureAsPdf, Edit} from '@mui/icons-material';
import TemplateRenderer from '../components/TemplateRenderer';
import InvoiceService from '../services/invoiceService';
import TemplateService from '../services/templateService';
import html2pdf from 'html2pdf.js';
import {useGetInvoiceByIdQuery, useGetItemsQuery} from "../utils/redux/rtk/invoicesApi";
import {useLoadHtmlTemplate} from "../functions/useLoadHtmlTemplate";
import {formatDateToUserInput} from "../functions/timeFunctions";
import {updatePrices} from "../functions/calculations/functions";

const InvoiceViewer = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [invoiceName, setInvoiceName] = useState('');
    const {data: invoice, isLoading: invoiceIsLoading, error: invoiceLoadingError} = useGetInvoiceByIdQuery(id);
    const {
        htmlTemplate, loading: htmlTemplateLoading, error: htmlTemplateLoadingError
    } = useLoadHtmlTemplate({id: "1-edit"});
    const [parsedInvoice, setParsedInvoice] = useState(null)

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

    useEffect(() => {
        if (invoice) {
            setParsedInvoice(prev => {
                const updatedInvoice = {
                    ...invoice,
                    created_at: formatDateToUserInput(invoice.created_at || "N/A"),
                    expires_at: formatDateToUserInput(invoice.expires_at || "N/A")
                };
                return updatePrices(updatedInvoice);
            });
        }
    }, [invoice, invoiceIsLoading]);

    if (invoiceIsLoading) return <p>Loading invoice...</p>;
    if (invoiceLoadingError) return <p>Error fetching invoice: {invoiceLoadingError.message}</p>;

    if (htmlTemplateLoading) return <p>Loading invoice...</p>;
    if (htmlTemplateLoadingError) return <p>Error fetching invoice: {htmlTemplateLoadingError.message}</p>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4" sx={{mt: 4}}>Zobrazení faktury</Typography>
            <Box sx={{mt: 2, display: 'flex', gap: 2}}>
                <Button variant="contained" color="secondary" startIcon={<ExitToApp/>}
                        onClick={() => navigate('/dashboard')}>
                    Zavřít
                </Button>
                <Button variant="contained" color="primary" startIcon={<PictureAsPdf/>} onClick={handleExportToPDF}>
                    Exportovat do PDF
                </Button>
                <Button variant="contained" color="primary" startIcon={<Edit/>}
                        onClick={() => navigate(`/invoice/update/${id}`)}>
                    Úprava
                </Button>
            </Box>
            <div id="template-container">
                <TemplateRenderer htmlTemplate={htmlTemplate} jsonData={parsedInvoice} editable={false}/>
            </div>
        </Container>
    );
};

export default InvoiceViewer;