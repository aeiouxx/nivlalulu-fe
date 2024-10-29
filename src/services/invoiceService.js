import ApiClient from './ApiClient';

// Funkce pro načtení faktur
export const fetchInvoices = async () => {
    try {
        const response = await ApiClient.get('/invoices'); // Odeslání požadavku na endpoint /invoices
        return response; // Předpokládáme, že response obsahuje pole faktur
    } catch (error) {
        console.error('Error fetching invoices:', error);
        throw error;
    }
};
