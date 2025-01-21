import React, {useEffect, useState} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Container, Typography, Button, Box, TextField} from '@mui/material';
import {Add, Save, ExitToApp} from '@mui/icons-material';
import TemplateRenderer from '../components/TemplateRenderer';
import TemplateService from '../services/templateService';
import InvoiceService from '../services/invoiceService';
import {useLoadJsonTemplate} from "../functions/useLoadJsonTemplate";
import {useLoadHtmlTemplate} from "../functions/useLoadHtmlTemplate";
import {useCreateInvoiceMutation} from "../utils/redux/rtk/invoicesApi";
import {formatDateToUserInput, parseUserInputToDate} from "../functions/timeFunctions";

const TemplateEditor = () => {
    const navigate = useNavigate();
    const {id} = useParams();
    const [invoiceName, setInvoiceName] = useState('');
    const [jsonData, setJsonData] = useState(null);
    const [jsonDataInitialized, setJsonDataInitialized] = useState(false)
    const [htmlTemplate, setHtmlTemplate] = useState('');
    const [itemTemplate, setItemTemplate] = useState({});

    const {jsonTemplate, loading: jsonTemplateLoading, error: jsonTemplateLoadingError} = useLoadJsonTemplate({id: 1});
    const {
        htmlTemplate: htmlLoadedTemplate,
        loading: htmlTemplateLoading,
        error: htmlTemplateLoadingError
    } = useLoadHtmlTemplate({id: 1});
    const [createInvoice] = useCreateInvoiceMutation();

    useEffect(() => {
        if (jsonTemplate.length > 0) {
            setItemTemplate(jsonTemplate[0].fields.items[0]);
            setJsonData(jsonTemplate[0].fields || {items: []});
        }
    }, [jsonTemplateLoading])

    useEffect(() => {
        if (htmlLoadedTemplate) {
            setHtmlTemplate(htmlLoadedTemplate);
        }
    }, [htmlTemplateLoading])

    useEffect(() => {
        if (jsonData && !jsonDataInitialized) {
            setJsonData({
                ...jsonData,
                total_value: 0,
                created_at: formatDateToUserInput(new Date()),
                expires_at: formatDateToUserInput(new Date()),
                variable_symbol: 0,
                tax_value: 0,
                raw_value: 0,
                paymentMethod: "P",
            });
            console.log("INIT: ", jsonData)
            setJsonDataInitialized(true)
        }
        console.log("CHANGE: ", jsonData)
    }, [jsonData, jsonDataInitialized])
    /*


    useEffect(() => {
        const loadTemplateData = async () => {
            try {
                const templateData = await TemplateService.getTemplateById(id);
                const htmlData = await TemplateService.loadHTMLTemplate(id);
                setItemTemplate(templateData.fields.items[0]);
                setJsonData(templateData.fields || {items: []});
                setHtmlTemplate(htmlData);
            } catch (error) {
                console.error('Chyba při načítání šablony:', error);
            }
        };

        loadTemplateData();
    }, [id]);

     */

    const handleFieldChange = (path, value) => {
        setJsonData((prevData) => {
            const newData = {...prevData};
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

    const handleSaveInvoice = async () => {
        console.log(jsonData)

        const parsedData = {
            ...jsonData,
            created_at: parseUserInputToDate(jsonData.created_at),
            expires_at: parseUserInputToDate(jsonData.expires_at)
        };

        if (parsedData.customer.icTax === "" && parsedData.supplier.icTax === "") {
            delete parsedData.customer.icTax
            delete parsedData.suplier.icTax
        }
        const result = await createInvoice(parsedData);

        if (result.error) {
            console.error('Chyba při vytváření faktury:', result.error);
            const errorMessages = result.error.data;
            alert("Fakturu se nepodařilo uložit, oprav chyby:\n\n" + Object.values(errorMessages).join("\n"));
            //navigate('/dashboard');
            return
        }
        console.log('Faktura vytvořena:', result);
        alert("Faktura úspěšně vytvořena")
    };

    if (jsonTemplateLoading) return <p>Loading templates...</p>;
    if (jsonTemplateLoadingError) return <p>Error fetching templates: {jsonTemplateLoadingError.message}</p>;

    if (htmlTemplateLoading) return <p>Loading templates...</p>;
    if (htmlTemplateLoadingError) return <p>Error fetching templates: {htmlTemplateLoadingError.message}</p>;

    return (
        <Container maxWidth="lg">
            {JSON.stringify(jsonData)}
            <Typography variant="h4" sx={{mt: 4}}>Editovatelná šablona</Typography>
            <Box sx={{mt: 2, display: 'flex', gap: 2}}>
                <Button variant="contained" color="secondary" startIcon={<ExitToApp/>}
                        onClick={() => navigate('/dashboard')}>
                    Zavřít
                </Button>
                <Button variant="contained" color="secondary" startIcon={<Save/>} onClick={handleSaveInvoice}>
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