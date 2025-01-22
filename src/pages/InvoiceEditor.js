import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Typography, Button, TextField, Box} from '@mui/material';
import {Save, ExitToApp} from '@mui/icons-material';
import TemplateRenderer from '../components/TemplateRenderer';
import InvoiceService from '../services/invoiceService';
import TemplateService from '../services/templateService';
import {useLoadHtmlTemplate} from "../functions/useLoadHtmlTemplate";
import {useGetInvoiceByIdQuery, useUpdateInvoiceMutation} from "../utils/redux/rtk/invoicesApi";
import {formatDateToUserInput, parseUserInputToDate} from "../functions/timeFunctions";
import {removeEmptyKeys} from "../functions/removeEmptyKeys";
import {updatePrices} from "../functions/calculations/functions";

const InvoiceEditor = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [invoiceName, setInvoiceName] = useState('');
    const [jsonData, setJsonData] = useState(null);
    const [jsonDataInitialized, setJsonDataInitialized] = useState(false)
    const [htmlTemplate, setHtmlTemplate] = useState('');
    const [itemTemplate, setItemTemplate] = useState({});
    const [updateInvoice] = useUpdateInvoiceMutation();
    const {data: invoice, isLoading: invoiceIsLoading, error: invoiceLoadingError} = useGetInvoiceByIdQuery(id);

    const {
        htmlTemplate: htmlLoadedTemplate,
        loading: htmlTemplateLoading,
        error: htmlTemplateLoadingError
    } = useLoadHtmlTemplate({id: "1-edit"});

    useEffect(() => {
        if (htmlLoadedTemplate) {
            setHtmlTemplate(htmlLoadedTemplate);
        }
    }, [htmlTemplateLoading])

    useEffect(() => {
        if (invoice) {
            setItemTemplate(invoice.items[0]);
            setJsonData(invoice)
        }
    }, [invoiceIsLoading]);

    useEffect(() => {
        if (jsonData && !jsonDataInitialized) {
            setJsonData(prev => {
                const updatedInvoice = {
                    ...jsonData,
                    created_at: formatDateToUserInput(new Date()),
                    expires_at: formatDateToUserInput(new Date()),
                }
                return updatePrices(updatedInvoice)
            });
            setJsonDataInitialized(true)
        }
    }, [jsonData, jsonDataInitialized])


    const handleFieldChange = (path, value) => {
        setJsonData((prevData) => {
            const newData = JSON.parse(JSON.stringify(prevData)); // Hluboká kopie
            const keys = path.split('.');
            let current = newData;

            try {
                keys.forEach((key, index) => {
                    if (index === keys.length - 1) {
                        current[key] = value; // Nastavení nové hodnoty
                    } else {
                        if (!current[key]) current[key] = {}; // Inicializace prázdného objektu
                        current = current[key];
                    }
                });
            } catch (error) {
                console.error('Chyba při změně pole:', error);
            }

            return updatePrices(newData);
        });
    };

    const handleUpdateInvoice = async () => {

        const parsedData = {
            ...jsonData,
            created_at: parseUserInputToDate(jsonData.created_at)?.toISOString() || "",
            expires_at: parseUserInputToDate(jsonData.expires_at)?.toISOString() || ""
        };

        try {

            const result = await updateInvoice({id: id, fieldsObj: removeEmptyKeys(parsedData)}).unwrap();

            if (result.error) {
                console.error('Chyba při ukládání faktury:', result.error);
                const errorMessages = result.error.data;
                alert("Fakturu se nepodařilo uložit, oprav chyby:\n\n" + Object.values(errorMessages).join("\n"));
                return
            }

        } catch (e) {
            console.error('Chyba při ukládání faktury:', e.message);
        }

        alert("Faktura úspěšně uložena")
        navigate('/dashboard');


    };


    if (invoiceIsLoading) return <p>Loading invoice...</p>;
    if (invoiceLoadingError) return <p>Error fetching invoice: {invoiceLoadingError.message}</p>;

    if (htmlTemplateLoading) return <p>Loading templates...</p>;
    if (htmlTemplateLoadingError) return <p>Error fetching templates: {htmlTemplateLoadingError.message}</p>;

    return (
        <Container maxWidth="lg">
            <Typography variant="h4">Editace faktury</Typography>
            <Box sx={{mt: 2, display: 'flex', gap: 2}}>
                <Button variant="contained" color="secondary" startIcon={<ExitToApp/>}
                        onClick={() => navigate("/dashboard")}>
                    Zpět
                </Button>
                <Button variant="contained" color="primary" onClick={handleUpdateInvoice} startIcon={<Save/>}>
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