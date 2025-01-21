import ApiClient from './ApiClient';

class TemplateService {
    // Načte všechny šablony
    async getAllTemplates() {
        return await ApiClient.get('/templates');
    }

    // Načte konkrétní šablonu podle ID
    async getTemplateById(id) {
        return await ApiClient.get(`/templates/${id}`);
    }

    // Přidá novou šablonu
    async addTemplate(newTemplate) {
        return await ApiClient.post('/templates', newTemplate);
    }

    // Aktualizace šablony podle ID
    async updateTemplate(id, updatedTemplate) {
        return await ApiClient.put(`/templates/${id}`, updatedTemplate);
    }

    // Smazání šablony podle ID
    async deleteTemplate(id) {
        return await ApiClient.delete(`/templates/${id}`);
    }

    async loadHTMLTemplate(id) {
        try {
            const response = await fetch(`/templates_data/1.html`);
            if (!response.ok) {
                throw new Error(`Failed to load template: ${response.statusText}`);
            }
            const htmlString = await response.text();
            return htmlString;
        } catch (error) {
            console.error('Error loading template:', error);
            throw error; // Reraisuje chybu, aby komponenta věděla, že došlo k chybě
        }
    } 
}

export default new TemplateService();
