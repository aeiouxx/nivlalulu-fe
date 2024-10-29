import ApiClient from '../utils/ApiClient';

// Funkce pro načtení šablon
export const fetchTemplates = async () => {
    try {
        const response = await ApiClient.get('/templates'); // Odeslání požadavku na endpoint /templates
        return response; // Předpokládáme, že response obsahuje pole šablon
    } catch (error) {
        console.error('Error fetching templates:', error);
        throw error;
    }
};
